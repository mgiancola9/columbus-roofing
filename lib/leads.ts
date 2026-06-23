import type { LeadData, EstimateResult, EstimateData } from "@/types/estimate";

export interface LeadPayload {
  lead: LeadData;
  estimate: EstimateResult;
  data: EstimateData;
}

/**
 * Source label for this funnel — mirrors how Columbus tagged leads by landing page
 * (e.g. "Roof Cost Calculator") so the CRM can filter by funnel.
 */
const LEAD_SOURCE = "Roof Estimate Calculator";

/** Same Supabase row shape Columbus inserted: first/last name, contact, address, source, status. */
interface LeadRow {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  source: string;
  status: string;
}

/** Build the exact lead row Columbus sent to both Supabase and n8n (identical field names). */
function buildLeadRow(payload: LeadPayload): LeadRow {
  const parts = payload.lead.name.trim().split(/\s+/);
  return {
    first_name: parts[0] || "",
    last_name: parts.slice(1).join(" ") || "",
    phone: payload.lead.phone,
    email: payload.lead.email,
    address: payload.lead.address || "",
    source: LEAD_SOURCE,
    status: "new",
  };
}

/**
 * Insert a lead into Supabase via the REST API — same call Columbus made
 * (`POST /rest/v1/leads`, apikey + Bearer + Prefer: return=minimal), but run
 * server-side so the key is never exposed in the browser (the one upgrade over Columbus).
 * Prefers the service-role key; falls back to the anon key (works under open-RLS MVP).
 */
export async function insertLeadToSupabase(row: LeadRow): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase not configured — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)",
    );
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Supabase insert failed (${res.status}): ${detail}`);
  }
}

/**
 * Fire the same flat lead object to the n8n webhook for instant SMS/email alert (speed-to-lead).
 * Identical payload shape to Columbus, so the existing n8n workflow can be cloned unchanged.
 * Optional — no-op if N8N_WEBHOOK_URL is unset, so the pipeline still works without n8n.
 */
export async function notifyN8n(row: LeadRow): Promise<void> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) return;

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row),
  });

  if (!res.ok) {
    throw new Error(`n8n webhook failed (${res.status})`);
  }
}

export { buildLeadRow };
