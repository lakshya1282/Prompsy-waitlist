import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function GET(request: NextRequest) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = 20;
  const offset = (page - 1) * perPage;

  try {
    const supabase = getAdminSupabase();
    let query = supabase
      .from("admin_queries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + perPage - 1);

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data, count, error } = await query;
    if (error) throw error;

    return NextResponse.json({ queries: data, total: count, page, perPage });
  } catch (err) {
    console.error("Admin queries GET error:", err);
    return NextResponse.json({ error: "Failed to fetch queries." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Public endpoint — users can submit queries without being logged in
  const body = await request.json().catch(() => ({}));
  const { email, subject, message } = body;

  if (!email || !subject || !message) {
    return NextResponse.json(
      { error: "email, subject, and message are required." },
      { status: 400 }
    );
  }

  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from("admin_queries").insert({
      user_email: email,
      subject,
      message,
      status: "open",
    });
    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Admin queries POST error:", err);
    return NextResponse.json({ error: "Failed to submit query." }, { status: 500 });
  }
}
