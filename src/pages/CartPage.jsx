import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function CartPage() {
  const [sidebarCollapsed, setSidebar] = useState(false);

  return (
    <>
      <Navbar onToggleSidebar={() => setSidebar(s => !s)} />
      <div className="page-body">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebar(true)}
        />
        {sidebarCollapsed && (
          <div className="sidebar-hover-zone" onMouseEnter={() => setSidebar(false)} />
        )}
        <main className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
          <h2 style={{ opacity: 0.2, fontSize: '2.5rem', textAlign: 'center', maxWidth: 600, padding: '2rem', lineHeight: 1.4, color: 'var(--text-primary)' }}>
            Shubham ji has yet to decide what to put here
          </h2>
        </main>
      </div>
    </>
  );
}
