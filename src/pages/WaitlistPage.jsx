import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function WaitlistPage() {
  const { theme, toggle } = useTheme();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="waitlist-page">
      {/* Header */}
      <header className="waitlist-navbar">
        <Link to="/dashboard" className="waitlist-logo">DealHunt</Link>
        <div className="waitlist-header-right">
          <button className="theme-toggle-header" aria-label="Toggle theme" onClick={toggle}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/profile" className="profile-button">
            <div className="profile-avatar">👤</div>
            <span className="profile-label">Profile</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="waitlist-main">
        <div className="waitlist-container">
          {/* Hero Section */}
          <section className="waitlist-hero">
            <div className="hero-badge">🚀 Coming Soon</div>
            <h1 className="waitlist-title">Exclusive Deals Await</h1>
            <p className="waitlist-subtitle">
              Join our waitlist to get early access to curated deals, exclusive offers, and insider tips on the best shopping moments of the year.
            </p>
          </section>

          {/* Signup Form */}
          <section className="waitlist-form-section">
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="form-submit">
                  Join Waitlist
                </button>
              </div>
              {submitted && (
                <div className="form-success">
                  ✓ Thanks! We'll notify you soon.
                </div>
              )}
            </form>
          </section>

          {/* Benefits Section */}
          <section className="waitlist-benefits">
            <h2 className="benefits-title">Why Join?</h2>
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">💰</div>
                <h3 className="benefit-card-title">Best Prices</h3>
                <p className="benefit-description">Get exclusive discounts before anyone else</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">⚡</div>
                <h3 className="benefit-card-title">Early Access</h3>
                <p className="benefit-description">Be the first to discover new deals</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">🎯</div>
                <h3 className="benefit-card-title">Smart Alerts</h3>
                <p className="benefit-description">Get notified about deals you care about</p>
              </div>
              <div className="benefit-card">
                <div className="benefit-icon">👑</div>
                <h3 className="benefit-card-title">VIP Treatment</h3>
                <p className="benefit-description">Special rewards for waitlist members</p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="waitlist-stats">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Members Waiting</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Deals Weekly</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">₹10K+</div>
              <div className="stat-label">Avg Savings</div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="waitlist-cta">
            <div className="cta-card">
              <h2 className="cta-title">Don't Miss Out</h2>
              <p className="cta-text">Join thousands of smart shoppers saving big with DealHunt</p>
              <Link to="/profile" className="cta-button">
                View Profile & Preferences
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function SunIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>;
}

function MoonIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
}
