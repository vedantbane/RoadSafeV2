import Link from 'next/link';
import { ReportForm } from '@/components/report-form';

export default function HomePage() {
  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">RS</div>
          <span>RoadSafe</span>
        </div>
        <nav className="nav-links">
          <Link href="#features">Features</Link>
          <Link href="#report">Report</Link>
          <Link href="#about">About</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Community safety platform</p>
          <h1>Safer roads start with you.</h1>
          <p className="hero-text">
            Report potholes, cracks, debris, and road hazards in seconds. Help authorities fix issues faster and keep every journey safer.
          </p>
          <div className="hero-actions">
            <a href="#report" className="primary-button">Report a problem</a>
            <Link href="#features" className="secondary-button">Explore features</Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="stats-grid">
            <div className="stat-card">
              <strong>1.2k+</strong>
              <span>Total reports</span>
            </div>
            <div className="stat-card">
              <strong>420</strong>
              <span>Resolved</span>
            </div>
            <div className="stat-card">
              <strong>86</strong>
              <span>High priority</span>
            </div>
            <div className="stat-card">
              <strong>26</strong>
              <span>In progress</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="feature-section">
        <div className="section-header">
          <p className="eyebrow">Why RoadSafe?</p>
          <h2>A simple platform that connects citizens with maintenance teams.</h2>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast reporting</h3>
            <p>Submit a road issue in under a minute with precise damage details.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Location aware</h3>
            <p>Capture the exact location and track the severity of public hazards.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">🛠️</div>
            <h3>Priority tracking</h3>
            <p>Help authorities focus on the most dangerous street issues first.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Community driven</h3>
            <p>Every report contributes to safer streets and better infrastructure.</p>
          </article>
        </div>
      </section>

      <section id="report" className="report-section">
        <div className="section-header left-align">
          <p className="eyebrow">Submit a road issue</p>
          <h2>Report a hazard near you.</h2>
        </div>

        <ReportForm />
      </section>

      <section id="about" className="about-section">
        <div className="section-header left-align">
          <p className="eyebrow">How it works</p>
          <h2>Three simple steps to make a difference.</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span>01</span>
            <h3>Spot the issue</h3>
            <p>Notice a pothole, crack, debris, or hazard while traveling.</p>
          </div>
          <div className="step-card">
            <span>02</span>
            <h3>Report instantly</h3>
            <p>Submit a short report with location, category, and description.</p>
          </div>
          <div className="step-card">
            <span>03</span>
            <h3>Track and fix</h3>
            <p>Authorities review and update the issue status as it is addressed.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
