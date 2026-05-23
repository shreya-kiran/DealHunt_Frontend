import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const ORDER_HISTORY = [
  { icon: '🎧', title: 'Sony WH-1000XM5 Wireless Headphones', meta: 'Ordered Oct 12, 2025 · ₹24,990 · Amazon',    status: 'Delivered',   cls: '' },
  { icon: '💻', title: 'Apple MacBook Air M2 13"',             meta: 'Ordered Sep 05, 2025 · ₹95,000 · Flipkart', status: 'Delivered',   cls: '' },
  { icon: '⌚', title: 'Noise ColorFit Pulse Smartwatch',      meta: 'Ordered Apr 18, 2026 · ₹1,799 · Myntra',    status: 'In Transit',  cls: 'pending' },
  { icon: '📚', title: 'Atomic Habits — James Clear',          meta: 'Ordered Mar 02, 2026 · ₹399 · Amazon',      status: 'Delivered',   cls: '' },
];

export default function ProfilePage() {
  const [sidebarCollapsed, setSidebar] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: 'Shreyak Kiran',
    email: 'shreyak@example.com',
    phone: '+91 98765 43210',
    dob: '2000-01-01',
  });

  function handlePersonalChange(key, value) {
    setPersonalInfo(prev => ({ ...prev, [key]: value }));
  }

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
        <main className="main-content">
          <div className="profile-wrap">
            {/* Hero */}
            <div className="profile-hero">
              <div className="profile-hero-avatar">SK</div>
              <div className="profile-hero-info">
                <h1>{personalInfo.name}</h1>
                <p>{personalInfo.email} · Member since May 2026</p>
              </div>
            </div>

            {/* Personal Information */}
            <section className="profile-card">
              <h2 className="profile-card-title">Personal Information</h2>
              <div className="profile-field-row">
                <ProfileField label="Full Name" id="pf-name" type="text" value={personalInfo.name} onChange={v => handlePersonalChange('name', v)} />
                <ProfileField label="Email Address" id="pf-email" type="email" value={personalInfo.email} onChange={v => handlePersonalChange('email', v)} />
                <ProfileField label="Phone Number" id="pf-phone" type="tel" value={personalInfo.phone} onChange={v => handlePersonalChange('phone', v)} />
                <ProfileField label="Date of Birth" id="pf-dob" type="date" value={personalInfo.dob} onChange={v => handlePersonalChange('dob', v)} />
              </div>
              <div className="profile-actions">
                <button type="button" className="btn-cancel">Cancel</button>
                <button type="button" className="btn-save">Save Changes</button>
              </div>
            </section>

            {/* Security */}
            <section className="profile-card">
              <h2 className="profile-card-title">Security</h2>
              <div className="profile-field-row">
                <div className="profile-field">
                  <label htmlFor="pf-current-pass">Current Password</label>
                  <input id="pf-current-pass" type="password" placeholder="••••••••" />
                </div>
                <div className="profile-field">
                  <label htmlFor="pf-new-pass">New Password</label>
                  <input id="pf-new-pass" type="password" placeholder="At least 8 characters" />
                </div>
              </div>
              <div className="profile-actions">
                <button type="button" className="btn-save">Update Password</button>
              </div>
            </section>

            {/* Order History */}
            <section className="profile-card" id="history">
              <h2 className="profile-card-title">Order History</h2>
              <div className="history-list">
                {ORDER_HISTORY.map((order, i) => (
                  <div key={i} className="history-item">
                    <div className="history-icon">{order.icon}</div>
                    <div className="history-body">
                      <div className="history-title">{order.title}</div>
                      <div className="history-meta">{order.meta}</div>
                    </div>
                    <span className={`history-status${order.cls ? ' ' + order.cls : ''}`}>{order.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

function ProfileField({ label, id, type, value, onChange }) {
  return (
    <div className="profile-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
