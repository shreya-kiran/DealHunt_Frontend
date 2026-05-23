/* DealHunt – Deal Detail Page JS */
'use strict';

const fmt = n => '₹' + Number(n).toLocaleString('en-IN');

function scoreLabel(score) {
  if (score >= 80) return { label: '🟢 Excellent Deal', cls: 'excellent' };
  if (score >= 65) return { label: '🟡 Good Deal',      cls: 'good' };
  if (score >= 45) return { label: '🟠 Fair Price',     cls: 'fair' };
  return { label: '🔴 Avoid',          cls: 'avoid' };
}

function scoreColor(score) {
  if (score >= 80) return 'var(--success)';
  if (score >= 65) return 'var(--warning)';
  if (score >= 45) return '#94A3B8';
  return 'var(--danger)';
}

// ── Get product from URL param ────────────────────
function getProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  const products = window.PRODUCTS || [];
  return products.find(p => p.id === id) || products[0];
}

// ── Animate counter ───────────────────────────────
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ── Animate gauge ─────────────────────────────────
function animateGauge(score) {
  const fill = document.getElementById('gauge-fill');
  const circumference = 314; // 2π × 50
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);
  setTimeout(() => {
    fill.style.strokeDashoffset = offset;
    fill.style.stroke = color;
  }, 200);
}

// ── Render hero ───────────────────────────────────
function renderHero(p) {
  // Image
  document.getElementById('hero-image').innerHTML = `
    <div class="hero-image-bg" style="background:${p.gradient};"></div>
    <span class="hero-emoji">${p.emoji}</span>
  `;
  // Badges
  document.getElementById('hero-platform').textContent = p.platform;
  document.getElementById('hero-category').textContent = p.category;
  // Title
  document.getElementById('hero-title').textContent = p.name;
  document.title = `${p.shortName} – DealHunt`;
  // Prices
  document.getElementById('hero-prices').innerHTML = `
    ${p.discount > 0 ? `<span class="hero-original">${fmt(p.originalPrice)}</span>` : ''}
    <span class="hero-deal">${fmt(p.price)}</span>
    ${p.discount > 0 ? `<span class="hero-discount">-${p.discount}%</span>` : ''}
  `;
  // Rating
  document.getElementById('hero-rating').innerHTML = `
    <span class="stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}</span>
    &nbsp;${p.rating} &nbsp;·&nbsp; ${p.reviews.toLocaleString('en-IN')} reviews
  `;
  // Specs
  document.getElementById('hero-specs').innerHTML = p.specs
    .map(s => `<span class="spec-badge">${s}</span>`).join('');
  // Buy now
  document.getElementById('buy-now-btn').href = p.link;
}

// ── Render score ──────────────────────────────────
function renderScore(p) {
  const sl = scoreLabel(p.dealScore);
  const numEl = document.getElementById('gauge-number');
  animateCounter(numEl, p.dealScore);
  animateGauge(p.dealScore);

  const verdict = document.getElementById('gauge-verdict');
  verdict.textContent = sl.label;
  verdict.className = `gauge-verdict ${sl.cls}`;

  // Breakdown bars (derived from score)
  const historyPct  = Math.min(100, Math.round((p.dealScore / 100) * 90 + Math.random() * 10));
  const marketPct   = Math.min(100, Math.round((1 - (p.price / p.originalPrice)) * 100));
  const ratingPct   = Math.round((p.rating / 5) * 100);
  const discountPct = Math.min(100, p.discount > 0 ? p.discount : 5);

  const bars = [
    ['sb-history',  historyPct],
    ['sb-market',   marketPct],
    ['sb-rating',   ratingPct],
    ['sb-discount', discountPct],
  ];
  bars.forEach(([id, pct]) => {
    setTimeout(() => {
      document.getElementById(id).style.width = pct + '%';
      document.getElementById(id + '-pct').textContent = pct + '%';
    }, 400);
  });
}

// ── Platform comparison ───────────────────────────
function renderPlatforms(p) {
  const wrap = document.getElementById('platform-compare');
  wrap.innerHTML = p.platforms.map(pl => `
    <div class="platform-card ${pl.best ? 'best' : ''}">
      <div class="platform-name">${pl.name}</div>
      <div class="platform-price">${fmt(pl.price)}</div>
      ${pl.best ? '<div class="platform-best-tag">✓ Best Price</div>' : ''}
    </div>
  `).join('');
}

// ── Price history chart ───────────────────────────
function renderPriceChart(p) {
  const maxPrice = Math.max(...p.priceHistory);
  const minPrice = Math.min(...p.priceHistory);
  const chart    = document.getElementById('price-chart');
  const labels   = document.getElementById('price-chart-labels');

  chart.innerHTML = p.priceHistory.map((price, i) => {
    const heightPct = ((price - minPrice) / (maxPrice - minPrice || 1)) * 80 + 15;
    const isLowest  = price === minPrice;
    return `
      <div class="price-bar-group">
        <div class="price-bar ${isLowest ? 'lowest' : ''}"
          style="height:0%;"
          data-height="${heightPct}"
          title="${fmt(price)}">
          <div class="price-bar-tooltip">${fmt(price)}</div>
        </div>
      </div>
    `;
  }).join('');

  labels.innerHTML = p.priceLabels.map(l =>
    `<div class="price-chart-label">${l}</div>`
  ).join('');

  // Animate bars in
  setTimeout(() => {
    chart.querySelectorAll('.price-bar').forEach(bar => {
      bar.style.transition = 'height 0.8s cubic-bezier(0.4,0,0.2,1)';
      bar.style.height = bar.dataset.height + '%';
    });
  }, 300);
}

// ── Description & AI ─────────────────────────────
function renderDetails(p) {
  document.getElementById('product-desc').textContent = p.description;
  document.getElementById('ai-text').textContent = p.aiSummary;
}

// ── Sticky CTA ────────────────────────────────────
function renderStickyCTA(p) {
  document.getElementById('sticky-price').innerHTML = `Best price: <strong>${fmt(p.price)}</strong> on ${p.platform}`;
  document.getElementById('sticky-buy-btn').href = p.link;
}

// ── Init ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const p = getProduct();
  if (!p) { document.getElementById('deal-main').innerHTML = '<p style="padding:2rem;color:var(--text-muted)">Product not found.</p>'; return; }
  renderHero(p);
  renderScore(p);
  renderPlatforms(p);
  renderPriceChart(p);
  renderDetails(p);
  renderStickyCTA(p);
});
