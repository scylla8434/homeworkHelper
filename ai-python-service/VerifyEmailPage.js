import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../client/src/ThemeContext';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

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
  success: {
    background: theme === 'dark' 
      ? 'rgba(16, 185, 129, 0.1)' 
      : '#ecfdf5',
    border: theme === 'dark'
      ? '1px solid rgba(16, 185, 129, 0.3)'
      : '1px solid #a7f3d0',
    borderRadius: 12,
    padding: '12px 16px',
    margin: '0 32px 16px 32px',
    color: theme === 'dark' ? '#34d399' : '#059669',
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    animation: 'slideInDown 0.3s ease-out',
  },
});

function VerifyEmailPage() {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const email = location.state?.email || '';
  const message = location.state?.message || '';
  const styles = getStyles(theme);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/verify-email`, { email, code });
      setSuccess('Email verified successfully! You can now log in.');
      setTimeout(() => {
        navigate('/login', { state: { message: 'Email verified! Please log in.' } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        <div style={styles.header}>
          <img src="/logo.jpg" alt="EduEdge Logo" style={styles.logo} />
          <div style={styles.headerTitle}>Verify Your Email</div>
          <div style={styles.headerSubtitle}>
            <Mail size={18} />
            Enter the code sent to your email
          </div>
        </div>
        {message && (
          <div style={styles.success}>
            <CheckCircle size={16} />
            {message}
          </div>
        )}
        {error && (
          <div style={styles.error}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        {success && (
          <div style={styles.success}>
            <CheckCircle size={16} />
            {success}
          </div>
        )}
        <form onSubmit={handleVerify} style={styles.form} autoComplete="off">
          <div style={styles.inputGroup}>
            <Mail size={18} style={styles.inputIcon} />
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Verification Code"
              required
              style={styles.input}
              autoComplete="off"
              maxLength={6}
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            Verify Email
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <span style={{ color: theme === 'dark' ? '#94a3b8' : '#6b7280', fontSize: 14 }}>
            Didn't receive a code? Check your spam folder or <Link to="/register">register again</Link>.
          </span>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmailPage; 