# evpro-quote

Public, no-login fleet-quote intake form for EV.PRO customers. Standalone
Vite + React app that shares the Volta (`evpro-fleet`) Supabase project so
submissions land next to fleet data.

## Stack

- **Vite + React** — same as Volta.
- **Supabase** — same project (`alaxasyzbibizsbkoyme`). Public writes go through
  the `submit-quote` edge function (service role, `--no-verify-jwt`); the browser
  never gets elevated DB access and there are no anon INSERT policies.
- **Vercel** — deploy target (subdomain e.g. `quote.ev.pro`).

## Develop

```bash
npm install
npm run dev
```

## Build phases

- [x] Phase 1 — scaffold + brand shell (this commit)
- [ ] Phase 2 — 3-step intake form (contact → vehicle cards → review)
- [ ] Phase 3 — `quote_requests` / `quote_vehicles` tables + `submit-quote` edge fn
- [ ] Phase 4 — honeypot + Turnstile anti-spam + Slack notification
- [ ] Phase 5 — admin "Quotes" view inside Volta
