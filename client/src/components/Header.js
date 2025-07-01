import React, { useState, useRef } from 'react';
import { useTheme } from '../ThemeContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const styles = {
  header: {
    width: '100%',
    minHeight: 64,
    background: '#fff',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    boxSizing: 'border-box',
    boxShadow: '0 4px 16px 0 rgba(60,60,120,0.10)', // more depth
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 20,
    flexWrap: 'wrap',
    gap: 8,
    backdropFilter: 'blur(2px)',
    transition: 'box-shadow 0.3s',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    minWidth: 0,
    flexShrink: 0,
    fontWeight: 900,
    fontSize: 22,
    letterSpacing: 1,
    textDecoration: 'none',
    color: '#222',
  },
  logoImg: {
    width: 38,
    height: 38,
    borderRadius: 8,
    objectFit: 'cover',
    boxShadow: '0 1px 4px 0 rgba(60,60,120,0.10)',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginLeft: 16,
    flexWrap: 'wrap',
    flex: 1,
    minWidth: 0,
    overflowX: 'auto',
  },
  navLink: (isActive, isHovered) => ({
    color: isActive ? '#6366f1' : isHovered ? '#374151' : '#222',
    fontWeight: isActive ? 700 : 500,
    fontSize: 16,
    textDecoration: 'none',
    padding: '6px 10px',
    borderRadius: 8,
    background: isActive ? 'rgba(99,102,241,0.12)' : isHovered ? 'rgba(99,102,241,0.06)' : 'none',
    transition: 'background 0.2s, color 0.2s',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    boxShadow: isActive ? '0 2px 8px 0 rgba(99,102,241,0.08)' : 'none',
    outline: isActive ? '2px solid #6366f1' : 'none',
  }),
  themeToggle: {
    background: 'none',
    border: 'none',
    color: '#3B82F6',
    fontSize: 22,
    cursor: 'pointer',
    marginLeft: 10,
    transition: 'color 0.3s',
    flexShrink: 0,
    borderRadius: 8,
    padding: 6,
    outline: 'none',
  },
  profileBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginLeft: 18,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    position: 'relative',
    padding: 0,
    borderRadius: 18,
    outline: 'none',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    objectFit: 'cover',
    background: '#e0e7ef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 18,
    color: '#6366f1',
    boxShadow: '0 1px 4px 0 rgba(60,60,120,0.08)',
    transition: 'box-shadow 0.2s',
  },
  dropdown: {
    position: 'absolute',
    top: 48,
    right: 0,
    background: '#fff',
    borderRadius: 10,
    boxShadow: '0 8px 32px 0 rgba(60,60,120,0.16)',
    minWidth: 160,
    zIndex: 100,
    padding: '8px 0',
    display: 'flex',
    flexDirection: 'column',
    animation: 'fadeSlideDown 0.25s',
    border: '1px solid #e5e7eb',
  },
  dropdownItem: isHovered => ({
    padding: '12px 22px',
    color: isHovered ? '#6366f1' : '#222',
    fontWeight: 500,
    fontSize: 15,
    textAlign: 'left',
    background: isHovered ? 'rgba(99,102,241,0.08)' : 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    width: '100%',
    textDecoration: 'none',
    outline: 'none',
    borderRadius: 0,
  }),
};

const navIcons = {
  Home: '🏠',
  Chat: '💬',
  Pricing: '💳',
};

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navHover, setNavHover] = useState('');
  const [dropdownHover, setDropdownHover] = useState('');
  const dropdownRef = useRef();
  const [userName, setUserName] = useState(localStorage.getItem('userName') || localStorage.getItem('userEmail') || '');
  const [userAvatar, setUserAvatar] = useState(localStorage.getItem('userAvatar'));
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // Keyboard accessibility for dropdown
  React.useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setDropdownOpen(false);
    }
    if (dropdownOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [dropdownOpen]);

  // Listen for live user/profile updates
  React.useEffect(() => {
    function updateUser() {
      setUserName(localStorage.getItem('userName') || localStorage.getItem('userEmail') || '');
      setUserAvatar(localStorage.getItem('userAvatar'));
    }
    window.addEventListener('user-updated', updateUser);
    return () => window.removeEventListener('user-updated', updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>
        <img src="/logo.jpg" alt="Logo" style={styles.logoImg} />
        <span style={{display:'none'}}>Homework Helper</span>
      </Link>
      <nav style={styles.nav}>
        <Link to="/" style={styles.navLink(location.pathname === '/', navHover==='home')}
          onMouseEnter={()=>setNavHover('home')} onMouseLeave={()=>setNavHover('')}>{navIcons.Home} Home</Link>
        <Link to="/chat" style={styles.navLink(location.pathname === '/chat', navHover==='chat')}
          onMouseEnter={()=>setNavHover('chat')} onMouseLeave={()=>setNavHover('')}>{navIcons.Chat} Chat</Link>
        <Link to="/pricing" style={styles.navLink(location.pathname === '/pricing', navHover==='pricing')}
          onMouseEnter={()=>setNavHover('pricing')} onMouseLeave={()=>setNavHover('')}>{navIcons.Pricing} Pricing</Link>
      </nav>
      <button style={styles.themeToggle} onClick={toggleTheme} title="Toggle dark/light mode" tabIndex={0}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>
      <div style={{marginLeft:8, position:'relative'}} ref={dropdownRef}>
        <button style={styles.profileBtn} onClick={() => setDropdownOpen(o => !o)} aria-label="Profile menu" tabIndex={0}>
          {userAvatar ? (
            <img src={userAvatar} alt="Avatar" style={styles.avatar} />
          ) : (
            <span style={styles.avatar}>{userName[0]?.toUpperCase() || <span role="img" aria-label="user">👤</span>}</span>
          )}
          <span style={{fontWeight:700, color:'#6366f1', fontSize:16, marginLeft:6, maxWidth:120, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{userName}</span>
        </button>
        {dropdownOpen && (
          <div style={styles.dropdown}>
            {isLoggedIn ? (
              <>
                <Link to="/profile" style={styles.dropdownItem(dropdownHover==='profile')}
                  onMouseEnter={()=>setDropdownHover('profile')} onMouseLeave={()=>setDropdownHover('')}>Profile</Link>
                <Link to="/settings" style={styles.dropdownItem(dropdownHover==='settings')}
                  onMouseEnter={()=>setDropdownHover('settings')} onMouseLeave={()=>setDropdownHover('')}>Settings</Link>
                <button style={styles.dropdownItem(dropdownHover==='logout')} onMouseEnter={()=>setDropdownHover('logout')} onMouseLeave={()=>setDropdownHover('')} onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={styles.dropdownItem(dropdownHover==='login')}
                  onMouseEnter={()=>setDropdownHover('login')} onMouseLeave={()=>setDropdownHover('')}>Login</Link>
                <Link to="/register" style={styles.dropdownItem(dropdownHover==='register')}
                  onMouseEnter={()=>setDropdownHover('register')} onMouseLeave={()=>setDropdownHover('')}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes fadeSlideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </header>
  );
}
