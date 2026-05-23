import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function OffersDealsPage() {
  const { theme, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    document.title = 'Offers & Deals – DealHunt';
  }, []);

  const offers = [
    { id: 1, title: 'Summer Flash Sale', discount: '50%', category: 'Electronics', date: 'May 25 - 31' },
    { id: 2, title: 'Fashion Mega Deal', discount: '40%', category: 'Fashion', date: 'May 26 - 30' },
    { id: 3, title: 'Home Essentials Offer', discount: '35%', category: 'Home', date: 'May 24 - 29' },
    { id: 4, title: 'Tech Tuesday Special', discount: '45%', category: 'Electronics', date: 'Every Tuesday' },
    { id: 5, title: 'Beauty & Personal Care', discount: '30%', category: 'Beauty', date: 'May 23 - 28' },
    { id: 6, title: 'Sports Gear Blowout', discount: '55%', category: 'Sports', date: 'May 25 - Jun 1' },
  ];

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];

  const filteredOffers = activeTab === 'all'
    ? offers
    : offers.filter(offer => offer.category === activeTab);

  return (
    <div className="offers-deals-page">
      {/* Watermark Background */}
      <div className="offers-watermark">
        <span className="watermark-text">SPECIAL OFFERS</span>
      </div>

      {/* Navbar */}
      <header className="offers-navbar">
        <Link to="/dashboard" className="offers-logo">DealHunt</Link>
        <div className="offers-header-right">
          <button className="theme-toggle-offers" aria-label="Toggle theme" onClick={toggle}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/profile" className="profile-button-offers">
            <div className="profile-avatar-offers">👤</div>
            <span className="profile-label-offers">Profile</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="offers-main">
        <div className="offers-container">
          {/* Header */}
          <section className="offers-header">
            <h1 className="offers-title">Exclusive Offers & Deals</h1>
            <p className="offers-subtitle">Discover amazing discounts on your favorite products</p>
          </section>

          {/* Category Filter */}
          <section className="offers-filter">
            <div className="category-tabs">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-tab ${activeTab === (cat === 'All' ? 'all' : cat) ? 'active' : ''}`}
                  onClick={() => setActiveTab(cat === 'All' ? 'all' : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Offers Grid */}
          <section className="offers-grid">
            {filteredOffers.map(offer => (
              <div key={offer.id} className="offer-card">
                <div className="offer-header-section">
                  <span className="offer-badge">Limited Time</span>
                  <span className="offer-discount">{offer.discount} OFF</span>
                </div>
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-category">{offer.category}</p>
                <div className="offer-footer">
                  <span className="offer-date">
                    📅 {offer.date}
                  </span>
                  <button className="offer-cta">View →</button>
                </div>
              </div>
            ))}
          </section>

          {/* Additional Info */}
          <section className="offers-info">
            <div className="info-card">
              <h3 className="info-title">🎁 How to Use</h3>
              <p className="info-text">Browse available deals, click "View" to explore products, and apply the discount code at checkout to save big!</p>
            </div>
            <div className="info-card">
              <h3 className="info-title">⏰ Update Frequency</h3>
              <p className="info-text">New deals are added weekly. Check back often to find the best offers on your favorite items.</p>
            </div>
            <div className="info-card">
              <h3 className="info-title">📱 Get Alerts</h3>
              <p className="info-text">Set your preferences to get notified about deals in your favorite categories.</p>
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
