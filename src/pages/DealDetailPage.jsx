import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { PRODUCTS, fmt, scoreLabel, scoreColor } from '../data/products';

export default function DealDetailPage() {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === parseInt(id)) || PRODUCTS[0];

  const { theme, toggle } = useTheme();
  const [displayScore, setDisplayScore] = useState(0);
  const [barsVisible, setBarsVisible]   = useState(false);
  const gaugeFillRef = useRef(null);

  useEffect(() => {
    document.title = `${product.shortName} – DealHunt`;

    // Animate score counter
    const start = performance.now();
    const duration = 1200;
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * product.dealScore));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    // Animate gauge
    const circumference = 314;
    const offset = circumference - (product.dealScore / 100) * circumference;
    const gaugeTimer = setTimeout(() => {
      if (gaugeFillRef.current) {
        gaugeFillRef.current.style.strokeDashoffset = offset;
        gaugeFillRef.current.style.stroke = scoreColor(product.dealScore);
      }
    }, 200);

    // Animate score bars
    const barTimer = setTimeout(() => setBarsVisible(true), 400);

    return () => {
      clearTimeout(gaugeTimer);
      clearTimeout(barTimer);
      setDisplayScore(0);
      setBarsVisible(false);
    };
  }, [product]);

  const sl = scoreLabel(product.dealScore);
  const maxPrice  = Math.max(...product.priceHistory);
  const minPrice  = Math.min(...product.priceHistory);

  const historyPct  = Math.min(100, Math.round((product.dealScore / 100) * 90 + 5));
  const marketPct   = Math.min(100, Math.round((1 - product.price / product.originalPrice) * 100));
  const ratingPct   = Math.round((product.rating / 5) * 100);
  const discountPct = Math.min(100, product.discount > 0 ? product.discount : 5);

  const scoreBars = [
    { label: 'Price vs History', pct: historyPct },
    { label: 'Market Position',  pct: marketPct },
    { label: 'User Rating',      pct: ratingPct },
    { label: 'Discount Depth',   pct: discountPct },
  ];

  return (
    <div className="deal-page">
      {/* Navbar */}
      <header className="deal-navbar">
        <Link to="/dashboard" className="back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Deals
        </Link>
        <span className="deal-nav-wordmark">DealHunt</span>
        <button className="theme-toggle-sm" aria-label="Toggle theme" onClick={toggle}>
          {theme === 'dark' ? <SunIconSm /> : <MoonIconSm />}
        </button>
      </header>

      <main className="deal-main">
        {/* Hero */}
        <section className="deal-hero">
          <div className="hero-image-wrap">
            {product.image ? (
              <img src={product.image} alt={product.name} className="hero-image" />
            ) : (
              <>
                <div className="hero-image-bg" style={{ background: product.gradient }} />
                <span className="hero-emoji">{product.emoji}</span>
              </>
            )}
          </div>
          <div className="hero-info">
            <div className="hero-badges">
              <span className="hero-platform-badge">{product.platform}</span>
              <span className="hero-category-badge">{product.category}</span>
            </div>
            <h1 className="hero-title">{product.name}</h1>
            <div className="hero-prices">
              {product.discount > 0 && <span className="hero-original">{fmt(product.originalPrice)}</span>}
              <span className="hero-deal">{fmt(product.price)}</span>
              {product.discount > 0 && <span className="hero-discount">-{product.discount}%</span>}
            </div>
            <div className="hero-rating">
              <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
              &nbsp;{product.rating}&nbsp;·&nbsp;{product.reviews.toLocaleString('en-IN')} reviews
            </div>
            <div className="hero-specs">
              {product.specs.map(s => <span key={s} className="spec-badge">{s}</span>)}
            </div>
            <a className="buy-now-btn" href={product.link} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              Buy Now — Best Price
            </a>
          </div>
        </section>

        {/* Deal Score */}
        <section className="deal-section">
          <h2 className="section-title">Deal Score</h2>
          <div className="score-container">
            <div className="score-gauge-wrap">
              <div className="score-gauge">
                <svg className="gauge-svg" viewBox="0 0 120 120">
                  <circle className="gauge-track" cx="60" cy="60" r="50" fill="none" strokeWidth="10" />
                  <circle
                    ref={gaugeFillRef}
                    className="gauge-fill"
                    cx="60" cy="60" r="50" fill="none" strokeWidth="10"
                    strokeDasharray="314" strokeDashoffset="314" strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    stroke="var(--border)"
                  />
                </svg>
                <div className="gauge-center">
                  <span className="gauge-number">{displayScore}</span>
                  <span className="gauge-label-sm">/ 100</span>
                </div>
              </div>
              <div className={`gauge-verdict ${sl.cls}`}>{sl.label}</div>
            </div>

            <div className="score-breakdown">
              {scoreBars.map(bar => (
                <div className="score-bar-row" key={bar.label}>
                  <span className="sbar-label">{bar.label}</span>
                  <div className="sbar-track">
                    <div className="sbar-fill" style={{ width: barsVisible ? bar.pct + '%' : '0%' }} />
                  </div>
                  <span className="sbar-pct">{barsVisible ? bar.pct + '%' : '–'}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Comparison */}
        <section className="deal-section">
          <h2 className="section-title">Price Across Platforms</h2>
          <div className="platform-compare">
            {product.platforms.map(pl => (
              <div key={pl.name} className={`platform-card${pl.best ? ' best' : ''}`}>
                <div className="platform-name">{pl.name}</div>
                <div className="platform-price">{fmt(pl.price)}</div>
                {pl.best && <div className="platform-best-tag">✓ Best Price</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Price History */}
        <section className="deal-section">
          <h2 className="section-title">
            Price History <span className="section-sub">(last 6 months)</span>
          </h2>
          <PriceChart history={product.priceHistory} labels={product.priceLabels} />
        </section>

        {/* Product Details */}
        <section className="deal-section">
          <h2 className="section-title">Product Details</h2>
          <p className="product-desc">{product.description}</p>
        </section>

        {/* AI Recommendation */}
        <section className="deal-section">
          <h2 className="section-title">🤖 AI Recommendation</h2>
          <div className="ai-card">
            <div className="ai-header">
              <span className="ai-icon">🤖</span>
              <span className="ai-title">DealHunt AI Analysis</span>
            </div>
            <p className="ai-text">{product.aiSummary}</p>
          </div>
        </section>
      </main>

      {/* Sticky CTA */}
      <div className="deal-sticky-cta">
        <div className="sticky-price">
          Best price: <strong>{fmt(product.price)}</strong> on {product.platform}
        </div>
        <a className="buy-now-btn sticky-buy" href={product.link} target="_blank" rel="noopener noreferrer">
          Buy Now →
        </a>
      </div>
    </div>
  );
}

function PriceChart({ history, labels }) {
  const [visible, setVisible] = useState(false);
  const maxP = Math.max(...history);
  const minP = Math.min(...history);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="price-chart-wrap">
      <div className="price-chart">
        {history.map((price, i) => {
          const heightPct = ((price - minP) / (maxP - minP || 1)) * 80 + 15;
          const isLowest  = price === minP;
          return (
            <div key={i} className="price-bar-group">
              <div
                className={`price-bar${isLowest ? ' lowest' : ''}`}
                style={{ height: visible ? heightPct + '%' : '0%' }}
                title={fmt(price)}
              >
                <div className="price-bar-tooltip">{fmt(price)}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="price-chart-labels">
        {labels.map(l => <div key={l} className="price-chart-label">{l}</div>)}
      </div>
    </div>
  );
}

function SunIconSm() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>;
}
function MoonIconSm() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
}
