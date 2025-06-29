import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
  avatarWrap: {
    marginBottom: 18,
    position: 'relative',
    width: 84,
    height: 84,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: 84,
    height: 84,
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0 2px 8px 0 rgba(60,60,120,0.10)',
    border: '3px solid #6366f1',
    background: '#f8fafc',
  },
  avatarUpload: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    background: '#6366f1',
    color: '#fff',
    borderRadius: '50%',
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: '2px solid #fff',
    fontSize: 18,
    boxShadow: '0 1px 4px 0 rgba(60,60,120,0.10)',
  },
  input: {
    padding: '10px 14px',
    borderRadius: 10,
    border: '1.5px solid #d1d5db',
    fontSize: 16,
    outline: 'none',
    background: '#fff',
    transition: 'border 0.2s',
    marginBottom: 8,
    width: '100%',
  },
  subStatus: {
    marginTop: 18,
    fontWeight: 600,
    color: '#60a5fa',
    background: '#f8fafc',
    borderRadius: 8,
    padding: '8px 0',
    fontSize: 15,
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    position: 'relative',
  },
  closeModalBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'none',
    border: 'none',
    color: '#6366f1',
    fontSize: 18,
    cursor: 'pointer',
  },
};

styles.saveBtn = {
  ...styles.button,
  marginTop: 12,
  background: 'linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)',
};

styles.cancelBtn = {
  ...styles.button,
  marginTop: 12,
  background: '#f8fafc',
  color: '#6366f1',
  border: '1.5px solid #6366f1',
};

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [edit, setEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [subStatus] = useState('Pro Plan (Active)'); // Simulated, replace with real data if available
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [showPwModal, setShowPwModal] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return setLoading(false);
    axios.get(`${API_URL}/api/user/${userId}`)
      .then(res => {
        setName(res.data.name);
        setEmail(res.data.email);
        setPhone(res.data.phone || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userAvatar');
    window.location.href = '/login';
  };

  const handleEdit = () => {
    setEditName(name);
    setEditPhone(phone);
    setEdit(true);
    setProfileMsg('');
    setProfileErr('');
  };

  const handleCancel = () => {
    setEdit(false);
    setProfileMsg('');
    setProfileErr('');
  };

  const handleSave = async () => {
    setProfileMsg('');
    setProfileErr('');
    const userId = localStorage.getItem('userId');
    try {
      const res = await axios.put(`${API_URL}/api/user/${userId}`, { name: editName, phone: editPhone });
      setName(res.data.user.name);
      setPhone(res.data.user.phone);
      setEdit(false);
      setProfileMsg('Profile updated successfully.');
    } catch (err) {
      setProfileErr(err.response?.data?.message || 'Update failed.');
    }
  };

  const handlePwChange = async () => {
    setPwMsg('');
    setPwErr('');
    if (!oldPw || !newPw || !confirmPw) {
      setPwErr('All fields are required.'); return;
    }
    if (newPw !== confirmPw) {
      setPwErr('New passwords do not match.'); return;
    }
    const userId = localStorage.getItem('userId');
    try {
      await axios.put(`${API_URL}/api/user/${userId}/password`, { oldPassword: oldPw, newPassword: newPw });
      setPwMsg('Password updated successfully.');
      setOldPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) {
      setPwErr(err.response?.data?.message || 'Password update failed.');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      localStorage.setItem('userAvatar', url);
    }
  };

  return (
    <div style={styles.card} aria-live="polite" aria-label="Profile and settings">
      <div style={styles.title}>Profile & Settings</div>
      {loading ? (
        <div style={styles.loading}>Loading profile...</div>
      ) : (
        <div style={{ width: '100%' }}>
          {/* Avatar upload */}
          <div style={styles.avatarWrap}>
            <img
              src={avatarPreview || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name || 'User') + '&background=6366f1&color=fff&size=128'}
              alt="Avatar"
              style={styles.avatarImg}
            />
            <label htmlFor="avatarInput" style={styles.avatarUpload} title="Upload avatar">
              <span role="img" aria-label="upload">📷</span>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          {/* Editable fields */}
          {edit ? (
            <>
              <div style={styles.label}>Username</div>
              <input
                style={styles.input}
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Username"
              />
              <div style={styles.label}>Phone Number</div>
              <input
                style={styles.input}
                value={editPhone}
                onChange={e => setEditPhone(e.target.value)}
                placeholder="2547XXXXXXXX"
                maxLength={12}
              />
              <div style={styles.label}>Email</div>
              <input
                style={{ ...styles.input, background: '#f3f4f6', color: '#888' }}
                value={email}
                disabled
                type="email"
              />
              {profileMsg && <div style={{ color: '#22c55e', marginBottom: 8 }}>{profileMsg}</div>}
              {profileErr && <div style={{ color: '#ef4444', marginBottom: 8 }}>{profileErr}</div>}
              <button style={styles.saveBtn} onClick={handleSave}>Save</button>
              <button style={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            <>
              <div style={styles.label}>Username</div>
              <div style={styles.value}>{name || <span style={{ color: '#aaa' }}>Not set</span>}</div>
              <div style={styles.label}>Phone Number</div>
              <div style={styles.value}>{phone || <span style={{ color: '#aaa' }}>Not set</span>}</div>
              <div style={styles.label}>Email</div>
              <div style={styles.value}>{email || <span style={{ color: '#aaa' }}>Not set</span>}</div>
              <button style={styles.button} onClick={handleEdit} aria-label="Edit profile">Edit Profile</button>
              <button style={styles.button} onClick={() => setShowPwModal(true)} aria-label="Change password">Change Password</button>
              <button style={styles.button} onClick={handleLogout} aria-label="Logout">Logout</button>
            </>
          )}
          {/* Password Change Modal */}
          {showPwModal && (
            <div style={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Change password">
              <div style={styles.modal}>
                <button style={styles.closeModalBtn} aria-label="Close" onClick={() => setShowPwModal(false)}>&times;</button>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#6366f1', marginBottom: 8 }}>Change Password</div>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Old password"
                  value={oldPw}
                  onChange={e => setOldPw(e.target.value)}
                />
                <input
                  style={styles.input}
                  type="password"
                  placeholder="New password"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                />
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                />
                {pwMsg && <div style={{ color: '#22c55e', marginBottom: 8 }}>{pwMsg}</div>}
                {pwErr && <div style={{ color: '#ef4444', marginBottom: 8 }}>{pwErr}</div>}
                <button style={styles.saveBtn} onClick={handlePwChange}>Update Password</button>
                <button style={styles.cancelBtn} onClick={() => setShowPwModal(false)}>Cancel</button>
              </div>
            </div>
          )}
          {/* Subscription status */}
          <div style={styles.subStatus}>{subStatus}</div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
