import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext';
import { 
  User, 
  Mail, 
  Lock, 
  Loader2, 
  AlertCircle,
  UserPlus,
  LogIn,
  Eye,
  EyeOff
} from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const getStyles = (theme) => ({
  pageContainer: {
    minHeight: '100vh',
    background: theme === 'dark' 
      ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    transition: 'all 0.3s ease-in-out',
  },

  container: {
    maxWidth: 440,
    width: '100%',
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    border: theme === 'dark' 
      ? '1px solid rgba(148, 163, 184, 0.2)' 
      : 'none',
    borderRadius: 20,
    boxShadow: theme === 'dark'
      ? '0 10px 40px rgba(0, 0, 0, 0.3)'
      : '0 10px 40px rgba(60, 60, 120, 0.15)',
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
  },

  header: {
    background: theme === 'dark'
      ? 'linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    padding: '32px 0',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
    objectFit: 'cover',
    margin: '0 auto 20px auto',
    display: 'block',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    border: '3px solid rgba(255, 255, 255, 0.2)',
  },

  headerTitle: {
    fontWeight: 800,
    fontSize: 28,
    letterSpacing: '-0.025em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: 8,
  },

  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    padding: '32px',
    position: 'relative',
    zIndex: 1,
  },

  inputGroup: {
    position: 'relative',
    width: '100%',
  },

  inputIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme === 'dark' ? '#64748b' : '#6b7280',
    zIndex: 2,
    transition: 'color 0.2s ease-in-out',
  },

  inputIconFocused: {
    color: theme === 'dark' ? '#6366f1' : '#4f46e5',
  },

  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    borderRadius: 12,
    border: theme === 'dark'
      ? '1px solid rgba(148, 163, 184, 0.3)'
      : '1px solid #d1d5db',
    fontSize: 16,
    outline: 'none',
    background: theme === 'dark' ? '#0f172a' : '#ffffff',
    color: theme === 'dark' ? '#f8fafc' : '#1f2937',
    transition: 'all 0.2s ease-in-out',
    boxSizing: 'border-box',
  },

  inputFocused: {
    borderColor: theme === 'dark' ? '#6366f1' : '#4f46e5',
    boxShadow: theme === 'dark'
      ? '0 0 0 3px rgba(99, 102, 241, 0.2)'
      : '0 0 0 3px rgba(79, 70, 229, 0.1)',
  },

  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: theme === 'dark' ? '#64748b' : '#6b7280',
    padding: 4,
    borderRadius: 4,
    transition: 'color 0.2s ease-in-out',
  },

  passwordToggleHover: {
    color: theme === 'dark' ? '#94a3b8' : '#4b5563',
  },

  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '14px 0',
    borderRadius: 12,
    border: 'none',
    background: theme === 'dark'
      ? 'linear-gradient(135deg, #6366f1 0%, #5b21b6 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    boxShadow: theme === 'dark'
      ? '0 4px 12px rgba(99, 102, 241, 0.3)'
      : '0 4px 12px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.2s ease-in-out',
    marginTop: 8,
    outline: 'none',
  },

  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: theme === 'dark'
      ? '0 6px 20px rgba(99, 102, 241, 0.4)'
      : '0 6px 20px rgba(102, 126, 234, 0.4)',
  },

  buttonLoading: {
    opacity: 0.7,
    pointerEvents: 'none',
    cursor: 'not-allowed',
  },

  error: {
    background: theme === 'dark' 
      ? 'rgba(239, 68, 68, 0.1)' 
      : '#fef2f2',
    border: theme === 'dark'
      ? '1px solid rgba(239, 68, 68, 0.3)'
      : '1px solid #fecaca',
    borderRadius: 12,
    padding: '12px 16px',
    margin: '0 32px 16px 32px',
    color: theme === 'dark' ? '#f87171' : '#dc2626',
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    animation: 'slideInDown 0.3s ease-out',
  },

  footer: {
    textAlign: 'center',
    padding: '24px 32px 32px 32px',
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    borderTop: theme === 'dark'
      ? '1px solid rgba(148, 163, 184, 0.1)'
      : '1px solid rgba(229, 231, 235, 0.5)',
  },

  footerText: {
    color: theme === 'dark' ? '#94a3b8' : '#6b7280',
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 12,
  },

  footerLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    color: theme === 'dark' ? '#6366f1' : '#4f46e5',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 14,
    padding: '8px 16px',
    borderRadius: 8,
    border: theme === 'dark'
      ? '1px solid rgba(99, 102, 241, 0.3)'
      : '1px solid rgba(79, 70, 229, 0.2)',
    background: theme === 'dark'
      ? 'rgba(99, 102, 241, 0.1)'
      : 'rgba(79, 70, 229, 0.05)',
    transition: 'all 0.2s ease-in-out',
  },

  footerLinkHover: {
    background: theme === 'dark'
      ? 'rgba(99, 102, 241, 0.2)'
      : 'rgba(79, 70, 229, 0.1)',
    transform: 'translateY(-1px)',
  },

  backgroundDecoration: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    zIndex: 0,
  },

  strengthIndicator: {
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    transition: 'all 0.3s ease-in-out',
  },

  strengthWeak: {
    background: '#ef4444',
    width: '33%',
  },

  strengthMedium: {
    background: '#f59e0b',
    width: '66%',
  },

  strengthStrong: {
    background: '#10b981',
    width: '100%',
  },
});

function RegisterPage() {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [buttonHover, setButtonHover] = useState(false);
  const [linkHover, setLinkHover] = useState(false);
  const [passwordToggleHover, setPasswordToggleHover] = useState(false);
  const navigate = useNavigate();

  const styles = getStyles(theme);

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    if (password.length >= 10 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'strong';
    return 'medium';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
      // Registration successful, redirect to login with message
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in to continue.',
          email: email 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <img src="/logo.jpg" alt="EduEdge Logo" style={styles.logo} />
          <div style={styles.headerTitle}>Join EduEdge</div>
          <div style={styles.headerSubtitle}>
            <UserPlus size={18} />
            Start your learning journey today
          </div>
          
          {/* Background decorations */}
          <div style={{
            ...styles.backgroundDecoration,
            top: -40,
            right: -40,
            width: 120,
            height: 120,
          }}></div>
          <div style={{
            ...styles.backgroundDecoration,
            bottom: -40,
            left: -40,
            width: 120,
            height: 120,
          }}></div>
        </div>

        {error && (
          <div style={styles.error}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={styles.form} autoComplete="off">
          <div style={styles.inputGroup}>
            <User 
              size={18} 
              style={{
                ...styles.inputIcon,
                ...(focusedField === 'name' ? styles.inputIconFocused : {})
              }} 
            />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField('')}
              placeholder="Full Name"
              required
              style={{
                ...styles.input,
                ...(focusedField === 'name' ? styles.inputFocused : {})
              }}
              autoComplete="off"
            />
          </div>

          <div style={styles.inputGroup}>
            <Mail 
              size={18} 
              style={{
                ...styles.inputIcon,
                ...(focusedField === 'email' ? styles.inputIconFocused : {})
              }} 
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
              placeholder="Email Address"
              required
              style={{
                ...styles.input,
                ...(focusedField === 'email' ? styles.inputFocused : {})
              }}
              autoComplete="off"
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock 
              size={18} 
              style={{
                ...styles.inputIcon,
                ...(focusedField === 'password' ? styles.inputIconFocused : {})
              }} 
            />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
              placeholder="Password"
              required
              style={{
                ...styles.input,
                paddingRight: 48,
                ...(focusedField === 'password' ? styles.inputFocused : {})
              }}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              onMouseEnter={() => setPasswordToggleHover(true)}
              onMouseLeave={() => setPasswordToggleHover(false)}
              style={{
                ...styles.passwordToggle,
                ...(passwordToggleHover ? styles.passwordToggleHover : {})
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            
            {/* Password strength indicator */}
            {password && (
              <div style={{
                ...styles.strengthIndicator,
                ...(passwordStrength === 'weak' ? styles.strengthWeak : 
                    passwordStrength === 'medium' ? styles.strengthMedium : 
                    styles.strengthStrong)
              }}></div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonLoading : {}),
              ...(buttonHover && !loading ? styles.buttonHover : {})
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <div style={styles.footerText}>
            Already have an account?
          </div>
          <Link 
            to="/login" 
            onMouseEnter={() => setLinkHover(true)}
            onMouseLeave={() => setLinkHover(false)}
            style={{
              ...styles.footerLink,
              ...(linkHover ? styles.footerLinkHover : {})
            }}
          >
            <LogIn size={16} />
            Sign In Instead
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        input::placeholder {
          color: ${theme === 'dark' ? '#64748b' : '#9ca3af'};
        }
        
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px ${theme === 'dark' ? '#0f172a' : '#ffffff'} inset !important;
          -webkit-text-fill-color: ${theme === 'dark' ? '#f8fafc' : '#1f2937'} !important;
        }
      `}</style>
    </div>
  );
}

export default RegisterPage;