import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = token ? await verifyAdminToken(token) : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("broadcast_logs")
      .select("*")
      .order("sent_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ logs: data });
  } catch (err) {
    console.error("Broadcast GET error:", err);
    return NextResponse.json({ error: "Failed to fetch logs." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const session = token ? await verifyAdminToken(token) : null;
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const { subject, html, audience = "all", testOnly = false } = body;

  if (!subject || !html) {
    return NextResponse.json({ error: "subject and html are required." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Prompsy <hello@prompsy.com>";

  if (!resendKey || resendKey === "REPLACE_WITH_RESEND_API_KEY") {
    return NextResponse.json(
      { error: "Resend API key not configured. Add RESEND_API_KEY to .env.local" },
      { status: 503 }
    );
  }

  const resend = new Resend(resendKey);

  // If test only, send just to admin email
  if (testOnly) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@prompsy.com";
    await resend.emails.send({ from: fromEmail, to: adminEmail, subject: `[TEST] ${subject}`, html });
    return NextResponse.json({ success: true, sentTo: 1, testOnly: true });
  }

  // Fetch emails from Supabase
  const supabase = getAdminSupabase();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  let allEmails: string[] = [];
  let page = 1;
  const perPage = 1000;

  // Paginate through all users
  while (true) {
    const { data: { users }, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error || !users?.length) break;

    const filtered = users
      .filter((u) => {
        if (!u.email) return false;
        if (audience === "active") {
          return u.last_sign_in_at && new Date(u.last_sign_in_at) > new Date(sevenDaysAgo);
        }
        return true;
      })
      .map((u) => u.email!);

    allEmails = allEmails.concat(filtered);
    if (users.length < perPage) break;
    page++;
  }

  if (allEmails.length === 0) {
    return NextResponse.json({ success: true, sentTo: 0 });
  }

  // Send in batches of 50 (Resend batch limit)
  const BATCH_SIZE = 50;
  let totalSent = 0;

  for (let i = 0; i < allEmails.length; i += BATCH_SIZE) {
    const batch = allEmails.slice(i, i + BATCH_SIZE);
    // Use BCC so recipients don't see each other
    await resend.emails.send({
      from: fromEmail,
      to: fromEmail, // send to self
      bcc: batch,
      subject,
      html,
    });
    totalSent += batch.length;
  }

  // Log the broadcast
  await supabase.from("broadcast_logs").insert({
    subject,
    body: html,
    sent_to_count: totalSent,
    sent_by: session.email,
  });

  return NextResponse.json({ success: true, sentTo: totalSent });
}
