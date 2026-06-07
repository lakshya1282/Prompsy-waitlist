# Prompsy Landing

The official marketing website and download portal for **Prompsy** — a lightweight Windows desktop utility that transforms rough text into structured AI prompts with a single hotkey.

Built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS 4**.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Sections](#pages--sections)
  - [Landing Page (/)](#landing-page-)
  - [Download Page (/download)](#download-page-download)
  - [Legal Pages](#legal-pages)
- [API Routes](#api-routes)
  - [/api/download](#apidownload)
  - [/api/update](#apiupdate)
  - [/api/update-asset](#apiupdate-asset)
- [Download Flow — End-to-End](#download-flow--end-to-end)
- [Design System](#design-system)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Deployment](#deployment)

---

## Tech Stack

| Technology       | Version | Purpose                        |
| ---------------- | ------- | ------------------------------ |
| Next.js          | 16.2.6  | App framework (App Router)     |
| React            | 19.2.4  | UI library                     |
| TypeScript       | ^5      | Type safety                    |
| Tailwind CSS     | ^4      | Utility-first styling          |
| Supabase JS      | ^2.106  | Database client (waitlist, legacy) |
| Inter (Google)   | —       | Primary typeface               |

---

## Project Structure

```
prompsy-landing/
├── public/
│   └── logo.png                    # Prompsy logo asset
├── src/
│   └── app/
│       ├── layout.tsx              # Root layout (Inter font, metadata, HTML shell)
│       ├── globals.css             # CSS variables, neumorphic utilities
│       ├── page.tsx                # Landing page (home)
│       ├── download/
│       │   └── page.tsx            # Download page with legal agreement modal
│       ├── terms/
│       │   └── page.tsx            # Terms of Service
│       ├── privacy-policy/
│       │   └── page.tsx            # Privacy Policy
│       ├── refund-policy/
│       │   └── page.tsx            # Refund & Cancellation Policy
│       ├── beta-disclaimer/
│       │   └── page.tsx            # Beta Disclaimer
│       └── api/
│           ├── download/
│           │   └── route.ts        # Binary download proxy (GitHub → user)
│           ├── update/
│           │   └── route.ts        # Tauri auto-update manifest endpoint
│           └── update-asset/
│               └── route.ts        # Tauri update binary proxy
├── .env.local                      # Environment variables (secrets)
├── next.config.ts                  # Next.js configuration
├── package.json                    # Dependencies & scripts
└── tsconfig.json                   # TypeScript configuration
```

---

## Pages & Sections

### Landing Page (`/`)

**File:** `src/app/page.tsx` — Client component (`"use client"`)

The primary marketing page with scroll-reveal animations and a typewriter demo.

| Section             | Description                                                                                                                                                      |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sticky Navbar**   | Dark rounded pill navbar with logo, section links (The Problem, Workflow, BYOK), and a "Download Beta" CTA button. Stays pinned at the top.                      |
| **Hero**            | Two-column layout. **Left:** headline with gradient accent, subtitle, download CTA button, platform info. **Right:** animated "Active Pipeline" mockup card.       |
| **Active Pipeline** | macOS-style card (red/amber/green window dots, black border) with a **typewriter animation loop** — types an input prompt, shows "Enhancing..." status, then types out the enhanced output. Loops continuously. |
| **The Problem**     | `#problem` — 1/3 + 2/3 asymmetric grid. Left column: section badge ("The Friction"), heading, intro. Right column: numbered list of 4 friction points (Iteration Loop Tax, Context-Switching Drag, Structural Disparity, Invisible Repetition). |
| **Workflow**        | `#solution` — 1/3 + 2/3 grid with sticky left column. Left: section badge ("Workflow"), heading, description, and **Custom System Presets** chip list (Coding, Creative, Image Gen, Writing, Agentic). Right: 4-step vertical timeline with icons (Highlight → Hotkey → Processing → Injection). |
| **BYOK**            | `#byok` — 1/3 + 2/3 grid. Left: section badge ("Privacy First"), heading, provider chip list (OpenAI, Anthropic, Google Gemini, Local Ollama). Right: "Secure Local Datapath" diagram (Active Window → Windows OS → Direct HTTPS), plus 2×2 benefit cards (At-Cost Usage, Zero Log Buffering, Ollama Integration, Model Switching). |
| **Final CTA**       | Centered neumorphic card with download button and version info.                                                                                                  |
| **Footer**          | SVG wave separator → dark footer with Product links, Legal links (Privacy Policy, Terms, Refund Policy, Beta Disclaimer), Contact emails, and copyright.          |

**Interactive Features:**
- `IntersectionObserver`-based **scroll-reveal animations** on all content sections (`.reveal-on-scroll` → `.revealed` class toggle)
- **Typewriter animation loop** in the hero pipeline card — types 2 chars/tick for input, 4 chars/tick for output, with simulated processing delay

---

### Download Page (`/download`)

**File:** `src/app/download/page.tsx` — Client component

Single-installer download page with a legal agreement modal gate.

| Element                  | Description                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Header**               | Compact dark pill navbar with logo and "← Back to Home" link.                                                |
| **Badge**                | Green dot + "Beta Download — Windows" label.                                                                 |
| **Title**                | "Download Prompsy Beta" heading.                                                                             |
| **Download Card**        | Neumorphic card with Windows logo, "EXE Installer" title, compatibility info, and download button.           |
| **Legal Agreement Modal**| Triggered on download click. Contains 3 checkboxes that **must all be checked** before the download starts: |
|                          | ✅ I agree to the **Terms of Service** (links to `/terms`)                                                   |
|                          | ✅ I agree to the **Privacy Policy** (links to `/privacy-policy`)                                            |
|                          | ✅ I understand this is a **Beta release** (links to `/beta-disclaimer`)                                     |
| **Download Confirmation**| After successful download, the card shows a green checkmark with "Download started!" and a "Download again" link. |
| **Installation Notes**   | Neumorphic card with 5 bullet points covering SmartScreen warnings, permissions, BYOK requirements, and support email. |
| **Footer**               | SVG wave separator → compact dark footer with legal page links.                                              |

---

### Legal Pages

All 4 legal pages share a consistent layout: sticky dark header → hero with gradient title → table of contents card → content sections in neumorphic cards → cross-links to other legal pages → SVG wave footer.

| Route               | File                             | Title                     | Sections |
| -------------------- | -------------------------------- | ------------------------- | -------- |
| `/terms`             | `src/app/terms/page.tsx`         | Terms of Service          | 14 sections (Acceptance, Description, Eligibility, Account, Subscriptions, Acceptable Use, IP, AI Disclaimer, Privacy, Termination, Liability, Disclaimer, Governing Law, Contact) |
| `/privacy-policy`    | `src/app/privacy-policy/page.tsx`| Privacy Policy            | 10 sections (Information Collected, How We Use, Clipboard Transparency, Data Sharing, Data Retention, Your Rights under DPDP/GDPR, Security, Children's Privacy, Changes, Contact) |
| `/refund-policy`     | `src/app/refund-policy/page.tsx` | Refund & Cancellation     | 10 sections (Overview, Plans, Beta Note, Eligibility, Cancellation, Annual Plans, How to Request, Payment Failures, Disputes, Contact) + Quick Summary card (7-day refund window, 7-10 day processing, anytime cancellation) |
| `/beta-disclaimer`   | `src/app/beta-disclaimer/page.tsx`| Beta Disclaimer          | 10 sections (What Is Beta, No Warranty, Service Availability, Data Handling, Feedback, Feature Changes, Compatibility, Clipboard, End of Beta, Contact) + 4 warning cards + appreciation CTA |

All legal pages are **statically rendered** (server components with `Metadata` exports for SEO).

---

## API Routes

### `/api/download`

**File:** `src/app/api/download/route.ts`
**Method:** `GET`
**Purpose:** Proxies installer binaries from a private GitHub release to the end user.

**Query Parameters:**

| Param    | Required | Values       | Description                          |
| -------- | -------- | ------------ | ------------------------------------ |
| `format` | Yes      | `exe`, `msi` | Installer format to download         |

**How It Works:**

1. Validates the `format` query parameter against `FORMAT_PATTERNS` (regex map).
2. Calls the GitHub API: `GET https://api.github.com/repos/{GITHUB_REPO}/releases/latest`
3. Searches the release `assets[]` array using **regex pattern matching** to find the correct file (e.g., `Prompsy_0.5.0_x64-setup.exe`). Filenames are versioned, so exact matching is not used. `.sig` signature files are excluded.
4. Fetches the matched asset binary using the asset's `url` with `Accept: application/octet-stream`.
5. **Streams** the binary response directly to the user with appropriate `Content-Disposition`, `Content-Type`, and `Content-Length` headers.

**Pattern Matching:**

```typescript
const FORMAT_PATTERNS: Record<string, RegExp> = {
  exe: /Prompsy_.*_x64-setup\.exe$/i,
  msi: /Prompsy_.*_x64.*\.msi$/i,
};
```

**Error Responses:**

| Status | Condition                              |
| ------ | -------------------------------------- |
| 400    | Missing or invalid `format` parameter  |
| 404    | No matching asset in the latest release|
| 502    | GitHub API error or asset download fail|
| 500    | Unexpected server error                |

---

### `/api/update`

**File:** `src/app/api/update/route.ts`
**Method:** `GET`
**Purpose:** Serves the Tauri auto-update manifest for in-app update checks.

**How It Works:**

1. Fetches `update.json` from the latest GitHub release: `https://github.com/{GITHUB_REPO}/releases/latest/download/update.json`
2. Parses the JSON manifest (Tauri update format with `platforms` object).
3. **Rewrites all download URLs** in the manifest to route through the `/api/update-asset` proxy. This is necessary because the GitHub release repo may be private, and the Tauri updater on the client cannot authenticate directly.
4. Returns the modified manifest as JSON with `Cache-Control: no-store`.

**URL Rewriting Example:**

```
Original:  https://github.com/.../releases/download/v0.5.0/Prompsy_0.5.0_x64-setup.exe
Rewritten: https://your-domain.com/api/update-asset?url=https%3A%2F%2Fgithub.com%2F...
```

---

### `/api/update-asset`

**File:** `src/app/api/update-asset/route.ts`
**Method:** `GET`
**Purpose:** Authenticated proxy for downloading Tauri update binaries from GitHub.

**Query Parameters:**

| Param | Required | Description                                  |
| ----- | -------- | -------------------------------------------- |
| `url` | Yes      | URL-encoded GitHub release asset download URL |

**Security:**

- Validates that the decoded URL starts with either:
  - `https://github.com/{GITHUB_REPO}/releases/download/` or
  - `https://api.github.com/repos/{GITHUB_REPO}/`
- Rejects any URL pointing to a different repository or domain (returns 403).

**How It Works:**

1. Decodes and validates the `url` parameter against the allowed repo prefixes.
2. Fetches the binary from GitHub with the server's `GITHUB_TOKEN` for authentication.
3. Streams the binary back to the Tauri updater client with `Content-Disposition` and `Content-Length`.

---

## Download Flow — End-to-End

```
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
│                                                             │
│  1. User visits /download                                   │
│  2. Clicks "Download .exe" button                           │
│  3. Legal Agreement Modal appears                           │
│     → Must check all 3 boxes:                               │
│        ☑ Terms of Service                                   │
│        ☑ Privacy Policy                                     │
│        ☑ Beta Disclaimer                                    │
│  4. Clicks "Download .exe" in modal                         │
│                                                             │
│  5. Frontend calls: GET /api/download?format=exe            │
│     └─ fetch() with no auth headers                         │
│                                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   /api/download (Next.js)                    │
│                                                             │
│  1. Validates format=exe                                    │
│  2. GET github.com/api/repos/.../releases/latest            │
│     └─ With GITHUB_TOKEN auth header                        │
│  3. Regex-match asset: /Prompsy_.*_x64-setup\.exe$/i        │
│     └─ Finds: "Prompsy_0.5.0_x64-setup.exe"                │
│     └─ Skips: "Prompsy_0.5.0_x64-setup.exe.sig"            │
│  4. GET asset.url (binary stream)                           │
│     └─ Accept: application/octet-stream                     │
│  5. Streams binary to browser with Content-Disposition      │
│                                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      USER BROWSER                           │
│                                                             │
│  6. Browser triggers native file download dialog            │
│  7. Download card updates: "Download started! ✓"            │
│  8. User can click "Download again" to re-trigger           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Tauri In-App Auto-Update Flow

```
┌──────────────────┐     GET /api/update      ┌──────────────────┐
│   Prompsy App    │ ──────────────────────▶   │   /api/update    │
│  (Tauri Client)  │                           │   (Next.js)      │
│                  │  ◀──────────────────────  │                  │
│                  │   JSON manifest with       │  Fetches from    │
│                  │   rewritten proxy URLs     │  GitHub releases │
│                  │                           │  & rewrites URLs │
└───────┬──────────┘                           └──────────────────┘
        │
        │  GET /api/update-asset?url=...
        ▼
┌──────────────────┐                           ┌──────────────────┐
│ /api/update-asset│ ──────────────────────▶   │   GitHub API     │
│   (Next.js)      │   Authenticated fetch     │  (Private Repo)  │
│                  │  ◀──────────────────────  │                  │
│  Validates URL   │   Binary stream           │                  │
│  & proxies binary│                           │                  │
└───────┬──────────┘                           └──────────────────┘
        │
        │  Streamed binary
        ▼
┌──────────────────┐
│   Prompsy App    │
│  Installs update │
└──────────────────┘
```

---

## Design System

### Color Palette

| Token              | Value              | Usage                      |
| ------------------ | ------------------ | -------------------------- |
| `--bg-primary`     | `#f4f5f7`          | Page background            |
| `--bg-secondary`   | `#ffffff`          | Card fills                 |
| `--text-primary`   | `#000000`          | Headings                   |
| `--text-secondary` | `#5f6368`          | Body text                  |
| `--accent-purple`  | `#8b5cf6`          | Primary accent             |
| `--accent-blue`    | `#3b82f6`          | Gradient end               |
| `--border-subtle`  | `rgba(0,0,0,0.05)` | Section borders            |
| `--border-focus`   | `rgba(139,92,246,0.3)` | Focus rings           |

### Neumorphic Utilities (globals.css)

| Class        | Description                                                    |
| ------------ | -------------------------------------------------------------- |
| `.neu-circle`| Absolute-positioned neumorphic circle for background depth     |
| `.neu-card`  | Card with dual box-shadows (dark inset + light outset), 24px radius, subtle white border |

### Typography

- **Font:** Inter (Google Fonts), loaded via `next/font/google`
- **Headings:** `font-bold`, sizes from `text-3xl` to `text-[56px]`
- **Body:** `text-sm` to `text-lg`, `font-medium`, `leading-relaxed`

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# GitHub Personal Access Token (for private release repo access)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# GitHub repository in "owner/repo" format
GITHUB_REPO=lakshya1282/Prompsy-release-beta

# Supabase (legacy — used for waitlist, can be removed if not needed)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

| Variable                     | Required | Description                                          |
| ---------------------------- | -------- | ---------------------------------------------------- |
| `GITHUB_TOKEN`               | Yes      | PAT with `repo` scope for accessing private releases |
| `GITHUB_REPO`                | Yes      | `owner/repo` format for the release repository       |
| `NEXT_PUBLIC_SUPABASE_URL`   | No       | Supabase project URL (legacy, not used in downloads) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No    | Supabase anon key (legacy)                           |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd prompsy-landing

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
# Edit .env.local with your actual values

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Scripts

| Script          | Command          | Description                     |
| --------------- | ---------------- | ------------------------------- |
| `npm run dev`   | `next dev`       | Start dev server with HMR       |
| `npm run build` | `next build`     | Production build                 |
| `npm run start` | `next start`     | Start production server          |
| `npm run lint`  | `eslint`         | Run ESLint                       |

---

## Deployment

The site is designed for deployment on **Vercel** or any Node.js-capable platform.

### Route Types

| Route              | Type      | Description                    |
| ------------------ | --------- | ------------------------------ |
| `/`                | Static    | Pre-rendered at build time     |
| `/download`        | Static    | Pre-rendered at build time     |
| `/terms`           | Static    | Pre-rendered at build time     |
| `/privacy-policy`  | Static    | Pre-rendered at build time     |
| `/refund-policy`   | Static    | Pre-rendered at build time     |
| `/beta-disclaimer` | Static    | Pre-rendered at build time     |
| `/api/download`    | Dynamic   | Server-rendered on demand      |
| `/api/update`      | Dynamic   | Server-rendered on demand      |
| `/api/update-asset`| Dynamic   | Server-rendered on demand      |

Static pages are pre-rendered for fast delivery. API routes run as serverless functions.

---

## License

Proprietary — © 2026 Prompsy. All rights reserved.
