import Link from 'next/link';

const stats = [
  { value: '12.4k+', label: 'Reports filed' },
  { value: '3.8k', label: 'Resolved fixes' },
  { value: '91%', label: 'Priority issues flagged' },
  { value: '24/7', label: 'Community alerts' },
];

const featureCards = [
  {
    icon: '⚡',
    title: 'Fast issue reporting',
    text: 'Submit a pothole, crack, debris or hazard in under a minute with mobile-friendly forms.',
  },
  {
    icon: '📍',
    title: 'Geo-aware tracking',
    text: 'Capture location context and route high-risk areas to the right maintenance teams quickly.',
  },
  {
    icon: '🛠️',
    title: 'Actionable prioritization',
    text: 'Sort by urgency, severity, and repair status so dangerous zones get attention first.',
  },
  {
    icon: '🤝',
    title: 'Community driven',
    text: 'Turn resident observations into measurable public-safety improvements for every neighborhood.',
  },
];

const steps = [
  { number: '01', title: 'Spot an issue', text: 'Notice a pothole, damaged road, or obstacle while commuting or walking.' },
  { number: '02', title: 'Report instantly', text: 'Add location, image, category, and priority details in a single form.' },
  { number: '03', title: 'Track and fix', text: 'Authorities and civic teams can monitor, validate, and resolve reported hazards.' },
];

export default function HomePage() {
  return (
    <main className="page-shell landing-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">RS</div>
          <span>RoadSafe</span>
        </div>

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
          <p className="hero-text">
            RoadSafe helps communities report dangerous road conditions, monitor repair progress,
            and give city teams the information they need to act fast.
          </p>

          <div className="hero-actions">
            <a href="#report" className="primary-button">Report a problem</a>
            <Link href="#features" className="secondary-button">Explore features</Link>
          </div>

          <div className="mini-trust-row">
            <span>Trusted by civic teams</span>
            <span>•</span>
            <span>Live road hazard monitoring</span>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-header">
            <span className="live-pill">Live coverage</span>
            <span className="muted-text">Updated 2 mins ago</span>
          </div>

          <div className="stats-grid">
            {stats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="status-list">
            <div className="status-item">
              <span className="dot blue" />
              <span>High-severity potholes</span>
              <strong>38</strong>
            </div>
            <div className="status-item">
              <span className="dot amber" />
              <span>Needs review</span>
              <strong>12</strong>
            </div>
            <div className="status-item">
              <span className="dot green" />
              <span>Resolved this week</span>
              <strong>126</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="feature-section">
        <div className="section-header centered-header">
          <span className="eyebrow">Why RoadSafe?</span>
          <h2>Built to turn local observations into safer streets.</h2>
        </div>

        <div className="feature-grid">
          {featureCards.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="report" className="report-section">
        <div className="section-header left-align">
          <span className="eyebrow">Submit a report</span>
          <h2>Report a road hazard near you.</h2>
        </div>

        <div className="report-shell">
          <div className="report-intro">
            <h3>What we track</h3>
            <ul>
              <li>Potholes and cracked roads</li>
              <li>Flooded, blocked, or unsafe intersections</li>
              <li>Debris, broken barriers, and exposed hazards</li>
              <li>Street lighting and visibility issues</li>
            </ul>
            <div className="intro-card">
              <strong>Fast action</strong>
              <p>Reports are prioritized by severity, impact, and location so the most urgent repairs are addressed first.</p>
            </div>
          </div>

          <div className="form-card-wrapper">
            <form className="report-form">
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="title">Issue title</label>
                  <input id="title" placeholder="Large pothole outside school gate" />
                </div>

                <div className="field">
                  <label htmlFor="location">Location</label>
                  <input id="location" placeholder="Main street, bus stop area" />
                </div>

                <div className="field">
                  <label htmlFor="category">Category</label>
                  <select id="category" defaultValue="Pothole">
                    <option>Pothole</option>
                    <option>Road Crack</option>
                    <option>Debris / Obstacle</option>
                    <option>Open Manhole / Hazard</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="severity">Severity</label>
                  <select id="severity" defaultValue="medium">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="field full">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" rows={5} placeholder="Describe the issue, size, depth, and risk to drivers or pedestrians" />
                </div>

                <div className="field">
                  <label htmlFor="name">Reporter name</label>
                  <input id="name" placeholder="Optional" />
                </div>

                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" placeholder="Optional" />
                </div>
              </div>

              <button type="button" className="primary-button">Submit report</button>
            </form>
          </div>
        </div>
      </section>

      <section id="impact" className="impact-section">
        <div className="section-header centered-header">
          <span className="eyebrow">Impact</span>
          <h2>How this improves public safety.</h2>
        </div>

        <div className="impact-grid">
          <div className="impact-card">
            <span className="impact-number">72%</span>
            <p>Faster response times for dangerous road conditions when residents report issues in real time.</p>
          </div>
          <div className="impact-card">
            <span className="impact-number">4.9/5</span>
            <p>Civic satisfaction scores for transparent issue tracking and public communication.</p>
          </div>
          <div className="impact-card">
            <span className="impact-number">1M+</span>
            <p>Routine trips made safer through better hazard visibility and faster maintenance scheduling.</p>
          </div>
        </div>
      </section>

      <section className="steps-section">
        <div className="section-header centered-header">
          <span className="eyebrow">How it works</span>
          <h2>Three simple steps to create safer streets.</h2>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
            <div className="step-card" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

