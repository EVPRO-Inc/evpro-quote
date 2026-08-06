/**
 * Public Fleet-Quote Intake — Supabase Edge Function
 *
 * Powers the unauthenticated quote form in the evpro-quote app. Auth-free by
 * design (a public marketing form); the anon key only satisfies the Supabase
 * gateway. Deploy with --no-verify-jwt.
 *
 * IMPORTANT: this function is intentionally STATELESS. It writes NOTHING to the
 * Volta database — it only formats the submission and emails it to the sales
 * inbox. Persistence (a quote_requests table) and Slack routing are deliberately
 * left for later phases; nothing here touches Volta's data.
 *
 * POST body: { company, contactName, contactEmail, phone, vehicles: [...],
 *              website? }  ("website" is a honeypot — bots fill it, humans don't)
 * Returns:   { ok: true }  on success.
 *
 * Env:
 *   RESEND_API_KEY     required — transactional email (https://resend.com)
 *   QUOTE_NOTIFY_EMAIL where to send (default ashley@ev.pro)
 *   QUOTE_FROM_EMAIL   verified sender (default onboarding@resend.dev for testing)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const NOTIFY_TO = Deno.env.get('QUOTE_NOTIFY_EMAIL') || 'ashley@ev.pro'
const FROM      = Deno.env.get('QUOTE_FROM_EMAIL')   || 'EV.PRO Quotes <onboarding@resend.dev>'

const MAX_VEHICLES = 100

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

const s = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const esc = (v: unknown) =>
  s(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function qty(v: Record<string, unknown>): number {
  const n = parseInt(String(v.qty ?? ''), 10)
  return Number.isFinite(n) && n > 0 ? n : 1
}
function modelOf(v: Record<string, unknown>): string {
  return s(v.model) === 'Other' ? s(v.modelOther) : s(v.model)
}
function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return y && m && d ? `${m}/${d}/${y}` : iso
}
function productsOf(v: Record<string, unknown>): string[] {
  const out: string[] = []
  if (v.needsVaas) out.push('Vehicle-as-a-Service')
  if (v.needsCaas) out.push('Charger-as-a-Service')
  if (v.needsOm) out.push('Operations & Maintenance (O&M)')
  return out
}
function hasContent(v: Record<string, unknown>): boolean {
  return Boolean(s(v.make) || modelOf(v))
}

function renderVehicleHtml(v: Record<string, unknown>, i: number): string {
  const name = [s(v.make), modelOf(v)].filter(Boolean).join(' ') || `Vehicle ${i + 1}`
  const specs: string[] = []
  const add = (label: string, val: string) => { if (val) specs.push(`<b>${label}:</b> ${esc(val)}`) }
  if (s(v.condition) && s(v.condition) !== 'Either') add('Condition', s(v.condition))
  add('Color', s(v.color))
  add('Trim', s(v.trim))
  add('Max daily miles', s(v.dailyMiles))
  add('Annual miles', s(v.annualMiles))
  if (s(v.targetDelivery)) add('Target delivery', fmtDate(s(v.targetDelivery)))
  const address = [s(v.garagingAddress), s(v.city), s(v.state), s(v.zip)].filter(Boolean).join(', ')
  if (address) add('Garaging', address)
  const prod = productsOf(v)
  if (prod.length) add('Products', prod.join(', '))
  if (s(v.comments)) add('Comments', s(v.comments))

  return `
    <tr><td style="padding:12px 16px;border:1px solid #E4E7EE;border-radius:8px;">
      <div style="font-weight:600;font-size:15px;margin-bottom:6px;">
        ${qty(v) > 1 ? `<span style="background:#EEF1FB;color:#0021F8;padding:1px 8px;border-radius:99px;font-size:12px;margin-right:6px;">${qty(v)}×</span>` : ''}${esc(name)}
      </div>
      <div style="font-size:13px;color:#444;line-height:1.7;">${specs.join('<br>')}</div>
    </td></tr>`
}

function buildEmail(body: Record<string, unknown>) {
  const company = s(body.company) || '(no company)'
  const vehicles = (Array.isArray(body.vehicles) ? body.vehicles : []) as Record<string, unknown>[]
  const filled = vehicles.filter(hasContent)
  const units = vehicles.reduce((n, v) => n + qty(v), 0)

  const contact = [s(body.contactName), s(body.contactEmail), s(body.phone)].filter(Boolean).join(' · ')
  const subject = `New fleet quote — ${company} (${units} vehicle${units === 1 ? '' : 's'})`

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:0 auto;color:#202020;">
      <h2 style="color:#0021F8;">New fleet quote request</h2>
      <p style="font-size:15px;"><b>${esc(company)}</b><br>
        <span style="color:#666;">${esc(contact)}</span></p>
      <p style="font-size:13px;color:#666;">${units} vehicle${units === 1 ? '' : 's'} across ${filled.length} configuration${filled.length === 1 ? '' : 's'}</p>
      <table style="width:100%;border-collapse:separate;border-spacing:0 8px;">
        ${filled.map(renderVehicleHtml).join('')}
      </table>
    </div>`

  const text =
    `New fleet quote request\n\n${company}\n${contact}\n${units} vehicle(s)\n\n` +
    filled.map((v, i) => {
      const name = [s(v.make), modelOf(v)].filter(Boolean).join(' ') || `Vehicle ${i + 1}`
      return `${qty(v)}× ${name}`
    }).join('\n')

  return { subject, html, text, replyTo: s(body.contactEmail) || undefined }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON.' }, 400)
  }

  // Honeypot: real users never fill the hidden "website" field. Silently accept
  // so the bot thinks it worked, but send nothing.
  if (s(body.website)) return json({ ok: true })

  const vehicles = Array.isArray(body.vehicles) ? body.vehicles : []
  if (!s(body.company)) return json({ error: 'Company name is required.' }, 400)
  if (!s(body.contactEmail)) return json({ error: 'Work email is required.' }, 400)
  if (vehicles.length > MAX_VEHICLES) return json({ error: 'Too many vehicles.' }, 400)

  const apiKey = Deno.env.get('RESEND_API_KEY')
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set')
    return json({ error: 'Email is not configured yet.' }, 500)
  }

  const { subject, html, text, replyTo } = buildEmail(body)

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [NOTIFY_TO],
      reply_to: replyTo,
      subject,
      html,
      text,
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error('Resend failed', res.status, detail)
    return json({ error: 'Could not send the request. Please try again.' }, 502)
  }

  return json({ ok: true })
})
