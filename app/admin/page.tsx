'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Report = {
  id: string;
  title: string;
  location_name?: string;
  category?: string;
  status?: string;
  severity?: string;
  created_at?: string;
  reporter_name?: string | null;
};

const statusStyles: Record<string, string> = {
  pending: 'status pending',
  under_review: 'status review',
  in_progress: 'status in-progress',
  resolved: 'status resolved',
  rejected: 'status rejected',
};

const severityStyles: Record<string, string> = {
  low: 'severity low',
  medium: 'severity medium',
  high: 'severity high',
  critical: 'severity high',
};

function formatStatus(value?: string) {
  if (!value) return 'Pending';
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('roadsafe-admin-token');
    if (savedToken) {
      setToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    async function fetchReports() {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/reports', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Session expired or unauthorized');
        }

        const data = await response.json();
        setReports(Array.isArray(data) ? data : []);
        setError('');
      } catch (err) {
        console.error(err);
        localStorage.removeItem('roadsafe-admin-token');
        setToken(null);
        setError('Your admin session expired. Please log in again.');
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, [token]);

  const metrics = useMemo(() => {
    const total = reports.length;
    const pending = reports.filter((r) => (r.status || 'pending') === 'pending').length;
    const inProgress = reports.filter((r) => (r.status || 'pending') === 'in_progress').length;
    const resolved = reports.filter((r) => (r.status || 'pending') === 'resolved').length;

    return [
      { label: 'Total reports', value: String(total), tone: 'blue' },
      { label: 'Pending review', value: String(pending), tone: 'amber' },
      { label: 'In progress', value: String(inProgress), tone: 'purple' },
      { label: 'Resolved', value: String(resolved), tone: 'green' },
    ];
  }, [reports]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthLoading(true);
    setLoginError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to sign in');
      }

      if (data.user?.role !== 'admin') {
        throw new Error('This account does not have admin access');
      }

      localStorage.setItem('roadsafe-admin-token', data.token);
      setToken(data.token);
      setLoginForm({ email: '', password: '' });
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Unable to sign in');
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('roadsafe-admin-token');
    setToken(null);
    setReports([]);
    setError('');
  }

  if (!token) {
    return (
      <main className="login-shell">
        <div className="login-card">
          <div className="sidebar-brand centered-brand">
            <div className="brand-mark">RS</div>
            <div>
              <strong>RoadSafe</strong>
              <span>Admin access</span>
            </div>
          </div>

          <h1>Sign in to continue</h1>
          <p>Only authorized admin accounts can manage road reports.</p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <label>
              Email
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="admin@roadsafe.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Your secure password"
                required
              />
            </label>

            {loginError ? <div className="auth-error">{loginError}</div> : null}

            <button type="submit" className="primary-button" disabled={authLoading}>
              {authLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">RS</div>
          <div>
            <strong>RoadSafe</strong>
            <span>Admin Console</span>
          </div>
        </div>

        <nav className="admin-nav">
          <a className="active" href="#">Overview</a>
          <a href="#">Reports</a>
          <a href="#">Map</a>
          <a href="#">Users</a>
          <a href="#">Settings</a>
        </nav>

        <button className="secondary-button logout-button" onClick={handleLogout}>Log out</button>
      </aside>

      <section className="admin-main">
        <header className="admin-header">
          <div>
            <span className="eyebrow dark">Operations dashboard</span>
            <h1>Road safety overview</h1>
          </div>
          <button className="primary-button small-btn">Export report</button>
        </header>

        {error ? <div className="auth-error admin-alert">{error}</div> : null}

        <div className="dashboard-stats">
          {metrics.map((card) => (
            <div className={`stat-box ${card.tone}`} key={card.label}>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
            </div>
          ))}
        </div>

        <div className="admin-panel">
          <div className="panel-head">
            <h2>Active reports</h2>
            <button className="ghost-button">Filter</button>
          </div>

          <div className="table-wrap">
            {loading ? (
              <div className="table-empty">Loading reports...</div>
            ) : reports.length === 0 ? (
              <div className="table-empty">No reports have been submitted yet.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Report ID</th>
                    <th>Issue</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Severity</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.id.slice(0, 8).toUpperCase()}</td>
                      <td>{report.title}</td>
                      <td>{report.location_name || '—'}</td>
                      <td>
                        <span className={statusStyles[(report.status || 'pending').toLowerCase()] || 'status pending'}>
                          {formatStatus(report.status)}
                        </span>
                      </td>
                      <td>
                        <span className={severityStyles[(report.severity || 'medium').toLowerCase()] || 'severity medium'}>
                          {String(report.severity || 'Medium').charAt(0).toUpperCase() + String(report.severity || 'Medium').slice(1)}
                        </span>
                      </td>
                      <td>{report.created_at ? new Date(report.created_at).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
