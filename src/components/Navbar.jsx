import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar({ search = '', onSearchChange, onToggleSidebar }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button className="nav-sidebar-toggle" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <Link to="/dashboard" className="nav-logo" aria-label="DealHunt home">
          <img src="/assets/images/light_mode.png" alt="DealHunt" className="nav-logo-img logo-mode-light" />
          <img src="/assets/images/dark_mode.png"  alt="DealHunt" className="nav-logo-img logo-mode-dark" />
        </Link>

        <div className="nav-search-wrap">
          <div className="nav-search-box">
            <svg className="nav-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="nav-search-input"
              placeholder="Search deals, products, categories…"
              autoComplete="off"
              value={search}
              onChange={e => onSearchChange?.(e.target.value)}
            />
            {search && (
              <button className="nav-search-clear" onClick={() => onSearchChange?.('')} aria-label="Clear">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="nav-actions">
          <button className="nav-icon-btn" aria-label="Toggle theme" onClick={toggle}>
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <button className="nav-icon-btn" aria-label="Notifications">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="notif-badge">3</span>
          </button>

          <div className="nav-avatar">SK</div>
        </div>
      </div>
    </header>
  );
}
