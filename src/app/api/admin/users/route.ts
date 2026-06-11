import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) throw new Error("Supabase env vars not set.");
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET(request: NextRequest) {
  // Re-validate session (second lock beyond middleware)
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("per_page") || "20", 10);

  try {
    const supabase = getAdminSupabase();
    const {
      data: { users },
      error,
    } = await supabase.auth.admin.listUsers({ page, perPage });

    if (error) throw error;

    // Compute "active" = signed in within last 7 days
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const enriched = users.map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      is_active: u.last_sign_in_at
        ? new Date(u.last_sign_in_at).getTime() > sevenDaysAgo
        : false,
      email_confirmed_at: u.email_confirmed_at,
      banned: u.banned_until
        ? new Date(u.banned_until).getTime() > Date.now()
        : false,
    }));

    return NextResponse.json({ users: enriched, page, perPage });
  } catch (err) {
    console.error("Admin users error:", err);
    return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { userId, action } = body;

  if (!userId || !action) {
    return NextResponse.json({ error: "userId and action required." }, { status: 400 });
  }

  try {
    const supabase = getAdminSupabase();

    if (action === "ban") {
      const bannedUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: "876600h",
      });
      if (error) throw error;
    } else if (action === "unban") {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: "none",
      });
      if (error) throw error;
    } else if (action === "delete") {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    } else {
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin users PATCH error:", err);
    return NextResponse.json({ error: "Action failed." }, { status: 500 });
  }
}
