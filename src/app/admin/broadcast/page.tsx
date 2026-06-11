"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import styles from "./broadcast.module.css";

interface BroadcastLog {
  id: string;
  subject: string;
  sent_to_count: number;
  sent_by: string;
  sent_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BroadcastPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("all");
  const [sending, setSending] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [result, setResult] = useState<{ sentTo?: number; error?: string } | null>(null);
  const [logs, setLogs] = useState<BroadcastLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");

  useEffect(() => {
    fetch("/api/admin/broadcast")
      .then((r) => r.json())
      .then((d) => { if (d.logs) setLogs(d.logs); })
      .finally(() => setLogsLoading(false));
  }, []);

  async function sendTest() {
    if (!subject || !body) return;
    setTestSending(true);
    setResult(null);
    const res = await fetch("/api/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, html: body, audience, testOnly: true }),
    });
    const data = await res.json();
    setResult(data.error ? { error: data.error } : { sentTo: data.sentTo });
    setTestSending(false);
  }

  async function sendAll() {
    setShowConfirm(false);
    setSending(true);
    setResult(null);
    const res = await fetch("/api/admin/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, html: body, audience, testOnly: false }),
    });
    const data = await res.json();
    if (data.success) {
      setResult({ sentTo: data.sentTo });
      // Refresh logs
      const logsRes = await fetch("/api/admin/broadcast");
      const logsData = await logsRes.json();
      if (logsData.logs) setLogs(logsData.logs);
    } else {
      setResult({ error: data.error });
    }
    setSending(false);
  }

  // Build preview HTML
  const previewHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#ffffff;color:#1a1a2e">
      <div style="margin-bottom:24px">
        <strong style="font-size:20px;color:#8b5cf6">Prompsy</strong>
      </div>
      <h1 style="font-size:22px;font-weight:700;margin-bottom:16px;color:#0f1117">${subject || "Your subject line"}</h1>
      <div style="font-size:15px;line-height:1.7;color:#374151;white-space:pre-wrap">${body || "Your email body will appear here…"}</div>
      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af">
        You're receiving this because you have a Prompsy account. © 2025 Prompsy.
      </div>
    </div>
  `;

  return (
    <AdminShell>
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.heading}>Broadcast</h1>
            <p className={styles.sub}>Send announcements to your users</p>
          </div>
          <div className={styles.headerTabs}>
            <button
              className={`${styles.headerTab} ${activeTab === "compose" ? styles.headerTabActive : ""}`}
              onClick={() => setActiveTab("compose")}
              id="tab-compose"
            >
              Compose
            </button>
            <button
              className={`${styles.headerTab} ${activeTab === "history" ? styles.headerTabActive : ""}`}
              onClick={() => setActiveTab("history")}
              id="tab-history"
            >
              History
              {logs.length > 0 && <span className={styles.badge}>{logs.length}</span>}
            </button>
          </div>
        </div>

        {activeTab === "compose" && (
          <div className={styles.composerGrid}>
            {/* Left: Form */}
            <div className={styles.formCard}>
              <div className={styles.formSection}>
                <label className={styles.fieldLabel} htmlFor="broadcast-subject">
                  Subject Line
                </label>
                <input
                  id="broadcast-subject"
                  type="text"
                  className="admin-input"
                  style={{ width: "100%" }}
                  placeholder="e.g. Prompsy v0.8 is here — major new features 🚀"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className={styles.formSection}>
                <label className={styles.fieldLabel} htmlFor="broadcast-audience">
                  Audience
                </label>
                <select
                  id="broadcast-audience"
                  className="admin-input"
                  style={{ width: "100%" }}
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                >
                  <option value="all">All Users</option>
                  <option value="active">Active Users (last 7 days)</option>
                </select>
              </div>

              <div className={styles.formSection}>
                <label className={styles.fieldLabel} htmlFor="broadcast-body">
                  Email Body
                  <span className={styles.labelHint}>Plain text or basic HTML</span>
                </label>
                <textarea
                  id="broadcast-body"
                  className={`admin-input ${styles.bodyArea}`}
                  placeholder={`Hi there,\n\nWe're excited to announce…\n\nBest,\nThe Prompsy team`}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                />
              </div>

              {result && (
                <div
                  className={`${styles.resultBanner} ${result.error ? styles.resultError : styles.resultSuccess}`}
                >
                  {result.error
                    ? `Error: ${result.error}`
                    : result.sentTo === 1
                    ? "✓ Test email sent to your admin inbox."
                    : `✓ Successfully sent to ${result.sentTo?.toLocaleString()} users.`}
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  className="admin-btn admin-btn-ghost"
                  disabled={testSending || !subject || !body}
                  onClick={sendTest}
                  id="broadcast-send-test"
                >
                  {testSending ? "Sending test…" : "Send Test Email"}
                </button>
                <button
                  className="admin-btn admin-btn-primary"
                  disabled={sending || !subject || !body}
                  onClick={() => setShowConfirm(true)}
                  id="broadcast-send-all"
                >
                  {sending ? (
                    <>
                      <span className="admin-spinner" style={{ width: 14, height: 14 }} />
                      Sending…
                    </>
                  ) : (
                    "Send to All →"
                  )}
                </button>
              </div>
            </div>

            {/* Right: Preview */}
            <div className={styles.previewCard}>
              <div className={styles.previewHeader}>
                <div className={styles.previewDots}>
                  <span /><span /><span />
                </div>
                <span className={styles.previewTitle}>Email Preview</span>
              </div>
              <div className={styles.previewBody}>
                <iframe
                  srcDoc={previewHtml}
                  className={styles.previewFrame}
                  title="Email preview"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="admin-card">
            {logsLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 40, color: "var(--admin-text-2)" }}>
                <div className="admin-spinner" /> Loading history…
              </div>
            ) : logs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--admin-text-3)" }}>
                No broadcasts sent yet.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Sent To</th>
                    <th>Sent By</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontWeight: 500 }}>{log.subject}</td>
                      <td>
                        <span className={styles.sentCount}>
                          {log.sent_to_count?.toLocaleString() ?? "—"} users
                        </span>
                      </td>
                      <td style={{ color: "var(--admin-text-2)", fontFamily: "monospace", fontSize: 12 }}>
                        {log.sent_by}
                      </td>
                      <td style={{ color: "var(--admin-text-2)", whiteSpace: "nowrap" }}>
                        {formatDate(log.sent_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className={styles.overlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Confirm Broadcast</h3>
            <p className={styles.modalBody}>
              You are about to send <strong>&ldquo;{subject}&rdquo;</strong> to{" "}
              <strong>
                {audience === "all" ? "all users" : "active users (last 7 days)"}
              </strong>
              . This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button className="admin-btn admin-btn-ghost" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="admin-btn admin-btn-primary" onClick={sendAll} id="confirm-send-btn">
                Yes, Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
