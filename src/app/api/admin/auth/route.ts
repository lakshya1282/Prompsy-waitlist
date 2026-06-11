import { NextRequest, NextResponse } from "next/server";
import { signAdminToken, verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/admin-auth";
import { isRateLimited } from "@/app/api/rate-limit";

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per minute per IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip, 5, 60000)) {
    return NextResponse.json(
      { error: "Too many attempts. Try again in a minute." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const { password } = body;

  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password required." }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD env var is not set.");
    return NextResponse.json({ error: "Server misconfiguration." }, { status: 500 });
  }

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const adminEmail = process.env.ADMIN_EMAIL || "admin@prompsy.com";
  const token = await signAdminToken(adminEmail);

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return response;
}

export async function DELETE(request: NextRequest) {
  // Verify they are actually logged in before logging out
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (token) await verifyAdminToken(token); // no-op on invalid

  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
