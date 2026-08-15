# evpro-quote

Public, no-login fleet-quote intake form for EV.PRO customers. Standalone
Vite + React app. For now, submissions are **emailed** to sales — nothing is
written to the Volta database.

## Stack

- **Vite + React** — same as Volta.
- **Supabase edge function** — `submit-quote`, hosted in Volta's Supabase
  *functions* endpoint (`alaxasyzbibizsbkoyme`). It is **stateless**: it emails
  the submission to sales and writes **nothing** to the Volta database. Public
  form, `--no-verify-jwt`; the anon key only satisfies the gateway.
- **Resend** — transactional email (needs `RESEND_API_KEY`).
- **Vercel** — deploy target (subdomain e.g. `quote.ev.pro`).

## Develop

```bash
npm install
npm run dev
```

## Hosting

Live at **https://evpro-inc.github.io/evpro-quote/** (GitHub Pages, served from a
`/evpro-quote/` subpath). Every push to `main` auto-builds and deploys via the
`.github/workflows/deploy.yml` Action — no manual redeploy. The build sets
`BASE_PATH=/evpro-quote/`; local dev and any root-domain host (e.g. Vercel) use `/`.

## Deploy the edge function

```bash
supabase functions deploy submit-quote --no-verify-jwt --project-ref alaxasyzbibizsbkoyme
supabase secrets set RESEND_API_KEY=re_xxx --project-ref alaxasyzbibizsbkoyme
# optional overrides:
supabase secrets set QUOTE_NOTIFY_EMAIL=ashley@ev.pro --project-ref alaxasyzbibizsbkoyme
```

## Build phases

- [x] Phase 1 — scaffold + brand shell
- [x] Phase 2 — 3-step intake form (contact → vehicle cards → review)
- [x] Phase 3 — `submit-quote` edge fn emails sales (Resend); honeypot; no DB writes
- [ ] Phase 4 — Slack notification + Cloudflare Turnstile
- [ ] Phase 5 — persist to `quote_requests` / admin "Quotes" view in Volta
