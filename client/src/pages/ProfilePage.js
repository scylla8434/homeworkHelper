import React, { useState, useEffect } from 'react';

const styles = {
  card: {
    maxWidth: 420,
    margin: '0 auto',
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 6px 32px 0 rgba(60,60,120,0.10)',
    overflow: 'hidden',
    padding: '36px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'box-shadow 0.3s',
  },
  title: {
    fontWeight: 800,
    fontSize: 28,
    color: '#6366f1',
    marginBottom: 18,
    letterSpacing: 1,
    textAlign: 'center',
  },
  label: {
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 8,
    color: '#6366f1',
    alignSelf: 'flex-start',
    marginTop: 18,
  },
  value: {
    fontSize: 17,
    color: '#222',
    marginBottom: 8,
    background: '#f8fafc',
    padding: '10px 18px',
    borderRadius: 10,
    boxShadow: '0 1px 4px 0 rgba(60,60,120,0.08)',
    alignSelf: 'flex-start',
    minWidth: 220,
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
    marginTop: 32,
    width: '100%',
  },
  loading: {
    color: '#6366f1',
    fontStyle: 'italic',
    margin: '24px 0',
    textAlign: 'center',
    fontWeight: 600,
  },
};

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Simulate loading for polish
    setTimeout(() => {
      setName(localStorage.getItem('userName') || '');
      setEmail(localStorage.getItem('userEmail') || '');
      setLoading(false);
    }, 400);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  return (
    <div style={styles.card} aria-live="polite" aria-label="Profile and settings">
      <div style={styles.title}>Profile & Settings</div>
      {loading ? (
        <div style={styles.loading}>Loading profile...</div>
      ) : (
        <div>
          <div style={styles.label}>Name</div>
          <div style={styles.value}>{name || <span style={{ color: '#aaa' }}>Not set</span>}</div>
          <div style={styles.label}>Email</div>
          <div style={styles.value}>{email || <span style={{ color: '#aaa' }}>Not set</span>}</div>
          <button style={styles.button} onClick={handleLogout} aria-label="Logout">Logout</button>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
