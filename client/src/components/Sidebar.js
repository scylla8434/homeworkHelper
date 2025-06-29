import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const sidebarLinks = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/chat', label: 'Chat', icon: '💬' },
  { to: '/pricing', label: 'Subscription', icon: '💳' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

const styles = {
  sidebar: (open) => ({
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    width: open ? 220 : 0,
    background: '#3B82F6',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: open ? '36px 0' : '0',
    gap: 24,
    zIndex: 30,
    boxShadow: open ? '2px 0 8px 0 rgba(60,60,120,0.10)' : 'none',
    transition: 'width 0.3s, padding 0.3s',
    overflow: 'hidden',
  }),
  hamburger: {
    position: 'absolute',
    top: 18,
    left: 18,
    background: 'none',
    border: 'none',
    color: '#3B82F6',
    fontSize: 28,
    cursor: 'pointer',
    zIndex: 40,
    display: 'block',
  },
  link: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    color: active ? '#F9FAFB' : '#e0e7ef',
    fontWeight: active ? 800 : 600,
    fontSize: 18,
    textDecoration: 'none',
    background: active ? '#2563eb' : 'none',
    border: 'none',
    padding: '12px 24px',
    width: '100%',
    borderRadius: '0.75rem',
    margin: '4px 0',
    transition: 'background 0.2s',
  }),
  logout: {
    marginTop: 'auto',
    color: '#fff',
    background: 'none',
    border: 'none',
    fontWeight: 700,
    fontSize: 17,
    cursor: 'pointer',
    padding: '10px 0',
    borderRadius: '0.75rem',
    width: '100%',
    textAlign: 'center',
  },
};

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const userName = localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  return (
    <nav style={styles.sidebar(open)}>
      <button style={styles.hamburger} onClick={() => setOpen(o => !o)} title={open ? 'Close menu' : 'Open menu'}>
        {open ? '✖' : '☰'}
      </button>
      {open && <>
        <div style={{fontWeight:800, fontSize:22, marginBottom:18}}>📚</div>
        <div style={{fontWeight:700, fontSize:18, marginBottom:18}}>{userName}</div>
        {sidebarLinks.map(link => (
          <Link key={link.to} to={link.to} style={styles.link(location.pathname === link.to)}>
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
        <button style={styles.logout} onClick={handleLogout}>Logout</button>
      </>}
    </nav>
  );
}
