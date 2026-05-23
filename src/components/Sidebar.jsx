import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SUB_FILTERS } from '../data/products';

const NAV_ITEMS = [
  {
    to: '/dashboard', id: 'dashboard', label: 'Dashboard',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    to: '/cart', id: 'cart', label: 'Cart',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  },
  {
    to: '#', id: 'waitlist', label: 'Waitlist / Orders', badge: '2',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  },
  {
    to: '#', id: 'offers', label: 'Offers & Deals', badge: '5', badgeHot: true,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>,
  },
  {
    to: '#', id: 'history', label: 'History',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
  {
    to: '/profile', id: 'profile', label: 'Profile',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
];

const PRICE_RANGES = [
  { value: '0-500',         label: 'Under ₹500' },
  { value: '500-2000',      label: '₹500 – ₹2,000' },
  { value: '2000-10000',    label: '₹2,000 – ₹10,000' },
  { value: '10000-999999',  label: 'Above ₹10,000' },
];

const DISCOUNT_OPTIONS = [
  { value: 0,  label: 'Any Discount' },
  { value: 20, label: '20% & above' },
  { value: 40, label: '40% & above' },
  { value: 60, label: '60% & above' },
];

const CATEGORIES = ['all', 'electronics', 'fashion', 'beauty', 'toys', 'jewelry'];

export default function Sidebar({
  collapsed,
  onCollapse,
  category = 'all',
  onCategoryChange,
  subFilter = '',
  onSubFilterChange,
  price = '',
  onPriceChange,
  discount = 0,
  onDiscountChange,
  onReset,
}) {
  const location = useLocation();
  const [priceOpen, setPriceOpen] = useState(true);
  const [discountOpen, setDiscountOpen] = useState(false);

  const subDef = SUB_FILTERS[category];

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <button className="sidebar-collapse-btn" onClick={onCollapse} aria-label="Collapse sidebar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="sidebar-inner">
        {/* Navigation */}
        <nav className="sidebar-nav" aria-label="Main navigation">
          <p className="sidebar-section-label">Navigation</p>
          <ul className="nav-list">
            {NAV_ITEMS.map(item => {
              const isActive = item.to !== '#' && location.pathname === item.to;
              return (
                <li key={item.id}>
                  <Link to={item.to} className={`nav-item${isActive ? ' active' : ''}`}>
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`nav-badge${item.badgeHot ? ' hot' : ''}`}>{item.badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-divider" />

        {/* Filters */}
        <div className="sidebar-filters">
          <p className="sidebar-section-label">Filters</p>

          {/* Category */}
          <FilterGroup label="Category" defaultOpen>
            <div className="pill-group">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`pill${category === cat ? ' active' : ''}`}
                  onClick={() => { onCategoryChange?.(cat); onSubFilterChange?.(''); }}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </FilterGroup>

          {/* Dynamic sub-filters */}
          {subDef && (
            <FilterGroup label={subDef.label} defaultOpen>
              <div className="pill-group">
                {subDef.values.map(v => (
                  <button
                    key={v}
                    className={`pill${subFilter === v ? ' active' : ''}`}
                    onClick={() => onSubFilterChange?.(subFilter === v ? '' : v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </FilterGroup>
          )}

          {/* Price Range */}
          <FilterGroup label="Price Range" defaultOpen>
            <div className="price-range-list">
              {PRICE_RANGES.map(r => (
                <label className="check-item" key={r.value}>
                  <input
                    type="radio"
                    name="price"
                    value={r.value}
                    checked={price === r.value}
                    onChange={() => onPriceChange?.(r.value)}
                  />
                  <span className="checkmark" />
                  {r.label}
                </label>
              ))}
            </div>
          </FilterGroup>

          {/* Discount */}
          <FilterGroup label="Min. Discount">
            {DISCOUNT_OPTIONS.map(d => (
              <label className="check-item" key={d.value}>
                <input
                  type="radio"
                  name="discount"
                  value={d.value}
                  checked={discount === d.value}
                  onChange={() => onDiscountChange?.(d.value)}
                />
                <span className="checkmark" />
                {d.label}
              </label>
            ))}
          </FilterGroup>

          <div className="filter-actions">
            <button className="btn-reset" onClick={onReset}>Reset Filters</button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function FilterGroup({ label, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-group">
      <button
        className="filter-group-header"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span>{label}</span>
        <svg className={`chevron${open ? '' : ' collapsed'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className={`filter-group-body${open ? '' : ' collapsed'}`}>
        {children}
      </div>
    </div>
  );
}
