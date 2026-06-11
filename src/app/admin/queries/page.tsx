"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import styles from "./queries.module.css";

interface Query {
  id: string;
  user_email: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved";
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATUS_LABELS: Record<string, string> = {
  all: "All",
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export default function QueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Query | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const fetchQueries = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/queries?status=${statusFilter}`);
    const data = await res.json();
    if (data.queries) setQueries(data.queries);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { fetchQueries(); }, [fetchQueries]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function openQuery(q: Query) {
    setSelected(q);
    setNotes(q.admin_notes || "");
  }

  async function saveNotes(newStatus?: string) {
    if (!selected) return;
    setSaving(true);
    const body: Record<string, string> = { admin_notes: notes };
    if (newStatus) body.status = newStatus;

    const res = await fetch(`/api/admin/queries/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.query) {
      setSelected(data.query);
      setNotes(data.query.admin_notes || "");
      showToast("Saved.");
      fetchQueries();
    }
    setSaving(false);
  }

  async function deleteQuery(id: string) {
    if (!confirm("Delete this query? This cannot be undone.")) return;
    await fetch(`/api/admin/queries/${id}`, { method: "DELETE" });
    if (selected?.id === id) setSelected(null);
    showToast("Query deleted.");
    fetchQueries();
  }

  return (
    <AdminShell>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.heading}>Queries</h1>
            <p className={styles.sub}>Manage user support requests</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className={styles.tabs}>
          {Object.keys(STATUS_LABELS).map((s) => (
            <button
              key={s}
              className={`${styles.tab} ${statusFilter === s ? styles.tabActive : ""}`}
              onClick={() => setStatusFilter(s)}
              id={`queries-filter-${s}`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <div className={styles.split}>
          {/* Left — List */}
          <div className={styles.list}>
            {loading && (
              <div className={styles.loadingCenter}>
                <div className="admin-spinner" />
              </div>
            )}
            {!loading && queries.length === 0 && (
              <div className={styles.empty}>No queries found.</div>
            )}
            {!loading && queries.map((q) => (
              <div
                key={q.id}
                className={`${styles.queryRow} ${selected?.id === q.id ? styles.queryRowActive : ""}`}
                onClick={() => openQuery(q)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openQuery(q)}
              >
                <div className={styles.queryTop}>
                  <span className={styles.queryEmail}>{q.user_email}</span>
                  <span className={`admin-badge badge-${q.status}`}>{q.status.replace("_", " ")}</span>
                </div>
                <div className={styles.querySubject}>{q.subject}</div>
                <div className={styles.queryTime}>{timeAgo(q.created_at)}</div>
              </div>
            ))}
          </div>

          {/* Right — Detail */}
          <div className={styles.detail}>
            {!selected ? (
              <div className={styles.detailEmpty}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                <p>Select a query to view details</p>
              </div>
            ) : (
              <div className={styles.detailContent}>
                <div className={styles.detailHeader}>
                  <div>
                    <div className={styles.detailEmail}>{selected.user_email}</div>
                    <h2 className={styles.detailSubject}>{selected.subject}</h2>
                    <div className={styles.detailMeta}>
                      <span className={`admin-badge badge-${selected.status}`}>
                        {selected.status.replace("_", " ")}
                      </span>
                      <span className={styles.detailTime}>{timeAgo(selected.created_at)}</span>
                    </div>
                  </div>
                  <button
                    className="admin-btn admin-btn-danger"
                    style={{ fontSize: "12px", padding: "6px 12px" }}
                    onClick={() => deleteQuery(selected.id)}
                    id="delete-query-btn"
                  >
                    Delete
                  </button>
                </div>

                <div className={styles.messageBox}>
                  <p>{selected.message}</p>
                </div>

                <div className={styles.notesSection}>
                  <label className={styles.notesLabel} htmlFor="admin-notes">
                    Admin Notes
                  </label>
                  <textarea
                    id="admin-notes"
                    className={`admin-input ${styles.notesArea}`}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add internal notes here…"
                    rows={4}
                  />
                </div>

                <div className={styles.detailActions}>
                  <div className={styles.statusActions}>
                    <button
                      className="admin-btn admin-btn-ghost"
                      style={{ fontSize: "12px" }}
                      disabled={selected.status === "in_progress" || saving}
                      onClick={() => saveNotes("in_progress")}
                    >
                      Mark In Progress
                    </button>
                    <button
                      className="admin-btn admin-btn-ghost"
                      style={{ fontSize: "12px", color: "var(--admin-green)" }}
                      disabled={selected.status === "resolved" || saving}
                      onClick={() => saveNotes("resolved")}
                    >
                      ✓ Mark Resolved
                    </button>
                  </div>
                  <button
                    className="admin-btn admin-btn-primary"
                    disabled={saving}
                    onClick={() => saveNotes()}
                    id="save-notes-btn"
                  >
                    {saving ? "Saving…" : "Save Notes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
