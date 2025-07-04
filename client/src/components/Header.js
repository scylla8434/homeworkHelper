import React, { useState, useRef } from 'react';
import { useTheme } from '../ThemeContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { 
  Home, 
  MessageCircle, 
  CreditCard, 
  Sun, 
  Moon, 
  User, 
  Settings, 
  LogOut,
  ChevronDown,
  UserPlus,
  LogIn
} from 'lucide-react';

const styles = {
  header: {
    width: '100%',
    minHeight: 72,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    color: '#111827',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    boxSizing: 'border-box',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    borderBottom: '1px solid rgba(229, 231, 235, 0.8)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    transition: 'all 0.2s ease-in-out',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 32,
    flex: 1,
    minWidth: 0,
  },
  
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    textDecoration: 'none',
    color: '#111827',
    flexShrink: 0,
    transition: 'transform 0.2s ease-in-out',
  },
  
  logoHover: {
    transform: 'scale(1.02)',
  },
  
  logoImg: {
    width: 42,
    height: 42,
    borderRadius: 10,
    objectFit: 'cover',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '2px solid rgba(255, 255, 255, 0.8)',
  },
  
  logoText: {
    fontWeight: 700,
    fontSize: 20,
    letterSpacing: '-0.025em',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  
  navLink: (isActive, isHovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    borderRadius: 8,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    color: isActive ? '#4f46e5' : isHovered ? '#374151' : '#6b7280',
    background: isActive ? 'rgba(79, 70, 229, 0.1)' : isHovered ? 'rgba(107, 114, 128, 0.05)' : 'transparent',
    border: isActive ? '1px solid rgba(79, 70, 229, 0.2)' : '1px solid transparent',
    transition: 'all 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    position: 'relative',
    overflow: 'hidden',
  }),
  
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexShrink: 0,
  },
  
  themeToggle: (isHovered) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: isHovered ? '#f9fafb' : '#ffffff',
    color: '#6b7280',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    boxShadow: isHovered ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
  }),
  
  profileSection: {
    position: 'relative',
  },
  
  profileButton: (isHovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 12px',
    borderRadius: 12,
    border: 'none',
    background: isHovered ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
  }),
  
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    objectFit: 'cover',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: 14,
    color: '#ffffff',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.9)',
  },
  
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    maxWidth: 120,
  },
  
  userName: {
    fontWeight: 600,
    fontSize: 14,
    color: '#374151',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 80,
  },
  
  chevron: (isOpen) => ({
    color: '#9ca3af',
    transition: 'transform 0.2s ease-in-out',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  }),
  
  dropdown: {
    position: 'absolute',
    top: 56,
    right: 0,
    minWidth: 200,
    background: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    zIndex: 100,
    overflow: 'hidden',
    animation: 'fadeSlideDown 0.2s ease-out',
  },
  
  dropdownSection: {
    padding: '8px 0',
    borderBottom: '1px solid #f3f4f6',
  },
  
  dropdownItem: (isHovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    background: isHovered ? '#f9fafb' : 'transparent',
    color: '#374151',
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
    textAlign: 'left',
  }),
  
  dropdownItemDanger: (isHovered) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    background: isHovered ? '#fef2f2' : 'transparent',
    color: isHovered ? '#dc2626' : '#6b7280',
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
    textAlign: 'left',
  }),
};

function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Fixed this line - removed require()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navHover, setNavHover] = useState('');
  const [dropdownHover, setDropdownHover] = useState('');
  const [themeHover, setThemeHover] = useState(false);
  const [profileHover, setProfileHover] = useState(false);
  const [logoHover, setLogoHover] = useState(false);
  const dropdownRef = useRef();
  const [userName, setUserName] = useState(user?.name || user?.email || '');
  const [userAvatar, setUserAvatar] = useState(user?.avatar);
  const isLoggedIn = !!user;

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

  // Listen for live user/profile updates from AuthContext
  React.useEffect(() => {
    setUserName(user?.name || user?.email || '');
    setUserAvatar(user?.avatar);
  }, [user]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/chat', label: 'Chat', icon: MessageCircle },
    { path: '/pricing', label: 'Pricing', icon: CreditCard },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.leftSection}>
        <Link 
          to="/" 
          style={{
            ...styles.logo,
            ...(logoHover ? styles.logoHover : {})
          }}
          onMouseEnter={() => setLogoHover(true)}
          onMouseLeave={() => setLogoHover(false)}
        >
          <img src="/logo.jpg" alt="EduEdge Logo" style={styles.logoImg} />
          <span style={styles.logoText}>EduEdge</span>
        </Link>
        
        <nav style={styles.nav}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isHovered = navHover === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={styles.navLink(isActive, isHovered)}
                onMouseEnter={() => setNavHover(item.path)}
                onMouseLeave={() => setNavHover('')}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div style={styles.rightSection}>
        <button
          style={styles.themeToggle(themeHover)}
          onClick={toggleTheme}
          onMouseEnter={() => setThemeHover(true)}
          onMouseLeave={() => setThemeHover(false)}
          title="Toggle theme"
          aria-label="Toggle between light and dark theme"
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        
        <div style={styles.profileSection} ref={dropdownRef}>
          <button
            style={styles.profileButton(profileHover)}
            onClick={() => setDropdownOpen(prev => !prev)}
            onMouseEnter={() => setProfileHover(true)}
            onMouseLeave={() => setProfileHover(false)}
            aria-label="Profile menu"
            aria-expanded={dropdownOpen}
          >
            {userAvatar ? (
              <img src={userAvatar} alt="Profile" style={styles.avatar} />
            ) : (
              <div style={styles.avatar}>
                {userName[0]?.toUpperCase() || <User size={16} />}
              </div>
            )}
            
            {isLoggedIn && (
              <div style={styles.userInfo}>
                <span style={styles.userName}>{userName}</span>
                <ChevronDown size={16} style={styles.chevron(dropdownOpen)} />
              </div>
            )}
            
            {!isLoggedIn && (
              <ChevronDown size={16} style={styles.chevron(dropdownOpen)} />
            )}
          </button>
          
          {dropdownOpen && (
            <div style={styles.dropdown}>
              {isLoggedIn ? (
                <>
                  <div style={styles.dropdownSection}>
                    <Link
                      to="/profile"
                      style={styles.dropdownItem(dropdownHover === 'profile')}
                      onMouseEnter={() => setDropdownHover('profile')}
                      onMouseLeave={() => setDropdownHover('')}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      style={styles.dropdownItem(dropdownHover === 'settings')}
                      onMouseEnter={() => setDropdownHover('settings')}
                      onMouseLeave={() => setDropdownHover('')}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                  </div>
                  <div style={styles.dropdownSection}>
                    <button
                      style={styles.dropdownItemDanger(dropdownHover === 'logout')}
                      onMouseEnter={() => setDropdownHover('logout')}
                      onMouseLeave={() => setDropdownHover('')}
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div style={styles.dropdownSection}>
                  <Link
                    to="/login"
                    style={styles.dropdownItem(dropdownHover === 'login')}
                    onMouseEnter={() => setDropdownHover('login')}
                    onMouseLeave={() => setDropdownHover('')}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <LogIn size={16} />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    style={styles.dropdownItem(dropdownHover === 'register')}
                    onMouseEnter={() => setDropdownHover('register')}
                    onMouseLeave={() => setDropdownHover('')}
                    onClick={() => setDropdownOpen(false)}
                  >
                    <UserPlus size={16} />
                    Register
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes fadeSlideDown {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @media (max-width: 768px) {
          header {
            padding: 0 16px !important;
          }
          
          nav {
            gap: 4px !important;
          }
          
          .logo-text {
            display: none;
          }
          
          .user-name {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}

// Make sure to export as default
export default Header;