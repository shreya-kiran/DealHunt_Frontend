/* DealHunt – Dashboard JS v2 */
'use strict';

// ── State ──────────────────────────────────────────
const state = {
  search:    '',
  category:  'all',
  subFilter: '',
  price:     '',
  discount:  0,
  sort:      'best',
  sidebarCollapsed: false,
};

// ── Sub-filter definitions ──────────────────────────
const SUB_FILTERS = {
  fashion:     { label: 'Size',   values: ['XS','S','M','L','XL','XXL'] },
  beauty:      { label: 'Type',   values: ['Serum','Moisturiser','Sunscreen','Cleanser'] },
  electronics: { label: 'Brand',  values: ['Apple','Samsung','Sony','realme','OnePlus'] },
  jewelry:     { label: 'Metal',  values: ['Gold','Silver','Rose Gold','Platinum'] },
  toys:        { label: 'Age',    values: ['3–5 yrs','6–8 yrs','9–12 yrs','12+ yrs'] },
};

// ── Score label helper ──────────────────────────────
function scoreLabel(score) {
  if (score >= 80) return { label: 'Excellent', cls: 'excellent' };
  if (score >= 65) return { label: 'Good Deal', cls: 'good' };
  if (score >= 45) return { label: 'Fair',      cls: 'fair' };
  return { label: 'Avoid',    cls: 'avoid' };
}

// ── Format price ────────────────────────────────────
function fmt(n) {
  return '₹' + n.toLocaleString('en-IN');
}

// ── Render cards ────────────────────────────────────
function renderCards(products) {
  const grid  = document.getElementById('deals-grid');
  const empty = document.getElementById('empty-state');
  const count = document.getElementById('results-count');

  grid.innerHTML = '';

  if (!products.length) {
    empty.style.display = 'block';
    count.textContent = 'No deals found';
    return;
  }
  empty.style.display = 'none';
  count.textContent = `Showing ${products.length} deal${products.length !== 1 ? 's' : ''}`;

  products.forEach((p, i) => {
    const sl    = scoreLabel(p.dealScore);
    const delay = (i * 0.05).toFixed(2);

    const card = document.createElement('a');
    card.className = 'deal-card';
    card.href = `deal.html?id=${p.id}`;
    card.style.animationDelay = `${delay}s`;

    card.innerHTML = `
      <div class="card-image-wrap">
        <div class="card-image-bg" style="background:${p.gradient};"></div>
        <div class="card-image-bg" style="background:${p.gradient}; opacity:0.12;"></div>
        <span class="card-emoji">${p.emoji}</span>
        <span class="platform-badge">${p.platform}</span>
        ${p.discount > 0
          ? `<span class="discount-badge">-${p.discount}%</span>`
          : `<span class="discount-badge no-discount">New</span>`}
        <div class="deal-score-mini">
          <span class="score-dot ${sl.cls}"></span>
          <span>${p.dealScore}/100</span>
        </div>
      </div>
      <div class="card-body">
        <div class="card-title">${p.name}</div>
        <div class="card-desc">${p.description}</div>
        <div class="card-prices">
          ${p.discount > 0 ? `<span class="original-price">${fmt(p.originalPrice)}</span>` : ''}
          <span class="deal-price">${fmt(p.price)}</span>
        </div>
        <div class="card-rating">
          <span class="stars">${'★'.repeat(Math.round(p.rating))}${'☆'.repeat(5 - Math.round(p.rating))}</span>
          ${p.rating} (${p.reviews.toLocaleString('en-IN')})
        </div>
        <a class="card-cta" href="deal.html?id=${p.id}">
          View Deal
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ── Filter + Sort pipeline ──────────────────────────
function applyFilters() {
  let list = [...(window.PRODUCTS || [])];

  // Search
  if (state.search) {
    const q = state.search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.platform.toLowerCase().includes(q)
    );
  }
  // Category
  if (state.category !== 'all') {
    list = list.filter(p => p.category === state.category);
  }
  // Price
  if (state.price) {
    const [min, max] = state.price.split('-').map(Number);
    list = list.filter(p => p.price >= min && p.price <= max);
  }
  // Discount
  if (state.discount > 0) {
    list = list.filter(p => p.discount >= state.discount);
  }

  // Sort
  list.sort((a, b) => {
    switch (state.sort) {
      case 'score':    return b.dealScore - a.dealScore;
      case 'discount': return b.discount - a.discount;
      case 'price-asc':  return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      default: return b.dealScore - a.dealScore;
    }
  });

  renderCards(list);
  updateActiveTags();
}

// ── Active filter tags ──────────────────────────────
function updateActiveTags() {
  const wrap = document.getElementById('active-filters');
  const tags = document.getElementById('af-tags');
  tags.innerHTML = '';
  const active = [];
  if (state.category !== 'all') active.push({ key: 'category', label: state.category });
  if (state.price) active.push({ key: 'price', label: 'Price: ' + state.price.replace('-', '–') });
  if (state.discount > 0) active.push({ key: 'discount', label: `≥${state.discount}% off` });
  if (state.search) active.push({ key: 'search', label: `"${state.search}"` });
  wrap.style.display = active.length ? 'flex' : 'none';
  active.forEach(f => {
    const tag = document.createElement('span');
    tag.className = 'af-tag';
    tag.innerHTML = `${f.label}<span class="af-tag-remove" data-key="${f.key}">✕</span>`;
    tag.querySelector('.af-tag-remove').addEventListener('click', () => {
      if (f.key === 'category') { state.category = 'all'; updateCategoryPills('all'); }
      if (f.key === 'price')    { state.price = ''; document.querySelectorAll('.filter-price-radio').forEach(r => r.checked = false); }
      if (f.key === 'discount') { state.discount = 0; document.querySelectorAll('.filter-discount').forEach(r => r.checked = false); }
      if (f.key === 'search')   { state.search = ''; document.getElementById('global-search').value = ''; }
      applyFilters();
    });
    tags.appendChild(tag);
  });
}

function updateCategoryPills(val) {
  document.querySelectorAll('#filter-category .pill').forEach(p => {
    p.classList.toggle('active', p.dataset.value === val);
  });
}

// ── Sub-filters ─────────────────────────────────────
function updateSubFilters(cat) {
  const grp   = document.getElementById('sub-filter-group');
  const label = document.getElementById('sub-filter-label');
  const pills = document.getElementById('filter-sub');
  const def   = SUB_FILTERS[cat];
  if (!def) { grp.style.display = 'none'; return; }
  grp.style.display = 'block';
  label.textContent = def.label;
  pills.innerHTML = def.values.map(v =>
    `<button class="pill" data-value="${v}">${v}</button>`
  ).join('');
  pills.querySelectorAll('.pill').forEach(p => {
    p.addEventListener('click', () => {
      pills.querySelectorAll('.pill').forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      state.subFilter = p.dataset.value;
      applyFilters();
    });
  });
}

// ── Sidebar collapse (Notion-style) ────────────────
function initSidebar() {
  const sidebar   = document.getElementById('sidebar');
  const collapseBtn = document.getElementById('sidebar-collapse');
  const toggleBtn   = document.getElementById('sidebar-toggle');
  const hoverZone   = document.getElementById('sidebar-hover-zone');
  const isMobile    = () => window.innerWidth < 768;

  // Restore state
  const saved = sessionStorage.getItem('dh-sidebar');
  if (saved === 'collapsed' && !isMobile()) {
    sidebar.classList.add('collapsed');
    state.sidebarCollapsed = true;
  }

  function collapse() {
    sidebar.classList.add('collapsed');
    sidebar.classList.remove('peeking', 'mobile-open');
    state.sidebarCollapsed = true;
    sessionStorage.setItem('dh-sidebar', 'collapsed');
  }
  function expand() {
    sidebar.classList.remove('collapsed', 'peeking', 'mobile-open');
    state.sidebarCollapsed = false;
    sessionStorage.setItem('dh-sidebar', 'open');
  }

  collapseBtn.addEventListener('click', collapse);

  toggleBtn.addEventListener('click', () => {
    if (isMobile()) {
      sidebar.classList.toggle('mobile-open');
    } else {
      state.sidebarCollapsed ? expand() : collapse();
    }
  });

  // Hover zone — peek behaviour
  let peekTimeout;
  hoverZone.addEventListener('mouseenter', () => {
    if (!state.sidebarCollapsed) return;
    peekTimeout = setTimeout(() => sidebar.classList.add('peeking'), 100);
  });
  hoverZone.addEventListener('mouseleave', () => {
    clearTimeout(peekTimeout);
    setTimeout(() => sidebar.classList.remove('peeking'), 300);
  });
  sidebar.addEventListener('mouseleave', (e) => {
    if (sidebar.classList.contains('peeking') && e.clientX < 16) return;
    if (sidebar.classList.contains('peeking')) {
      setTimeout(() => sidebar.classList.remove('peeking'), 300);
    }
  });
}

// ── Accordion filters ────────────────────────────────
function initAccordions() {
  document.querySelectorAll('.filter-group-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      const body = document.getElementById(btn.dataset.target);
      if (body) body.classList.toggle('collapsed', expanded);
    });
  });
}

// ── Wire up all controls ────────────────────────────
function initControls() {
  // Category pills
  document.querySelectorAll('#filter-category .pill').forEach(p => {
    p.addEventListener('click', () => {
      document.querySelectorAll('#filter-category .pill').forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      state.category = p.dataset.value;
      updateSubFilters(state.category);
      applyFilters();
    });
  });

  // Price radios
  document.querySelectorAll('.filter-price-radio').forEach(r => {
    r.addEventListener('change', () => { state.price = r.value; applyFilters(); });
  });

  // Discount radios
  document.querySelectorAll('.filter-discount').forEach(r => {
    r.addEventListener('change', () => { state.discount = parseInt(r.value); applyFilters(); });
  });

  // Reset
  document.getElementById('btn-reset-filters').addEventListener('click', resetFilters);
  const emptyReset = document.getElementById('btn-empty-reset');
  if (emptyReset) emptyReset.addEventListener('click', resetFilters);
  const afClear = document.getElementById('af-clear-all');
  if (afClear) afClear.addEventListener('click', resetFilters);

  // Sort
  document.getElementById('sort-select').addEventListener('change', e => {
    state.sort = e.target.value;
    applyFilters();
  });

  // Search
  const searchInput = document.getElementById('global-search');
  const clearBtn    = document.getElementById('search-clear');
  let searchDebounce;
  searchInput.addEventListener('input', e => {
    state.search = e.target.value.trim();
    clearBtn.style.display = state.search ? 'flex' : 'none';
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(applyFilters, 250);
  });
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.search = '';
    clearBtn.style.display = 'none';
    applyFilters();
  });
}

function resetFilters() {
  state.category = 'all';
  state.price = '';
  state.discount = 0;
  state.search = '';
  state.subFilter = '';
  document.getElementById('global-search').value = '';
  document.getElementById('search-clear').style.display = 'none';
  document.querySelectorAll('#filter-category .pill').forEach((p, i) => p.classList.toggle('active', i === 0));
  document.querySelectorAll('.filter-price-radio, .filter-discount').forEach(r => r.checked = false);
  document.getElementById('sub-filter-group').style.display = 'none';
  applyFilters();
}

// ── Init ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initAccordions();
  initControls();
  applyFilters();
});
