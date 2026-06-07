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

  try {
    // Fetch releases from GitHub API to get the true latest (including pre-releases)
    const apiHeaders: Record<string, string> = {
      "User-Agent": "Prompsy-Landing",
      "Accept": "application/vnd.github.v3+json",
    };
    if (GITHUB_TOKEN && GITHUB_TOKEN !== "your_github_pat_here") {
      apiHeaders["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
    }

    const releasesRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
      headers: apiHeaders,
      cache: "no-store"
    });
    
    if (!releasesRes.ok) {
      console.error("[update] Failed to fetch releases:", releasesRes.status);
      return NextResponse.json({ error: "Failed to fetch releases." }, { status: 502 });
    }
    
    const releases = await releasesRes.json();
    if (!Array.isArray(releases) || releases.length === 0) {
      return NextResponse.json({ error: "No releases found." }, { status: 404 });
    }
    
    // Sort by published_at descending to get the true latest
    releases.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return dateB - dateA;
    });
    
    const latestRelease = releases[0];
    const updateAsset = latestRelease.assets?.find((a: any) => a.name === "update.json");
    
    if (!updateAsset) {
      return NextResponse.json({ error: "No update manifest found in latest release." }, { status: 404 });
    }
    
    const downloadHeaders: Record<string, string> = {
      "User-Agent": "Prompsy-Landing",
      "Accept": "application/octet-stream",
    };
    if (GITHUB_TOKEN && GITHUB_TOKEN !== "your_github_pat_here") {
      downloadHeaders["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
    }

    const res = await fetch(updateAsset.url, {
      headers: downloadHeaders,
      cache: "no-store",
      redirect: "follow",
    });

    if (!res.ok) {
      console.error("[update] Failed to fetch update.json:", res.status);
      return NextResponse.json(
        { error: "Failed to fetch update manifest." },
        { status: 502 }
      );
    }

    const updateManifest = await res.json();

    // Find the actual exe asset in the latest release to fix any broken tag URLs
    const exeAsset = latestRelease.assets?.find((a: any) => a.name.endsWith(".exe") && !a.name.endsWith(".sig"));

    // Rewrite download URLs in the manifest to go through our proxy
    // The Tauri update manifest has a `platforms` object with URLs
    const baseUrl = new URL(request.url);
    const proxyBase = `${baseUrl.protocol}//${baseUrl.host}`;

    if (updateManifest.platforms) {
      for (const platform of Object.keys(updateManifest.platforms)) {
        const platformData = updateManifest.platforms[platform];
        
        // If we found the real .exe asset, fix the URL first
        if (exeAsset) {
          platformData.url = exeAsset.browser_download_url;
        }
        
        if (platformData.url) {
          // Rewrite the URL to go through our update-asset proxy
          const encodedUrl = encodeURIComponent(platformData.url);
          platformData.url = `${proxyBase}/api/update-asset?url=${encodedUrl}`;
        }
      }
    }

    return NextResponse.json(updateManifest, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    console.error("[update] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
