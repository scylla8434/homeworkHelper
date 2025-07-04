import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Loader2, 
  AlertCircle,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle
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

  successMessage: {
    background: theme === 'dark' 
      ? 'rgba(16, 185, 129, 0.1)' 
      : '#ecfdf5',
    border: theme === 'dark'
      ? '1px solid rgba(16, 185, 129, 0.3)'
      : '1px solid #a7f3d0',
    borderRadius: 12,
    padding: '12px 16px',
    margin: '0 32px 0 32px',
    color: theme === 'dark' ? '#34d399' : '#059669',
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    animation: 'slideInDown 0.3s ease-out',
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

  forgotPassword: {
    color: theme === 'dark' ? '#94a3b8' : '#6b7280',
    fontSize: 14,
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
    marginTop: 16,
    transition: 'color 0.2s ease-in-out',
  },

  forgotPasswordHover: {
    color: theme === 'dark' ? '#6366f1' : '#4f46e5',
  },

  backgroundDecoration: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    zIndex: 0,
  },

  quickLoginHint: {
    background: theme === 'dark' 
      ? 'rgba(59, 130, 246, 0.1)' 
      : '#eff6ff',
    border: theme === 'dark'
      ? '1px solid rgba(59, 130, 246, 0.2)'
      : '1px solid #dbeafe',
    borderRadius: 8,
    padding: '12px 16px',
    margin: '16px 0',
    fontSize: 12,
    color: theme === 'dark' ? '#93c5fd' : '#3b82f6',
    textAlign: 'center',
  },
});

function LoginPage() {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [buttonHover, setButtonHover] = useState(false);
  const [linkHover, setLinkHover] = useState(false);
  const [forgotHover, setForgotHover] = useState(false);
  const [passwordToggleHover, setPasswordToggleHover] = useState(false);
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const styles = getStyles(theme);
  const successMessage = location.state?.message || '';
  const prefillEmail = location.state?.email || '';

  // Pre-fill email if coming from registration
  useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [prefillEmail]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      login(res.data.user); // Store user in context/localStorage
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <img src="/logo.jpg" alt="EduEdge Logo" style={styles.logo} />
          <div style={styles.headerTitle}>Welcome Back</div>
          <div style={styles.headerSubtitle}>
            <LogIn size={18} />
            Sign in to continue learning
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

        {successMessage && (
          <div style={styles.successMessage}>
            <CheckCircle size={16} />
            {successMessage}
          </div>
        )}

        {error && (
          <div style={styles.error}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={styles.form} autoComplete="off">
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
          </div>

          {/* Demo credentials hint */}
          <div style={styles.quickLoginHint}>
            💡 Demo: Use any email and password to test the interface
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
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>

          <a 
            href="#"
            onMouseEnter={() => setForgotHover(true)}
            onMouseLeave={() => setForgotHover(false)}
            style={{
              ...styles.forgotPassword,
              ...(forgotHover ? styles.forgotPasswordHover : {})
            }}
            onClick={(e) => e.preventDefault()}
          >
            Forgot your password?
          </a>
        </form>

        <div style={styles.footer}>
          <div style={styles.footerText}>
            Don't have an account?
          </div>
          <Link 
            to="/register" 
            onMouseEnter={() => setLinkHover(true)}
            onMouseLeave={() => setLinkHover(false)}
            style={{
              ...styles.footerLink,
              ...(linkHover ? styles.footerLinkHover : {})
            }}
          >
            <UserPlus size={16} />
            Create Account
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

export default LoginPage;