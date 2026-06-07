import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "../rate-limit";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "lakshya1282/Prompsy-release-beta";

// Map format parameter to asset filename patterns (regex)
// Asset names are versioned, e.g. "Prompsy_0.5.0_x64-setup.exe"
const FORMAT_PATTERNS: Record<string, RegExp> = {
  exe: /Prompsy_.*_x64-setup\.exe$/i,
  msi: /Prompsy_.*_x64.*\.msi$/i,
};

export async function GET(request: NextRequest) {
  // Rate limiting (10 requests per minute per IP)
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(ip, 10, 60000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  // 1. Validate format parameter
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");

  if (!format || !FORMAT_PATTERNS[format]) {
    return NextResponse.json(
      { error: "Invalid format. Use ?format=exe or ?format=msi" },
      { status: 400 }
    );
  }

  const pattern = FORMAT_PATTERNS[format];

  try {
    // 2. Fetch latest release from GitHub API
    const releaseHeaders: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Prompsy-Landing",
    };
    if (GITHUB_TOKEN && GITHUB_TOKEN !== "your_github_pat_here") {
      releaseHeaders["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
    }

    const releaseRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases`,
      {
        headers: releaseHeaders,
        cache: "no-store",
      }
    );

    if (!releaseRes.ok) {
      console.error(
        "[download] GitHub API error:",
        releaseRes.status,
        await releaseRes.text()
      );
      return NextResponse.json(
        { error: "Failed to fetch release information." },
        { status: 502 }
      );
    }

    const releases = await releaseRes.json();
    if (!Array.isArray(releases) || releases.length === 0) {
      return NextResponse.json(
        { error: "No releases found." },
        { status: 404 }
      );
    }
    
    // Sort releases by published_at descending to ensure the true latest is picked
    releases.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return dateB - dateA;
    });
    
    const release = releases[0];

    // 3. Find the matching asset by pattern (skip .sig signature files)
    const asset = release.assets?.find(
      (a: any) => pattern.test(a.name) && !a.name.endsWith(".sig")
    );

    if (!asset) {
      return NextResponse.json(
        {
          error: `No .${format} installer found in the latest release.`,
        },
        { status: 404 }
      );
    }

    // 4. Download the asset binary from GitHub
    const assetHeaders: Record<string, string> = {
      Accept: "application/octet-stream",
      "User-Agent": "Prompsy-Landing",
    };
    if (GITHUB_TOKEN && GITHUB_TOKEN !== "your_github_pat_here") {
      assetHeaders["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
    }

    const assetRes = await fetch(asset.url, {
      headers: assetHeaders,
    });

    if (!assetRes.ok || !assetRes.body) {
      console.error(
        "[download] Asset download error:",
        assetRes.status
      );
      return NextResponse.json(
        { error: "Failed to download the asset." },
        { status: 502 }
      );
    }

    // 5. Stream the file to the user
    return new NextResponse(assetRes.body as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${asset.name}"`,
        "Content-Length": String(asset.size),
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    console.error("[download] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
