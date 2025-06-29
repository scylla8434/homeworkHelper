import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Modern, professional styles for login/register
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
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    background: '#f8fafc',
    padding: 32,
  },
  input: {
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #d1d5db',
    fontSize: 16,
    outline: 'none',
    background: '#fff',
    transition: 'border 0.2s',
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
    transition: 'background 0.2s',
    marginTop: 4,
  },
  error: {
    color: '#ef4444',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 500,
  },
  link: {
    marginTop: 18,
    textAlign: 'center',
    color: '#6366f1',
    fontWeight: 500,
    fontSize: 15,
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
      <div style={styles.header}>Sign In</div>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
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
