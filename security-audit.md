You can give the following prompt to Claude, Gemini, GPT, Cursor, Windsurf, or any coding agent. It is designed as a **one-shot launch audit prompt** that instructs the AI to behave like a senior security engineer, privacy counsel, and release auditor simultaneously.

---

# PROMPT

You are a **Senior Application Security Engineer, Privacy Counsel, Tauri Security Reviewer, and SaaS Compliance Auditor** conducting a **pre-production launch audit** for my application.

I will provide you with the complete source code of my project.

Your job is to perform a **zero-assumption audit** and identify every issue that could prevent a safe public launch.

Do not merely summarize the code. Perform an adversarial review.

Assume this application is preparing for a public beta with real users.

---

## Context

The product is called **Prompsy**.

Prompsy is a Windows desktop utility that:

* transforms rough text into structured AI prompts,
* uses a global hotkey workflow,
* accesses clipboard contents after user interaction,
* supports Bring Your Own Key (BYOK),
* allows users to connect their own AI provider accounts,
* supports providers such as OpenAI, Anthropic, Gemini, Ollama, etc.,
* advertises itself as a **Privacy First** application,
* claims **Zero Log Buffering**,
* states that prompts are sent directly to the user's chosen provider,
* supports local Ollama models,
* uses Tauri auto-updates,
* distributes installers through private GitHub releases proxied through a Next.js backend.

The landing site contains Terms of Service, Privacy Policy, Refund Policy, and Beta Disclaimer pages.

My objective is to publicly launch this application while minimizing security, legal, and compliance risks.

---

# Audit Instructions

Perform the audit in the following sections.

Do not skip any section.

If an issue is not found, explicitly state that it was checked and explain why it passed.

For every finding include:

* Severity (Critical / High / Medium / Low)
* Impact
* Exploitation scenario
* Evidence (file names and code snippets)
* Recommended fix
* Whether it blocks public launch

---

# SECTION 1 — Desktop Application Security Audit

Review the entire Tauri application.

Check for:

### Clipboard Security

Determine:

* Is clipboard access continuous or event-driven?
* Is clipboard read only after explicit user action?
* Is clipboard polling occurring in the background?
* Can clipboard contents be accessed without the user's intent?
* Are clipboard contents logged?
* Are clipboard contents cached?
* Are clipboard contents stored on disk?
* Are clipboard contents included in crash reports?
* Are clipboard contents retained in memory longer than necessary?

Flag anything that contradicts Privacy First claims.

---

### Global Hotkey Security

Determine:

* Whether hotkeys can trigger unexpectedly.
* Whether hotkeys execute privileged actions.
* Whether malicious software could abuse the workflow.
* Whether accidental prompt injections are possible.

---

### Prompt Handling

Determine whether prompts are:

* written to files,
* cached,
* stored in SQLite,
* included in telemetry,
* retained after processing,
* recoverable from memory dumps.

---

### API Key Security

Determine exactly how BYOK credentials are stored.

Check whether API keys are stored in:

* plaintext files,
* JSON configs,
* localStorage,
* browser storage,
* SQLite,
* environment variables,
* Windows Credential Manager,
* OS keychain.

Flag insecure implementations.

Recommend secure alternatives.

---

### Logging Audit

Review all logs.

Determine whether logs contain:

* prompts,
* API keys,
* clipboard contents,
* stack traces with sensitive information,
* provider responses.

Review production versus development logging behavior.

---

### Crash Reporting

Identify whether:

* Sentry,
* PostHog,
* Bugsnag,
* telemetry plugins,
* Tauri crash handlers,

collect sensitive information.

Determine exactly what data is transmitted.

---

# SECTION 2 — Auto-Update Security Audit

Review the Tauri updater implementation.

Determine:

### Signature Validation

Is cryptographic verification enabled?

Check:

* updater configuration,
* embedded public keys,
* release signatures,
* signature enforcement.

Determine whether unsigned updates could be installed.

---

### Rollback Protection

Determine whether attackers could force installation of older vulnerable versions.

---

### Manifest Validation

Review update manifests.

Determine whether:

* manifests are authenticated,
* manifests can be tampered with,
* malicious versions can be injected.

---

### Corruption Handling

Determine behavior when:

* installers are incomplete,
* downloads are interrupted,
* signatures are invalid,
* manifests are malformed.

---

### Update Launch Verdict

Explicitly state whether:

> "The auto-update system is safe for public release."

Provide justification.

---

# SECTION 3 — Backend/API Security Audit

Review every Next.js API route.

Especially:

* /api/download
* /api/update
* /api/update-asset

Check for:

### SSRF

Determine whether URL validation can be bypassed using:

* encoded URLs,
* alternate hostnames,
* subdomains,
* @ notation,
* redirects,
* Unicode tricks.

Recommend hardened validation.

---

### Rate Limiting

Determine whether endpoints are protected against:

* mass downloads,
* denial of service,
* GitHub quota exhaustion,
* automated abuse.

Recommend thresholds.

---

### Authentication

Determine whether endpoints should require authentication.

If not, explain why.

---

### Streaming Security

Determine whether binary streams can:

* leak headers,
* leak tokens,
* expose metadata.

---

### Error Handling

Review:

* stack trace exposure,
* verbose errors,
* internal implementation leakage.

---

# SECTION 4 — GitHub Security Audit

Review release workflows and token usage.

Determine:

### Token Scope

Are GitHub tokens overprivileged?

Recommend minimum permissions.

---

### Secret Exposure

Determine whether secrets can leak through:

* logs,
* build outputs,
* frontend bundles,
* source maps.

---

### Release Integrity

Determine whether attackers compromising GitHub could distribute malicious binaries.

Recommend mitigations.

---

# SECTION 5 — Frontend Security Audit

Review the Next.js application.

Check for:

### Security Headers

Determine whether production deployment includes:

* Content-Security-Policy
* Strict-Transport-Security
* X-Frame-Options
* Referrer-Policy
* Permissions-Policy
* X-Content-Type-Options

Recommend exact values.

---

### XSS

Check for:

* dangerouslySetInnerHTML,
* unsanitized rendering,
* user-controlled HTML.

---

### Clickjacking

Determine protections.

---

### Open Redirects

Identify redirect vulnerabilities.

---

### CSRF

Determine whether applicable routes are protected.

---

# SECTION 6 — Privacy Policy Accuracy Audit

Compare the implementation against all privacy claims.

Assume misleading statements are serious findings.

Identify any mismatch between reality and statements such as:

* Privacy First
* Zero Log Buffering
* Direct HTTPS
* Clipboard Transparency
* BYOK
* Local Processing
* Ollama Integration
* Prompts never leave your device
* We do not store your data

For each mismatch provide:

* Claim made,
* Actual behavior,
* Risk,
* Suggested revised wording.

---

# SECTION 7 — Terms of Service Audit

Review the Terms.

Determine whether they adequately cover:

### Liability

* limitation of liability,
* damages caps,
* beta protections.

---

### AI Disclaimer

Determine whether users are informed that:

* AI outputs may be inaccurate,
* users remain responsible for outputs,
* regulated uses are prohibited.

---

### Third-Party Providers

Determine whether the Terms clearly state that:

Users are responsible for complying with OpenAI, Anthropic, Gemini, Ollama, and other provider terms.

---

### Export Controls

Check whether export restrictions should be included.

---

### Termination Rights

Review termination clauses.

---

### Intellectual Property

Review ownership language.

---

# SECTION 8 — Refund and Beta Policy Audit

Determine whether the Refund Policy and Beta Disclaimer create legal inconsistencies.

Check whether:

* beta users are promised refunds that conflict with disclaimers,
* no-warranty clauses conflict with guarantees,
* support promises exceed operational capability.

---

# SECTION 9 — Dependency and Supply Chain Audit

Review all dependencies.

Check for:

* known vulnerabilities,
* abandoned packages,
* risky Tauri plugins,
* risky npm packages,
* unnecessary dependencies.

Recommend replacements.

Provide upgrade priorities.

---

# SECTION 10 — Launch Readiness Report

Provide:

## Launch Score

Rate each category from 0–10:

* Desktop Security
* Auto Updates
* Backend Security
* Frontend Security
* Privacy Compliance
* Legal Readiness
* Supply Chain Security
* Overall Readiness

---

## Blockers

List every issue that must be fixed before launch.

---

## Recommended Improvements

List issues that should be addressed within:

* 30 days,
* 90 days,
* future roadmap.

---

## Final Verdict

Choose exactly one:

* SAFE FOR PUBLIC LAUNCH
* SAFE FOR LIMITED BETA ONLY
* NOT READY FOR PUBLIC USERS

Then explain why.

---

Finally, provide a prioritized remediation checklist in the exact order I should implement fixes, starting with the highest-risk issues that most reduce my legal and security exposure.
