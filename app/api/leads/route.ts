import { NextRequest, NextResponse } from "next/server";
import { buildLeadRow, insertLeadToSupabase, notifyN8n, type LeadPayload } from "@/lib/leads";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<LeadPayload>;
    const { lead, estimate, data } = body;

    // Validate required fields
    if (!lead?.name || !lead?.phone || !lead?.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const row = buildLeadRow({ lead, estimate: estimate!, data: data! });

    // Fire both the same way Columbus did — Supabase is source of truth, n8n is the alert.
    // Run in parallel; one failing must not block the other.
    const [supabaseResult, n8nResult] = await Promise.allSettled([
      insertLeadToSupabase(row),
      notifyN8n(row),
    ]);

    if (supabaseResult.status === "rejected") {
      console.error("Supabase insert error:", supabaseResult.reason);
    } else {
      console.log("Lead saved to CRM:", row.email);
    }
    if (n8nResult.status === "rejected") {
      console.error("n8n webhook error:", n8nResult.reason);
    }

    // Persisting the lead is what matters; if it failed, surface a 500 (the client
    // still advances to the thank-you screen regardless, mirroring Columbus).
    if (supabaseResult.status === "rejected") {
      return NextResponse.json({ error: "Lead could not be saved" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
