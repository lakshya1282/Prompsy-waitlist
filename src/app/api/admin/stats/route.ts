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

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getAdminSupabase();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Fetch all users (paginate to count accurately)
    let totalUsers = 0;
    let activeUsers = 0;
    const recentUsers: { email: string; created_at: string }[] = [];
    let page = 1;

    while (true) {
      const { data: { users }, error } = await supabase.auth.admin.listUsers({
        page,
        perPage: 1000,
      });
      if (error || !users?.length) break;

      totalUsers += users.length;
      activeUsers += users.filter(
        (u) => u.last_sign_in_at && new Date(u.last_sign_in_at) > new Date(sevenDaysAgo)
      ).length;

      if (page === 1) {
        // Collect 5 most recent
        const sorted = [...users]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map((u) => ({ email: u.email || "—", created_at: u.created_at }));
        recentUsers.push(...sorted);
      }

      if (users.length < 1000) break;
      page++;
    }

    // Open queries count
    const { count: openQueries } = await supabase
      .from("admin_queries")
      .select("*", { count: "exact", head: true })
      .eq("status", "open");

    // Total broadcasts sent
    const { count: broadcastCount } = await supabase
      .from("broadcast_logs")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      totalUsers,
      activeUsers,
      openQueries: openQueries ?? 0,
      broadcastCount: broadcastCount ?? 0,
      recentUsers: recentUsers.slice(0, 5),
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats." }, { status: 500 });
  }
}
