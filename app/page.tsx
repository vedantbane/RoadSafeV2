import Link from 'next/link';
import { ReportForm } from '@/components/report-form';

const features = [
  ['⚡', 'Fast reporting', 'Submit a road issue in under a minute with clear, structured details.'],
  ['📍', 'Location aware', 'Give maintenance teams the context they need to find the issue quickly.'],
  ['🛠️', 'Priority tracking', 'Severity and status help teams focus on hazards that matter most.'],
  ['🤝', 'Community driven', 'Every report turns a local observation into a safer route for everyone.'],
];

export default function HomePage() {
  return (
    <main className="page-shell landing-shell">
      <header className="topbar">
        <Link className="brand-wrap" href="/">
          <span className="brand-mark">RS</span>
          <span>RoadSafe</span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          <Link href="#features">Features</Link>
          <Link href="#report">Report</Link>
          <Link href="#impact">Impact</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Public safety intelligence</span>
          <h1>Safer roads start with residents like you.</h1>
          <p className="hero-text">RoadSafe helps communities report dangerous road conditions, monitor repair progress, and give civic teams the information they need to act fast.</p>
          <div className="hero-actions">
            <a href="#report" className="primary-button">Report a problem</a>
            <a href="#features" className="secondary-button">Explore features</a>
          </div>
          <div className="mini-trust-row"><span>Community powered</span><span>•</span><span>Built for faster civic action</span></div>
        </div>

        <div className="hero-panel">
          <div className="panel-header"><span className="live-pill">Live coverage</span><span className="muted-text">Ready for reports</span></div>
          <div className="stats-grid">
            <div className="stat-card"><strong>24/7</strong><span>Community alerts</span></div>
            <div className="stat-card"><strong>3 steps</strong><span>To report an issue</span></div>
            <div className="stat-card"><strong>100%</strong><span>Location focused</span></div>
            <div className="stat-card"><strong>1 place</strong><span>To track progress</span></div>
          </div>
          <div className="status-list">
            <div className="status-item"><span className="dot blue" />Report a hazard<span className="status-arrow">→</span></div>
            <div className="status-item"><span className="dot amber" />Review priority<span className="status-arrow">→</span></div>
            <div className="status-item"><span className="dot green" />Make roads safer<span className="status-arrow">✓</span></div>
          </div>
        </div>
      </section>

      <section id="features" className="feature-section">
        <div className="section-header centered-header"><span className="eyebrow">Why RoadSafe?</span><h2>Turn local observations into safer streets.</h2></div>
        <div className="feature-grid">
          {features.map(([icon, title, text]) => <article className="feature-card" key={title}><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section id="report" className="report-section">
        <div className="section-header left-align"><span className="eyebrow">Submit a report</span><h2>Report a road hazard near you.</h2></div>
        <div className="report-shell">
          <aside className="report-intro"><h3>What can you report?</h3><ul><li>Potholes and cracked roads</li><li>Flooded or blocked intersections</li><li>Debris and exposed hazards</li><li>Street lighting and visibility issues</li></ul><div className="intro-card"><strong>Fast action</strong><p>Severity and location details help civic teams address urgent hazards first.</p></div></aside>
          <ReportForm />
        </div>
      </section>

      <section id="impact" className="impact-section">
        <div className="section-header centered-header"><span className="eyebrow">How it works</span><h2>Three simple steps to make a difference.</h2></div>
        <div className="steps-grid"><div className="step-card"><span>01</span><h3>Spot the issue</h3><p>Notice a pothole, crack, debris, or hazard while traveling.</p></div><div className="step-card"><span>02</span><h3>Report instantly</h3><p>Add the location, category, severity, and a useful description.</p></div><div className="step-card"><span>03</span><h3>Track and fix</h3><p>Maintenance teams can review, prioritize, and resolve the issue.</p></div></div>
      </section>
    </main>
  );
}
