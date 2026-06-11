"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import styles from "./dashboard.module.css";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  openQueries: number;
  broadcastCount: number;
  recentUsers: { email: string; created_at: string }[];
}

function KpiCard({
  label,
  value,
  sub,
  color,
  icon,
}: {
  label: string;
  value: number | string;
  sub?: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={styles.kpi}>
      <div className={styles.kpiIcon} style={{ background: color }}>
        {icon}
      </div>
      <div className={styles.kpiBody}>
        <div className={styles.kpiValue}>{value}</div>
        <div className={styles.kpiLabel}>{label}</div>
        {sub && <div className={styles.kpiSub}>{sub}</div>}
      </div>
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setStats(d);
      })
      .catch(() => setError("Failed to load stats."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell>
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.heading}>Dashboard</h1>
          <p className={styles.subheading}>
            Welcome back. Here&apos;s what&apos;s happening with Prompsy.
          </p>
        </div>

        {loading && (
          <div className={styles.loadingRow}>
            <div className="admin-spinner" />
            <span>Loading metrics…</span>
          </div>
        )}

        {error && (
          <div className={styles.errorBanner}>
            {error} — Check that SUPABASE_SERVICE_ROLE_KEY is configured.
          </div>
        )}

        {stats && (
          <>
            <div className={styles.kpiGrid}>
              <KpiCard
                label="Total Users"
                value={stats.totalUsers.toLocaleString()}
                color="rgba(139,92,246,0.15)"
                icon={
                  <svg viewBox="0 0 20 20" fill="#8b5cf6" width="20" height="20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                }
              />
              <KpiCard
                label="Active (7 days)"
                value={stats.activeUsers.toLocaleString()}
                sub={`${stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}% of total`}
                color="rgba(16,185,129,0.12)"
                icon={
                  <svg viewBox="0 0 20 20" fill="#10b981" width="20" height="20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
              <KpiCard
                label="Open Queries"
                value={stats.openQueries}
                color="rgba(245,158,11,0.12)"
                icon={
                  <svg viewBox="0 0 20 20" fill="#f59e0b" width="20" height="20">
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                }
              />
              <KpiCard
                label="Broadcasts Sent"
                value={stats.broadcastCount}
                color="rgba(59,130,246,0.12)"
                icon={
                  <svg viewBox="0 0 20 20" fill="#3b82f6" width="20" height="20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                }
              />
            </div>

            <div className={styles.recentsCard}>
              <div className={styles.recentsHeader}>
                <h2 className={styles.recentsTitle}>Recent Signups</h2>
              </div>
              {stats.recentUsers.length === 0 ? (
                <div className={styles.empty}>No users yet.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentUsers.map((u, i) => (
                      <tr key={i}>
                        <td>{u.email}</td>
                        <td style={{ color: "var(--admin-text-2)" }}>
                          {timeAgo(u.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
