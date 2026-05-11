# A&G Digital — Columbus Roofing Lead Gen System
## Project Context for Claude (AGENTS.md)

> **Last updated:** May 9, 2026
> **Founders:** Mike (tech/infrastructure) & Partner (ad creative/design)
> **Status:** Pre-ads launch — pipeline integration in progress

---

## What This Business Does

A&G Digital is an AI lead generation agency. We run Meta (Facebook/Instagram) ads targeting Columbus, OH homeowners who need roofing work. When they click our ads, they land on our website, fill out a form, and become a lead. We qualify that lead manually (phone call), then send it to a roofing contractor client who pays us per lead or on a monthly retainer.

**Current client:** "The Roofing Guy" (contact: John) — in free trial phase (5 free leads to prove quality)

**Revenue model:**
- Pay Per Lead: $50/lead
- Monthly Growth Plan: $500/mo (~10 guaranteed leads)
- Free trial: 5 leads to prove quality before converting to paid

---

## Architecture Overview

```
[Meta Ads] → [Landing Pages on Netlify] → [Form Submission]
                                               ↓
                                    ┌──────────┼──────────┐
                                    ↓          ↓          ↓
                              [Netlify     [Supabase   [Meta Pixel
                               Forms]      REST API]    Lead Event]
                                    ↓          ↓
                              [Zapier]    [CRM Dashboard]
                                    ↓
                              [Gmail +     
                               SMS alert]
                                    ↓
                          [Mike calls lead to qualify]
                                    ↓
                          [Text lead info to contractor]
```

**Target state (what we're building toward):**
```
[Meta Ads] → [Landing Pages] → [Form Submission]
                                      ↓
                                [n8n Webhook]
                                      ↓
                          ┌───────────┼───────────┐
                          ↓           ↓           ↓
                    [Supabase    [SMS/Email    [Lead Enrichment
                     Insert]     Alert]        & Scoring]
                          ↓                        ↓
                    [CRM Dashboard]          [Smart Routing
                          ↓                   to Contractor]
                    [Contractor Portal]
```

---

## Infrastructure — What Exists Today

### 1. Landing Pages (Netlify)
- **Site:** https://columbusroofingestimates.com
- **Netlify project:** `columbusroofestimates`
- **GitHub repo:** `columbus-roofing` (private) — deploy should be connected to this
- **Phone on site:** (614) 957-2204 (Twilio, redirects to personal phone)

**Three pages:**
| Page | URL Path | Purpose | Meta Pixel ID |
|------|----------|---------|---------------|
| Main Website | `/` (index.html) | General landing page | `973653530243367` (Website Pixel, no ads) |
| Roof Cost Calculator | `/roof-cost` | Primary ad landing page | `1624080141976167` (connected to Main Ad account) |
| Insurance Check | `/insurance-check` | Secondary ad landing page | `1509341330758105` (connected to Main Ad account) |

**Each page on form submission does:**
1. Submits to Netlify Forms (form names: `roofing-leads`, `roof-cost-lead`, `insurance-check-lead`)
2. Fires Meta Pixel `fbq('track', 'Lead')` event
3. Fires Google Analytics `generate_lead` event
4. Inserts lead to Supabase via REST API (`insertLeadToSupabase()` function in `<head>`)

**Important:** The Supabase anon key is embedded in each HTML file's `<head>` section in the `SUPABASE_KEY` variable. This is safe because RLS policies restrict what the anon key can do.

### 2. Supabase (Database & API)
- **Project:** Columbus Roofing
- **Org:** A&G Digital Org
- **URL:** `https://qrnxzlsyprpbfcmebpdq.supabase.co`
- **Region:** us-east-1

**Tables:**
| Table | Purpose |
|-------|---------|
| `leads` | All form submissions. Fields: id, first_name, last_name, phone, email, address, zip_code, service_type, source, status, lead_score, contractor_id, notes, created_at, qualified_at, sent_at, quoted_at, closed_at |
| `contractors` | Our contractor clients. Fields: id, name, contact_name, phone, email, zip_codes (array), specialties (array), active, lead_cap, notes |
| `lead_activity` | Audit log of every status change and assignment. Fields: id, lead_id, action, old_value, new_value, performed_by |
| `leads_with_contractor` | View joining leads + contractor name |

**Lead statuses:** `new` → `qualifying` → `qualified` → `sent` → `quoted` → `won` / `lost` / `bad`

**RLS:** Enabled with open policies for MVP (allow all via anon key). Needs tightening before production — should restrict anon key to INSERT only on leads table.

**Seeded data:** "The Roofing Guy" contractor (John), test leads from development

### 3. CRM Dashboard (React/Vite)
- **Location in repo:** `src/ag-digital-crm.jsx` with Supabase client at `src/lib/supabase.js`
- **Vite root:** `crm-dev/` (entry point is `crm-dev/main.jsx`)
- **Env vars:** `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` at project root, with `envDir: '../'` in vite.config.js
- **Status:** Runs locally (`npm run dev`), NOT deployed to Vercel yet
- **Features:** Lead pipeline table, contractor management, lead detail modal with status changes and contractor assignment, filtering, stats

### 4. Meta Ads (Facebook/Instagram)
- **Business Manager:** "John" Business Portfolio (ID: 930933063044053)
- **Ad Account:** "Main Ad" (ID: 1595507271708033)
- **Facebook Page:** Columbus Roofing Estimates
- **Instagram:** the.roofing.guy

**Pixels (3 new, 2 old to delete):**
| Pixel | ID | Connected To | Status |
|-------|-----|-------------|--------|
| Columbus Roofing Estimates - Website Pixel | `973653530243367` | No ad account | Active, on index.html |
| Columbus Roofing Estimates - Roof Cost Calculator Pixel | `1624080141976167` | Main Ad | Active, on roof-cost.html |
| Columbus Roofing Estimates - Insurance Check Pixel | `1509341330758105` | Main Ad | Active, on insurance-check.html |
| Roof Cost Calculator (OLD) | `2041460990054256` | Main Ad | TO DELETE |
| Roofing Estimates Website Data (OLD) | `959803696583454` | None | TO DELETE |

**Draft Campaigns:**
| Campaign | Objective | Budget | Pixel | Landing Page | Status |
|----------|-----------|--------|-------|-------------|--------|
| Roof Cost Calculator - Leads | Leads | $10/day | Roof Cost Calculator Pixel | /roof-cost | Draft — needs ad creative (images + copy) |
| Insurance Check - Leads | Leads | $10/day | Insurance Check Pixel | /insurance-check | Draft — needs ad creative (images + copy) |
| New Leads Campaign (OLD) | Leads | $25/day | — | — | Draft — TO DELETE |

**Account note:** Meta flagged "Account info needed" — need to confirm business details before publishing ads.

### 5. Zapier (Current Automation — Being Replaced by n8n)
- **Trigger:** Netlify New Form Submission (watches `roof-cost-lead`)
- **Action 1:** Send Email via Gmail
- **Action 2:** SMS was attempted but needs Zapier Pro for multi-step
- **Limitation:** Free tier only allows 2-step Zaps, no SMS step

### 6. Twilio
- **Number:** (614) 957-2204
- **Current use:** Call forwarding only (site phone number → personal phone)
- **SMS capability:** Not confirmed/enabled yet
- **Potential use:** SMS notifications for leads via n8n

### 7. n8n (Local — Docker)
- **Status:** Running locally via Docker, not yet connected to any workflows
- **Purpose:** Replace Zapier as the automation hub
- **Access:** localhost (needs cloud deployment or tunnel for production use)

---

## What Needs to Be Done (Priority Order)

### 🔴 Critical (Before Ads Go Live)

1. **Set up n8n workflow to replace Zapier**
   - Webhook trigger that receives form submissions
   - SMS/email notification to Mike's phone
   - Problem: n8n is local, needs public URL. Options: deploy to VPS, use n8n Cloud, or use Cloudflare Tunnel
   - The HTML forms currently POST to Netlify Forms AND Supabase directly. n8n webhook would be a third destination, or could replace the Netlify Forms path entirely.

2. **Deploy CRM dashboard to Vercel**
   - Partner needs access too
   - Set env vars in Vercel: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - Set root directory to `crm-dev`

3. **Connect GitHub repo to Netlify for auto-deploys**
   - Currently deploying via manual drag-and-drop zip uploads
   - Need to configure which folder Netlify publishes (the static HTML files, not the CRM app)

4. **Complete Meta Ads account info**
   - Meta requires business details before ads can publish

5. **Add ad creative to draft campaigns**
   - Partner is handling images
   - Ad copy suggestions exist but not finalized

### 🟡 Important (Shortly After Launch)

6. **Tighten Supabase RLS policies**
   - Anon key should only allow INSERT on leads table, not SELECT/UPDATE/DELETE
   - CRM dashboard should use authenticated session (Supabase Auth)

7. **Delete old Meta pixels and campaigns**
   - Remove "Roof Cost Calculator" pixel (2041460990054256)
   - Remove "Roofing Estimates Website Data" pixel (959803696583454)
   - Remove "New Leads Campaign" draft

8. **Test full pipeline end-to-end on all three pages**
   - roof-cost: tested ✅ (Supabase insert confirmed, Netlify Forms confirmed)
   - insurance-check: not tested yet
   - index/main: not tested yet

### 🟢 Phase 2 (After First Paying Clients)

9. **n8n lead enrichment workflow**
   - Geocode address to confirm Franklin County
   - Property value lookup
   - Weather event correlation (storm damage = higher value)

10. **Smart contractor routing**
    - Match leads to contractors by zip code, specialty, and capacity
    - Supabase Edge Functions for routing logic

11. **Contractor portal**
    - Separate React app, same Supabase backend
    - Supabase Auth with RLS filtering by contractor_id
    - Shows only their assigned leads, stats, response time metrics

12. **Audience intelligence feedback loop**
    - Analyze converted leads (which zip codes, property values, service types close best)
    - Feed data back into Meta ad targeting

---

## File Structure

```
columbus-roofing/
├── crm-dev/
│   └── main.jsx                  # CRM app entry point (Vite root)
├── src/
│   ├── lib/
│   │   └── supabase.js           # Supabase client config
│   └── ag-digital-crm.jsx        # CRM dashboard component
├── index.html                    # Main landing page (with Supabase + pixel)
├── roof-cost.html                # Roof cost calculator page (with Supabase + pixel)
├── insurance-check.html          # Insurance check page (with Supabase + pixel)
├── favicon_io/                   # Favicon assets
├── .env                          # VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
├── .gitignore                    # node_modules, .env, .DS_Store
├── package.json
├── vite.config.js                # root: 'crm-dev', envDir: '../'
└── AGENTS.md                     # THIS FILE
```

---

## Key Credentials & IDs (Reference Only — Actual Secrets in .env)

| Service | Key Info |
|---------|----------|
| Supabase Project URL | `https://qrnxzlsyprpbfcmebpdq.supabase.co` |
| Supabase Anon Key | In `.env` file (starts with `eyJ...`) |
| Meta Business ID | `930933063044053` |
| Meta Ad Account ID | `1595507271708033` |
| Twilio Number | `(614) 957-2204` |
| Netlify Site | `columbusroofestimates.netlify.app` / `columbusroofingestimates.com` |

---

## Pricing & Unit Economics

**Target CPL on Meta:** $30-50 (after optimization, months 2-3)
**Charge to contractor:** $50/lead or $500/mo retainer
**Average Columbus roofing job:** $6,000-$8,000
**Contractor close rate assumption:** 20%
**ROI for contractor:** 10 leads → 2 jobs → $12K-$16K revenue from $500 spend

---

## Context for Claude

When working on this project, keep in mind:
- We're pre-revenue, bootstrapping. Keep solutions simple and cheap.
- n8n is preferred over Zapier for automation (free, self-hosted, more flexible).
- The manual qualifying step (Mike calls leads before sending to contractor) is intentional for now — we need to prove lead quality.
- Don't over-engineer. We have 1 client. Build for 1-3 clients now, design for 10+.
- Partner handles ad creative and design changes to the landing pages.
- Mike handles tech infrastructure, Supabase, n8n, CRM, and meta ads setup.
- The Notion that the partner set up is for their own tracking — the CRM dashboard is the source of truth for lead data.
