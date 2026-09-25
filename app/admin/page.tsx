'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Report = { id: string; title: string; location_name?: string; status?: string; severity?: string; created_at?: string };
const statuses = ['pending', 'under_review', 'in_progress', 'resolved', 'rejected'];
const statusClass: Record<string, string> = { pending: 'status pending', under_review: 'status review', in_progress: 'status in-progress', resolved: 'status resolved', rejected: 'status rejected' };
const severityClass: Record<string, string> = { low: 'severity low', medium: 'severity medium', high: 'severity high' };
const label = (value?: string) => (value || 'pending').split('_').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function loadReports() {
    const response = await fetch('/api/admin/reports', { credentials: 'include' });
    if (!response.ok) throw new Error('Unauthorized or expired session');
    setReports(await response.json());
    setAuthenticated(true);
  }

  useEffect(() => { loadReports().catch(() => setLoading(false)).finally(() => setLoading(false)); }, []);

  const metrics = useMemo(() => [
    ['Total reports', reports.length, 'blue'],
    ['Pending review', reports.filter((r) => (r.status || 'pending') === 'pending').length, 'amber'],
    ['In progress', reports.filter((r) => r.status === 'in_progress').length, 'purple'],
    ['Resolved', reports.filter((r) => r.status === 'resolved').length, 'green'],
  ], [reports]);

  async function login(event: FormEvent) {
    event.preventDefault(); setError('');
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(loginForm) });
    const data = await response.json();
    if (!response.ok) return setError(data.error || 'Unable to sign in');
    if (data.user?.role !== 'admin') return setError('This account does not have admin access');
    await loadReports();
  }

  async function logout() { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); setAuthenticated(false); setReports([]); }

  if (!authenticated) return <main className="login-shell"><div className="login-card"><div className="sidebar-brand centered-brand"><div className="brand-mark">RS</div><div><strong>RoadSafe</strong><span>Admin access</span></div></div><h1>Sign in to continue</h1><p>Only authorized admin accounts can manage road reports.</p><form onSubmit={login} className="admin-login-form"><label>Email<input type="email" required value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} /></label><label>Password<input type="password" required value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} /></label>{error && <div className="auth-error">{error}</div>}<button className="primary-button" disabled={loading}>{loading ? 'Checking session...' : 'Sign in'}</button></form></div></main>;

  return <main className="admin-shell"><aside className="admin-sidebar"><div className="sidebar-brand"><div className="brand-mark">RS</div><div><strong>RoadSafe</strong><span>Admin Console</span></div></div><nav className="admin-nav"><a className="active" href="#">Overview</a><a href="#reports">Reports</a><a href="/">Back to site</a></nav><button className="secondary-button logout-button" onClick={logout}>Log out</button></aside><section className="admin-main"><header className="admin-header"><div><span className="eyebrow dark">Operations dashboard</span><h1>Road safety overview</h1></div><button className="primary-button small-btn" onClick={() => loadReports()}>Refresh</button></header><div className="dashboard-stats">{metrics.map(([name, value, tone]) => <div className={`stat-box ${tone}`} key={name}><span>{name}</span><strong>{value}</strong></div>)}</div><div id="reports" className="admin-panel"><div className="panel-head"><h2>Community reports</h2><span className="muted-text">{reports.length} records</span></div><div className="table-wrap">{loading ? <div className="table-empty">Loading reports...</div> : reports.length === 0 ? <div className="table-empty">No reports have been submitted yet.</div> : <table><thead><tr><th>Report ID</th><th>Issue</th><th>Location</th><th>Status</th><th>Severity</th><th>Created</th></tr></thead><tbody>{reports.map((report) => <tr key={report.id}><td>{report.id.slice(0, 8).toUpperCase()}</td><td>{report.title}</td><td>{report.location_name || '—'}</td><td><span className={statusClass[report.status || 'pending']}>{label(report.status)}</span></td><td><span className={severityClass[report.severity || 'medium']}>{label(report.severity)}</span></td><td>{report.created_at ? new Date(report.created_at).toLocaleDateString() : '—'}</td></tr>)}</tbody></table>}</div></div></section></main>;
}
