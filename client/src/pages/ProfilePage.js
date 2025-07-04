import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { 
  User, 
  Camera, 
  Edit, 
  Lock, 
  LogOut, 
  Settings,
  Crown,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  X,
  Phone,
  Mail,
  Loader2,
  Save,
  Cancel
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

  card: {
    maxWidth: 480,
    width: '100%',
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    borderRadius: 20,
    boxShadow: theme === 'dark'
      ? '0 10px 40px rgba(0, 0, 0, 0.3)'
      : '0 10px 40px rgba(60, 60, 120, 0.15)',
    overflow: 'hidden',
    padding: '40px 32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'all 0.3s ease-in-out',
    border: theme === 'dark' 
      ? '1px solid rgba(148, 163, 184, 0.2)' 
      : 'none',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },

  title: {
    fontWeight: 800,
    fontSize: 28,
    color: theme === 'dark' ? '#f8fafc' : '#4f46e5',
    letterSpacing: '-0.025em',
    textAlign: 'center',
  },

  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },

  avatarWrap: {
    position: 'relative',
    width: 100,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarImg: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: theme === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: theme === 'dark' 
      ? '3px solid #6366f1' 
      : '3px solid #4f46e5',
    background: theme === 'dark' ? '#334155' : '#f8fafc',
    transition: 'all 0.2s ease-in-out',
  },

  avatarUpload: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    background: theme === 'dark' ? '#6366f1' : '#4f46e5',
    color: '#ffffff',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: theme === 'dark' 
      ? '2px solid #1e293b' 
      : '2px solid #ffffff',
    boxShadow: theme === 'dark'
      ? '0 2px 8px rgba(0, 0, 0, 0.3)'
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease-in-out',
  },

  avatarUploadHover: {
    transform: 'scale(1.1)',
    boxShadow: theme === 'dark'
      ? '0 4px 12px rgba(99, 102, 241, 0.4)'
      : '0 4px 12px rgba(79, 70, 229, 0.3)',
  },

  profileSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },

  label: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontWeight: 600,
    fontSize: 14,
    color: theme === 'dark' ? '#cbd5e1' : '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  value: {
    fontSize: 16,
    color: theme === 'dark' ? '#f8fafc' : '#1f2937',
    background: theme === 'dark' ? '#0f172a' : '#f8fafc',
    padding: '12px 16px',
    borderRadius: 12,
    border: theme === 'dark' 
      ? '1px solid rgba(148, 163, 184, 0.2)' 
      : '1px solid #e5e7eb',
    boxShadow: theme === 'dark'
      ? '0 2px 4px rgba(0, 0, 0, 0.1)'
      : '0 2px 4px rgba(0, 0, 0, 0.05)',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
  },

  input: {
    width: '100%',
    padding: '12px 16px',
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

  inputDisabled: {
    background: theme === 'dark' ? '#334155' : '#f3f4f6',
    color: theme === 'dark' ? '#64748b' : '#9ca3af',
    cursor: 'not-allowed',
  },

  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '12px 24px',
    borderRadius: 12,
    border: 'none',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    outline: 'none',
    width: '100%',
  },

  primaryButton: {
    background: theme === 'dark'
      ? 'linear-gradient(135deg, #6366f1 0%, #5b21b6 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    boxShadow: theme === 'dark'
      ? '0 4px 12px rgba(99, 102, 241, 0.3)'
      : '0 4px 12px rgba(102, 126, 234, 0.3)',
  },

  primaryButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: theme === 'dark'
      ? '0 6px 20px rgba(99, 102, 241, 0.4)'
      : '0 6px 20px rgba(102, 126, 234, 0.4)',
  },

  secondaryButton: {
    background: theme === 'dark' 
      ? 'rgba(148, 163, 184, 0.1)' 
      : '#f8fafc',
    color: theme === 'dark' ? '#f8fafc' : '#4f46e5',
    border: theme === 'dark'
      ? '1px solid rgba(148, 163, 184, 0.3)'
      : '1px solid #e5e7eb',
  },

  secondaryButtonHover: {
    background: theme === 'dark' 
      ? 'rgba(148, 163, 184, 0.2)' 
      : '#f1f5f9',
    transform: 'translateY(-1px)',
  },

  dangerButton: {
    background: theme === 'dark'
      ? 'rgba(239, 68, 68, 0.1)'
      : '#fef2f2',
    color: theme === 'dark' ? '#f87171' : '#dc2626',
    border: theme === 'dark'
      ? '1px solid rgba(239, 68, 68, 0.3)'
      : '1px solid #fecaca',
  },

  dangerButtonHover: {
    background: theme === 'dark'
      ? 'rgba(239, 68, 68, 0.2)'
      : '#fee2e2',
    transform: 'translateY(-1px)',
  },

  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 24,
  },

  loading: {
    color: theme === 'dark' ? '#94a3b8' : '#6b7280',
    fontStyle: 'italic',
    margin: '24px 0',
    textAlign: 'center',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  message: {
    padding: '12px 16px',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '8px 0',
    animation: 'slideInDown 0.3s ease-out',
  },

  successMessage: {
    background: theme === 'dark' 
      ? 'rgba(16, 185, 129, 0.1)' 
      : '#ecfdf5',
    border: theme === 'dark'
      ? '1px solid rgba(16, 185, 129, 0.3)'
      : '1px solid #a7f3d0',
    color: theme === 'dark' ? '#34d399' : '#059669',
  },

  errorMessage: {
    background: theme === 'dark' 
      ? 'rgba(239, 68, 68, 0.1)' 
      : '#fef2f2',
    border: theme === 'dark'
      ? '1px solid rgba(239, 68, 68, 0.3)'
      : '1px solid #fecaca',
    color: theme === 'dark' ? '#f87171' : '#dc2626',
  },

  subStatus: {
    marginTop: 24,
    padding: '16px',
    background: theme === 'dark'
      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)'
      : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
    border: theme === 'dark'
      ? '1px solid rgba(16, 185, 129, 0.2)'
      : '1px solid #a7f3d0',
    borderRadius: 12,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    color: theme === 'dark' ? '#34d399' : '#059669',
    fontWeight: 600,
    fontSize: 14,
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },

  modal: {
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    borderRadius: 16,
    padding: '32px',
    width: '90%',
    maxWidth: 420,
    boxShadow: theme === 'dark'
      ? '0 20px 40px rgba(0, 0, 0, 0.3)'
      : '0 20px 40px rgba(0, 0, 0, 0.15)',
    position: 'relative',
    border: theme === 'dark' 
      ? '1px solid rgba(148, 163, 184, 0.2)' 
      : 'none',
    animation: 'modalSlideIn 0.3s ease-out',
  },

  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  modalTitle: {
    fontWeight: 700,
    fontSize: 20,
    color: theme === 'dark' ? '#f8fafc' : '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },

  closeModalBtn: {
    background: 'none',
    border: 'none',
    color: theme === 'dark' ? '#94a3b8' : '#6b7280',
    cursor: 'pointer',
    padding: 4,
    borderRadius: 6,
    transition: 'all 0.2s ease-in-out',
  },

  closeModalBtnHover: {
    background: theme === 'dark' 
      ? 'rgba(148, 163, 184, 0.1)' 
      : 'rgba(107, 114, 128, 0.1)',
    color: theme === 'dark' ? '#f8fafc' : '#374151',
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

  passwordInputGroup: {
    position: 'relative',
    marginBottom: 16,
  },
});

function ProfilePage() {
  const { theme } = useTheme();
  const { user, updateUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [edit, setEdit] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [subStatus] = useState('Pro Plan (Active)');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileErr, setProfileErr] = useState('');
  const [showPwModal, setShowPwModal] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [focusedField, setFocusedField] = useState('');
  const [buttonHovers, setButtonHovers] = useState({});
  const [avatarHover, setAvatarHover] = useState(false);
  const [closeHover, setCloseHover] = useState(false);
  const [passwordToggleHover, setPasswordToggleHover] = useState('');

  const styles = getStyles(theme);

  useEffect(() => {
    if (!user) return setLoading(false);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
    if (user.avatar) setAvatarPreview(user.avatar);
    setLoading(false);
  }, [user]);

  const handleLogout = () => {
    logout();
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
    try {
      const res = await axios.put(`${API_URL}/api/user/${user._id || user.id}`, { 
        name: editName, 
        phone: editPhone 
      });
      setName(res.data.user.name);
      setPhone(res.data.user.phone);
      updateUser(res.data.user);
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
      setPwErr('All fields are required.');
      return;
    }
    if (newPw !== confirmPw) {
      setPwErr('New passwords do not match.');
      return;
    }
    try {
      const res = await axios.put(`${API_URL}/api/user/${user._id || user.id}/password`, { 
        oldPassword: oldPw, 
        newPassword: newPw 
      });
      const userRes = await axios.get(`${API_URL}/api/user/${user._id || user.id}`);
      updateUser(userRes.data);
      setPwMsg('Password updated successfully.');
      setOldPw('');
      setNewPw('');
      setConfirmPw('');
      setTimeout(() => setShowPwModal(false), 2000);
    } catch (err) {
      setPwErr(err.response?.data?.message || 'Password update failed.');
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const formData = new FormData();
      formData.append('avatar', file);
      try {
        const res = await axios.post(`${API_URL}/api/user/${user._id || user.id}/avatar`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setAvatarPreview(res.data.avatarUrl);
        updateUser({ ...user, avatar: res.data.avatarUrl });
      } catch (err) {
        setProfileErr('Avatar upload failed.');
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleButtonHover = (buttonId, isHover) => {
    setButtonHovers(prev => ({ ...prev, [buttonId]: isHover }));
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.card} aria-live="polite" aria-label="Profile and settings">
        <div style={styles.header}>
          <Settings size={28} style={{ color: theme === 'dark' ? '#f8fafc' : '#4f46e5' }} />
          <div style={styles.title}>Profile & Settings</div>
        </div>

        {loading ? (
          <div style={styles.loading}>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            Loading profile...
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            {/* Avatar Section */}
            <div style={styles.avatarSection}>
              <div style={styles.avatarWrap}>
                <img
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=${theme === 'dark' ? '6366f1' : '4f46e5'}&color=fff&size=128`}
                  alt="Profile Avatar"
                  style={styles.avatarImg}
                />
                <label 
                  htmlFor="avatarInput" 
                  style={{
                    ...styles.avatarUpload,
                    ...(avatarHover ? styles.avatarUploadHover : {})
                  }}
                  onMouseEnter={() => setAvatarHover(true)}
                  onMouseLeave={() => setAvatarHover(false)}
                  title="Upload new avatar"
                >
                  <Camera size={18} />
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>

            {/* Profile Fields */}
            <div style={styles.profileSection}>
              {edit ? (
                <>
                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>
                      <User size={16} />
                      Full Name
                    </div>
                    <input
                      style={{
                        ...styles.input,
                        ...(focusedField === 'name' ? styles.inputFocused : {})
                      }}
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>
                      <Phone size={16} />
                      Phone Number
                    </div>
                    <input
                      style={{
                        ...styles.input,
                        ...(focusedField === 'phone' ? styles.inputFocused : {})
                      }}
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField('')}
                      placeholder="2547XXXXXXXX"
                      maxLength={12}
                    />
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>
                      <Mail size={16} />
                      Email Address
                    </div>
                    <input
                      style={{
                        ...styles.input,
                        ...styles.inputDisabled
                      }}
                      value={email}
                      disabled
                      type="email"
                    />
                  </div>

                  {profileMsg && (
                    <div style={{...styles.message, ...styles.successMessage}}>
                      <CheckCircle size={16} />
                      {profileMsg}
                    </div>
                  )}
                  {profileErr && (
                    <div style={{...styles.message, ...styles.errorMessage}}>
                      <AlertCircle size={16} />
                      {profileErr}
                    </div>
                  )}

                  <div style={styles.buttonGroup}>
                    <button 
                      style={{
                        ...styles.button,
                        ...styles.primaryButton,
                        ...(buttonHovers.save ? styles.primaryButtonHover : {})
                      }}
                      onMouseEnter={() => handleButtonHover('save', true)}
                      onMouseLeave={() => handleButtonHover('save', false)}
                      onClick={handleSave}
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                    <button 
                      style={{
                        ...styles.button,
                        ...styles.secondaryButton,
                        ...(buttonHovers.cancel ? styles.secondaryButtonHover : {})
                      }}
                      onMouseEnter={() => handleButtonHover('cancel', true)}
                      onMouseLeave={() => handleButtonHover('cancel', false)}
                      onClick={handleCancel}
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>
                      <User size={16} />
                      Full Name
                    </div>
                    <div style={styles.value}>
                      {name || <span style={{ color: theme === 'dark' ? '#64748b' : '#9ca3af' }}>Not set</span>}
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>
                      <Phone size={16} />
                      Phone Number
                    </div>
                    <div style={styles.value}>
                      {phone || <span style={{ color: theme === 'dark' ? '#64748b' : '#9ca3af' }}>Not set</span>}
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <div style={styles.label}>
                      <Mail size={16} />
                      Email Address
                    </div>
                    <div style={styles.value}>
                      {email || <span style={{ color: theme === 'dark' ? '#64748b' : '#9ca3af' }}>Not set</span>}
                    </div>
                  </div>

                  <div style={styles.buttonGroup}>
                    <button 
                      style={{
                        ...styles.button,
                        ...styles.primaryButton,
                        ...(buttonHovers.edit ? styles.primaryButtonHover : {})
                      }}
                      onMouseEnter={() => handleButtonHover('edit', true)}
                      onMouseLeave={() => handleButtonHover('edit', false)}
                      onClick={handleEdit}
                      aria-label="Edit profile"
                    >
                      <Edit size={16} />
                      Edit Profile
                    </button>
                    <button 
                      style={{
                        ...styles.button,
                        ...styles.secondaryButton,
                        ...(buttonHovers.password ? styles.secondaryButtonHover : {})
                      }}
                      onMouseEnter={() => handleButtonHover('password', true)}
                      onMouseLeave={() => handleButtonHover('password', false)}
                      onClick={() => setShowPwModal(true)}
                      aria-label="Change password"
                    >
                      <Lock size={16} />
                      Change Password
                    </button>
                    <button 
                      style={{
                        ...styles.button,
                        ...styles.dangerButton,
                        ...(buttonHovers.logout ? styles.dangerButtonHover : {})
                      }}
                      onMouseEnter={() => handleButtonHover('logout', true)}
                      onMouseLeave={() => handleButtonHover('logout', false)}
                      onClick={handleLogout}
                      aria-label="Logout"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}

              {/* Subscription Status */}
              <div style={styles.subStatus}>
                <Crown size={18} />
                {subStatus}
              </div>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPwModal && (
          <div style={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Change password">
            <div style={styles.modal}>
              <div style={styles.modalHeader}>
                <div style={styles.modalTitle}>
                  <Lock size={20} />
                  Change Password
                </div>
                <button 
                  style={{
                    ...styles.closeModalBtn,
                    ...(closeHover ? styles.closeModalBtnHover : {})
                  }}
                  onMouseEnter={() => setCloseHover(true)}
                  onMouseLeave={() => setCloseHover(false)}
                  aria-label="Close modal" 
                  onClick={() => setShowPwModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={styles.passwordInputGroup}>
                <input
                  style={styles.input}
                  type={showPasswords.old ? 'text' : 'password'}
                  placeholder="Current password"
                  value={oldPw}
                  onChange={e => setOldPw(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('old')}
                  onMouseEnter={() => setPasswordToggleHover('old')}
                  onMouseLeave={() => setPasswordToggleHover('')}
                  style={{
                    ...styles.passwordToggle,
                    ...(passwordToggleHover === 'old' ? styles.passwordToggleHover : {})
                  }}
                >
                  {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div style={styles.passwordInputGroup}>
                <input
                  style={styles.input}
                  type={showPasswords.new ? 'text' : 'password'}
                  placeholder="New password"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  onMouseEnter={() => setPasswordToggleHover('new')}
                  onMouseLeave={() => setPasswordToggleHover('')}
                  style={{
                    ...styles.passwordToggle,
                    ...(passwordToggleHover === 'new' ? styles.passwordToggleHover : {})
                  }}
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div style={styles.passwordInputGroup}>
                <input
                  style={styles.input}
                  type={showPasswords.confirm ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  onMouseEnter={() => setPasswordToggleHover('confirm')}
                  onMouseLeave={() => setPasswordToggleHover('')}
                  style={{
                    ...styles.passwordToggle,
                    ...(passwordToggleHover === 'confirm' ? styles.passwordToggleHover : {})
                  }}
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {pwMsg && (
                <div style={{...styles.message, ...styles.successMessage}}>
                  <CheckCircle size={16} />
                  {pwMsg}
                </div>
              )}
              {pwErr && (
                <div style={{...styles.message, ...styles.errorMessage}}>
                  <AlertCircle size={16} />
                  {pwErr}
                </div>
              )}

              <div style={styles.buttonGroup}>
                <button 
                  style={{
                    ...styles.button,
                    ...styles.primaryButton,
                    ...(buttonHovers.updatePw ? styles.primaryButtonHover : {})
                  }}
                  onMouseEnter={() => handleButtonHover('updatePw', true)}
                  onMouseLeave={() => handleButtonHover('updatePw', false)}
                  onClick={handlePwChange}
                >
                  <Lock size={16} />
                  Update Password
                </button>
                <button 
                  style={{
                    ...styles.button,
                    ...styles.secondaryButton,
                    ...(buttonHovers.cancelPw ? styles.secondaryButtonHover : {})
                  }}
                  onMouseEnter={() => handleButtonHover('cancelPw', true)}
                  onMouseLeave={() => handleButtonHover('cancelPw', false)}
                  onClick={() => setShowPwModal(false)}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
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
      `}</style>
    </div>
  );
}

export default ProfilePage;