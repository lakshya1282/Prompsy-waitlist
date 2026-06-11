"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/admin/AdminShell";
import styles from "./users.module.css";

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  is_active: boolean;
  email_confirmed_at: string | null;
  banned: boolean;
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?page=${page}&per_page=25`);
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch {
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  async function handleAction(userId: string, action: "ban" | "unban" | "delete") {
    if (action === "delete" && !confirm("Permanently delete this user? This cannot be undone.")) return;
    setActionLoading(userId + action);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`User ${action}ned successfully.`);
        fetchUsers();
      } else {
        showToast(data.error || "Action failed.");
      }
    } catch {
      showToast("Network error.");
    } finally {
      setActionLoading(null);
    }
  }

  function exportCSV() {
    const rows = [
      ["Email", "Joined", "Last Sign In", "Active", "Banned"].join(","),
      ...filtered.map((u) =>
        [
          u.email,
          formatDate(u.created_at),
          timeAgo(u.last_sign_in_at),
          u.is_active ? "Yes" : "No",
          u.banned ? "Yes" : "No",
        ].join(",")
      ),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompsy-users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  const filtered = users.filter((u) =>
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.heading}>Users</h1>
            <p className={styles.sub}>
              {users.length} users loaded · Page {page}
            </p>
          </div>
          <div className={styles.actions}>
            <input
              id="user-search"
              type="text"
              className={`admin-input ${styles.search}`}
              placeholder="Search by email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={exportCSV} className="admin-btn admin-btn-ghost" id="export-csv-btn">
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        <div className="admin-card">
          {loading ? (
            <div className={styles.loadingCenter}>
              <div className="admin-spinner" />
              <span>Loading users…</span>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Last Sign In</th>
                    <th>Status</th>
                    <th>Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className={styles.emptyRow}>
                        {search ? "No users match your search." : "No users found."}
                      </td>
                    </tr>
                  )}
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td className={styles.emailCell}>{u.email || "—"}</td>
                      <td style={{ color: "var(--admin-text-2)", whiteSpace: "nowrap" }}>
                        {formatDate(u.created_at)}
                      </td>
                      <td style={{ color: "var(--admin-text-2)", whiteSpace: "nowrap" }}>
                        {timeAgo(u.last_sign_in_at)}
                      </td>
                      <td>
                        {u.banned ? (
                          <span className="admin-badge badge-banned">Banned</span>
                        ) : u.is_active ? (
                          <span className="admin-badge badge-active">Active</span>
                        ) : (
                          <span className="admin-badge badge-inactive">Inactive</span>
                        )}
                      </td>
                      <td>
                        {u.email_confirmed_at ? (
                          <span style={{ color: "var(--admin-green)", fontSize: "12px" }}>✓ Yes</span>
                        ) : (
                          <span style={{ color: "var(--admin-text-3)", fontSize: "12px" }}>✗ No</span>
                        )}
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          {u.banned ? (
                            <button
                              className="admin-btn admin-btn-ghost"
                              style={{ fontSize: "12px", padding: "4px 10px" }}
                              disabled={actionLoading === u.id + "unban"}
                              onClick={() => handleAction(u.id, "unban")}
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              className="admin-btn admin-btn-ghost"
                              style={{ fontSize: "12px", padding: "4px 10px" }}
                              disabled={actionLoading === u.id + "ban"}
                              onClick={() => handleAction(u.id, "ban")}
                            >
                              Ban
                            </button>
                          )}
                          <button
                            className="admin-btn admin-btn-danger"
                            style={{ fontSize: "12px", padding: "4px 10px" }}
                            disabled={actionLoading === u.id + "delete"}
                            onClick={() => handleAction(u.id, "delete")}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button
            className="admin-btn admin-btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            id="users-prev-page"
          >
            ← Previous
          </button>
          <span className={styles.pageLabel}>Page {page}</span>
          <button
            className="admin-btn admin-btn-ghost"
            disabled={users.length < 25}
            onClick={() => setPage((p) => p + 1)}
            id="users-next-page"
          >
            Next →
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
