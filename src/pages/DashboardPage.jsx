import { useState, useMemo, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DealCard from '../components/DealCard';
import { PRODUCTS } from '../data/products';

const INITIAL_STATE = {
  search: '', category: 'all', subFilter: '', price: '', discount: 0, sort: 'best',
};

export default function DashboardPage() {
  const [filters, setFilters]           = useState(INITIAL_STATE);
  const [sidebarCollapsed, setSidebar]  = useState(false);
  const sidebarHoverRef                 = useRef(null);

  // Restore sidebar state
  useEffect(() => {
    const saved = sessionStorage.getItem('dh-sidebar');
    if (saved === 'collapsed' && window.innerWidth >= 768) setSidebar(true);
  }, []);

  function setFilter(key, value) {
    setFilters(f => ({ ...f, [key]: value }));
  }

  function resetFilters() {
    setFilters(INITIAL_STATE);
  }

  function handleCollapse() {
    setSidebar(true);
    sessionStorage.setItem('dh-sidebar', 'collapsed');
  }

  function handleToggleSidebar() {
    if (window.innerWidth < 768) {
      // mobile: toggle mobile-open class — handled via state
      setSidebar(s => !s);
    } else {
      setSidebar(s => {
        const next = !s;
        sessionStorage.setItem('dh-sidebar', next ? 'collapsed' : 'open');
        return next;
      });
    }
  }

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.platform.toLowerCase().includes(q)
      );
    }
    if (filters.category !== 'all') {
      list = list.filter(p => p.category === filters.category);
    }
    if (filters.price) {
      const [min, max] = filters.price.split('-').map(Number);
      list = list.filter(p => p.price >= min && p.price <= max);
    }
    if (filters.discount > 0) {
      list = list.filter(p => p.discount >= filters.discount);
    }

    list.sort((a, b) => {
      switch (filters.sort) {
        case 'score':      return b.dealScore - a.dealScore;
        case 'discount':   return b.discount - a.discount;
        case 'price-asc':  return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        default:           return b.dealScore - a.dealScore;
      }
    });

    return list;
  }, [filters]);

  const activeTags = buildActiveTags(filters);

  return (
    <>
      <Navbar
        search={filters.search}
        onSearchChange={v => setFilter('search', v)}
        onToggleSidebar={handleToggleSidebar}
      />

      <div className="page-body">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={handleCollapse}
          category={filters.category}
          onCategoryChange={v => { setFilter('category', v); setFilter('subFilter', ''); }}
          subFilter={filters.subFilter}
          onSubFilterChange={v => setFilter('subFilter', v)}
          price={filters.price}
          onPriceChange={v => setFilter('price', v)}
          discount={filters.discount}
          onDiscountChange={v => setFilter('discount', v)}
          onReset={resetFilters}
        />

        {sidebarCollapsed && (
          <div
            className="sidebar-hover-zone"
            onMouseEnter={() => setSidebar(false)}
          />
        )}

        <main className="main-content">
          <div className="main-header">
            <div>
              <h1 className="main-title">Today's Deals</h1>
              <p className="results-count">
                {filteredProducts.length === 0
                  ? 'No deals found'
                  : `Showing ${filteredProducts.length} deal${filteredProducts.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            <div className="sort-wrap">
              <label htmlFor="sort-select" className="sort-label">Sort by</label>
              <select
                id="sort-select"
                className="sort-select"
                value={filters.sort}
                onChange={e => setFilter('sort', e.target.value)}
              >
                <option value="best">Best Match</option>
                <option value="score">Deal Score ↑</option>
                <option value="discount">Highest Discount</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>

          {activeTags.length > 0 && (
            <div className="active-filters">
              <span className="af-label">Active:</span>
              <div className="af-tags">
                {activeTags.map(tag => (
                  <span key={tag.key} className="af-tag">
                    {tag.label}
                    <span className="af-tag-remove" onClick={() => removeTag(tag.key, setFilter)}>✕</span>
                  </span>
                ))}
              </div>
              <button className="af-clear" onClick={resetFilters}>Clear all</button>
            </div>
          )}

          {filteredProducts.length > 0 ? (
            <div className="deals-grid">
              {filteredProducts.map((p, i) => (
                <DealCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h2>No deals found</h2>
              <p>Try adjusting your filters or search term.</p>
              <button className="btn-reset" onClick={resetFilters}>Reset Filters</button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function buildActiveTags(filters) {
  const tags = [];
  if (filters.category !== 'all') tags.push({ key: 'category', label: filters.category });
  if (filters.price)              tags.push({ key: 'price',    label: 'Price: ' + filters.price.replace('-', '–') });
  if (filters.discount > 0)      tags.push({ key: 'discount', label: `≥${filters.discount}% off` });
  if (filters.search)            tags.push({ key: 'search',   label: `"${filters.search}"` });
  return tags;
}

function removeTag(key, setFilter) {
  if (key === 'category') setFilter('category', 'all');
  if (key === 'price')    setFilter('price', '');
  if (key === 'discount') setFilter('discount', 0);
  if (key === 'search')   setFilter('search', '');
}
