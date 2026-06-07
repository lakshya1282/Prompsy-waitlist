import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "../rate-limit";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "lakshya1282/Prompsy-release-beta";

export async function GET(request: NextRequest) {
  // Rate limiting (10 requests per minute per IP)
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip, 10, 60000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { error: "Missing 'url' query parameter." },
      { status: 400 }
    );
  }

  // Validate the URL belongs to the expected GitHub repo
  const decodedUrl = decodeURIComponent(targetUrl);
  
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(decodedUrl);
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid URL format." },
      { status: 400 }
    );
  }

  // Define allowed hosts and path prefixes
  const allowedReleasePrefix = `/${GITHUB_REPO}/releases/download/`;
  const allowedApiPrefix = `/repos/${GITHUB_REPO}/`;

  const isAllowedHost = 
    (parsedUrl.hostname === 'github.com' && parsedUrl.pathname.startsWith(allowedReleasePrefix)) ||
    (parsedUrl.hostname === 'api.github.com' && parsedUrl.pathname.startsWith(allowedApiPrefix));

  if (!isAllowedHost) {
    return NextResponse.json(
      { error: "URL not allowed. Must be a release asset from the configured repo." },
      { status: 403 }
    );
  }

  try {
    // Fetch the asset from GitHub
    const requestHeaders: Record<string, string> = {
      Accept: "application/octet-stream",
      "User-Agent": "Prompsy-Landing",
    };
    if (GITHUB_TOKEN && GITHUB_TOKEN !== "your_github_pat_here") {
      requestHeaders["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
    }

    const res = await fetch(decodedUrl, {
      headers: requestHeaders,
      redirect: "follow",
    });

    if (!res.ok || !res.body) {
      console.error("[update-asset] Download error:", res.status);
      return NextResponse.json(
        { error: "Failed to download the update asset." },
        { status: 502 }
      );
    }

    // Extract filename from the URL for Content-Disposition
    const urlParts = decodedUrl.split("/");
    const filename = urlParts[urlParts.length - 1] || "update";

    // Stream the binary back to the Tauri updater
    const headers: Record<string, string> = {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    };

    const contentLength = res.headers.get("content-length");
    if (contentLength) {
      headers["Content-Length"] = contentLength;
    }

    return new NextResponse(res.body as ReadableStream, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    console.error("[update-asset] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
