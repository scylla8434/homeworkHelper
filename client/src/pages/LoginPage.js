import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const styles = {
  container: {
    maxWidth: 420,
    margin: '48px auto',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
    border: 'none',
    borderRadius: 18,
    boxShadow: '0 6px 32px 0 rgba(60,60,120,0.10)',
    overflow: 'hidden',
    padding: 0,
    position: 'relative',
  },
  logo: {
    width: 74,
    height: 74,
    borderRadius: 12,
    objectFit: 'cover',
    margin: '0 auto 18px auto',
    display: 'block',
    boxShadow: '0 2px 8px 0 rgba(60,60,120,0.10)',
  },
  header: {
    background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
    color: '#fff',
    padding: '28px 0 18px 0',
    textAlign: 'center',
    fontWeight: 700,
    fontSize: 28,
    letterSpacing: 1,
    boxShadow: '0 2px 8px 0 rgba(60,60,120,0.06)',
    position: 'relative',
    zIndex: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    background: '#f8fafc',
    padding: 32,
    borderRadius: '0 0 18px 18px',
    position: 'relative',
    zIndex: 1,
  },
  input: {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1.5px solid #d1d5db',
    fontSize: 16,
    outline: 'none',
    background: '#fff',
    transition: 'border 0.2s',
    marginBottom: 2,
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 18,
    color: '#6366f1',
    opacity: 0.7,
  },
  inputGroup: {
    position: 'relative',
    width: '100%',
  },
  button: {
    padding: '12px 0',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 17,
    cursor: 'pointer',
    boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
    transition: 'background 0.2s, transform 0.1s',
    marginTop: 4,
    outline: 'none',
  },
  buttonLoading: {
    opacity: 0.7,
    pointerEvents: 'none',
  },
  error: {
    color: '#ef4444',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 500,
    background: '#fef2f2',
    borderRadius: 8,
    padding: '8px 0',
    fontSize: 15,
    boxShadow: '0 1px 4px 0 rgba(239,68,68,0.08)',
  },
  link: {
    marginTop: 18,
    textAlign: 'center',
    color: '#6366f1',
    fontWeight: 500,
    fontSize: 15,
    zIndex: 1,
    position: 'relative',
  },
  bgDecor: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
    opacity: 0.10,
    zIndex: 0,
  },
  bgDecor2: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 120,
    height: 120,
    background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)',
    opacity: 0.10,
    zIndex: 0,
  },
};

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.id);
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgDecor}></div>
      <div style={styles.bgDecor2}></div>
      <img src="/logo.jpg" alt="Logo" style={styles.logo} />
      <div style={styles.header}>Sign In</div>
      <form onSubmit={handleLogin} style={styles.form} autoComplete="off">
        <div style={styles.inputGroup}>
          <span style={styles.inputIcon} role="img" aria-label="email">✉️</span>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{...styles.input, paddingLeft: 38}}
            autoComplete="off"
          />
        </div>
        <div style={styles.inputGroup}>
          <span style={styles.inputIcon} role="img" aria-label="password">🔒</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{...styles.input, paddingLeft: 38}}
            autoComplete="off"
          />
        </div>
        <button type="submit" disabled={loading} style={{...styles.button, ...(loading ? styles.buttonLoading : {})}}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <div style={styles.error}>{error}</div>}
      <div style={styles.link}>
        Don&apos;t have an account? <a href="/register" style={{ color: '#2563eb', textDecoration: 'underline' }}>Register</a>
      </div>
    </div>
  );
}

export default LoginPage;
