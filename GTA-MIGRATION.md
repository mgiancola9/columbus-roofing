# GTA Roofing Estimates — Migration Action Plan

> **Goal:** Migrate the lead-gen business from Columbus, OH → Toronto / GTA branding.
> **Strategy:** Clean cutover, non-destructive. Columbus is **paused** (ads off, assets dormant) — not deleted. Toronto becomes the live business.
> **Implication:** No multi-market logic needed (no `market` tags, no market-aware routing). Just rebrand and repoint.
> **Created:** 2026-06-21 · **Branch:** `gta-estimates`

---

## Legend
- 🧑 = **You** (accounts / infra / external services I can't access)
- 🤖 = **Claude** can do this in the codebase
- ⚠️ = blocker or gotcha to watch

---

## Key Findings (current state of `gta-estimates` branch)
- New site is a real **Next.js 15 App Router** app (React 19, Tailwind) — **not** the old static HTML. Netlify must use the **Next.js runtime** (not static export).
- **The lead pipeline is NOT wired up.** `app/api/leads/route.ts` only `console.log`s the lead — no Supabase insert, no n8n call (all `// TODO`). **This is the #1 thing that broke in Columbus and the heart of this migration.**
- A server-side API route is the *right* architecture — the Supabase key stops being exposed in HTML (upgrade over Columbus).
- ⚠️ Domain spelling inconsistent: `.env.example` says `gtaroofingstimates.ca` (missing an "e") vs `gtaroofingestimates` elsewhere. **Lock this before registering anything.**
- New app does not reference Supabase at all yet (no env vars).
- ⚠️ `next@15.1.0` has a known CVE (CVE-2025-66478) — patch before launch.
- Env var prefix changes: Next.js uses `NEXT_PUBLIC_*`, **not** the old Vite `VITE_*`.

---

## Phase 0 — Lock the foundation *(do first; everything keys off these)*
- [ ] 🧑 ⚠️ **Lock exact domain spelling**, register the `.ca` domain, and confirm it. Gets baked into DNS, email, pixels, links.
- [ ] 🧑 **Get a Toronto phone number** (416 / 647 / 437) — Twilio or forwarding. Placeholder until then.
- [ ] 🧑 **Decide branch strategy** — recommend merging `gta-estimates` → `main` once wired up, so `main` *is* the GTA business (cleaner Netlify auto-deploy).

## Phase 1 — Rebuild the lead pipeline 🤖 *(technical heart)*
- [ ] 🤖 Wire `app/api/leads/route.ts` to **insert leads into Supabase** (server-side).
- [ ] 🤖 **Fan out to n8n** — same route POSTs to the production n8n webhook (Cloudflare-tunnel URL) for instant SMS/email alert = speed-to-lead.
- [ ] 🤖 Add env vars to `.env` / `.env.example`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or server-side service-role key), `LEAD_WEBHOOK_URL`.
- [ ] 🧑 **Create fresh GTA Supabase project** (recommended over reuse), run the Columbus schema (`leads`, `contractors`, `lead_activity`, `leads_with_contractor` view), seed parents' contractor. Hand over URL + keys.

## Phase 2 — Rebrand the site 🤖
- [ ] 🤖 Find-and-replace geo/brand across `app/` + `components/`: Columbus→Toronto/GTA, Ohio→Ontario, Franklin County→GTA.
- [ ] 🤖 **ZIP → postal code** — form field + Canadian validation (`M5V 2T6` format, not 5-digit).
- [ ] 🤖 USD → CAD; US spelling → Canadian (neighbourhood, favour, etc.).
- [ ] 🤖 Swap GA + Meta pixel IDs for new Toronto ones (you create, I wire).
- [ ] 🧑 Tweak copy/design bits you want changed.

## Phase 3 — Deploy 🧑 + 🤖
- [ ] 🤖 Add `netlify.toml` (or rely on auto-detect) + **patch the `next` CVE** to a safe 15.x.
- [ ] 🧑 New **Netlify site**, connect repo/branch, set env vars (`NEXT_PUBLIC_*` — not `VITE_*`), attach GTA domain + SSL.
- [ ] 🧑 Configure **n8n production workflow** for GTA: webhook → SMS/email to you (+ contractor for instant handoff).

## Phase 4 — CRM for Toronto 🤖 + 🧑
- [ ] 🧑 Decide CRM scope: **repoint existing React CRM** to new Supabase (fast, recommended) vs. new build.
- [ ] 🤖 Rebrand CRM to GTA, point at new Supabase env vars.
- [ ] 🧑 Deploy CRM (Vercel/Netlify) so you + partner + contractor can log in.

## Phase 5 — Meta Ads 🧑
- [ ] 🧑 New/duplicated campaigns targeting GTA geography.
- [ ] 🧑 New pixels, ad creative (partner), CAD budgets.

## Phase 6 — Cutover & housekeeping 🧑 + 🤖
- [ ] 🤖 Rewrite `AGENTS.md` → the GTA playbook (new source of truth).
- [ ] 🧑 Pause Columbus cleanly: ads off, mark site dormant, export old data if wanted.
- [ ] 🧑 **End-to-end test:** submit a real lead on live GTA site → confirm it lands in Supabase, fires n8n alert, appears in CRM, contractor gets handoff.

---

## Critical Path
`#1 domain → Phase 1 pipeline → Phase 3 deploy → #20 e2e test`
Phase 2 (rebrand) can run in parallel anytime.

## Immediate Next Step
**Phase 1** can start now. Claude needs only:
1. The locked **domain spelling**, and
2. The **n8n webhook URL** (from your n8n instance / recent commit history).
