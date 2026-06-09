import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead, estimate, data } = body;

    // Validate required fields
    if (!lead?.name || !lead?.phone || !lead?.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // TODO: Integrate with your CRM / email service:
    //   - Webhooks: Zapier, Make.com, or direct API call
    //   - CRM: HubSpot, Salesforce, Pipedrive
    //   - Email: SendGrid, Resend, Nodemailer
    //   - SMS: Twilio
    //   - Database: Supabase, PlanetScale, MongoDB Atlas
    //
    // Example with a webhook:
    // await fetch(process.env.LEAD_WEBHOOK_URL!, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ lead, estimate, data, timestamp: new Date().toISOString() }),
    // });

    console.log("New lead received:", {
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      city: data?.city,
      estimateLow: estimate?.low,
      estimateHigh: estimate?.high,
      material: estimate?.materialLabel,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
