import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const styles = {
  wrapper: {
    maxWidth: 900,
    margin: '0 auto',
    width: '100%',
    padding: '0 8px',
    position: 'relative',
  },
  bgDecor: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 180,
    height: 180,
    background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
    opacity: 0.10,
    zIndex: 0,
  },
  bgDecor2: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 180,
    height: 180,
    background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)',
    opacity: 0.10,
    zIndex: 0,
  },
  title: {
    fontWeight: 800,
    fontSize: 32,
    color: '#6366f1',
    marginBottom: 18,
    letterSpacing: 1,
    textAlign: 'center',
    zIndex: 1,
    position: 'relative',
  },
  plans: {
    display: 'flex',
    gap: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 32,
    flexWrap: 'wrap',
    background: '#f8fafc',
    borderRadius: 18,
    boxShadow: '0 1px 4px 0 rgba(60,60,120,0.06)',
    marginBottom: 24,
    transition: 'box-shadow 0.3s',
    zIndex: 1,
    position: 'relative',
  },
  plan: isPro => ({
    background: isPro ? 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)' : '#fff',
    color: isPro ? '#fff' : '#222',
    borderRadius: 18,
    boxShadow: isPro ? '0 8px 32px 0 rgba(99,102,241,0.14)' : '0 1px 4px 0 rgba(60,60,120,0.06)',
    padding: '38px 32px',
    minWidth: 240,
    textAlign: 'center',
    fontWeight: 500,
    border: isPro ? '2.5px solid #6366f1' : '1.5px solid #e5e7eb',
    position: 'relative',
    flex: 1,
    margin: '12px 0',
    transition: 'box-shadow 0.3s, background 0.3s, border 0.2s',
    maxWidth: 340,
    cursor: isPro ? 'pointer' : 'default',
    transform: isPro ? 'scale(1.04)' : 'none',
  }),
  planIcon: {
    fontSize: 38,
    marginBottom: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 54,
    height: 54,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.18)',
    margin: '0 auto 18px auto',
    boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
  },
  planTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 800,
    marginBottom: 8,
  },
  planDesc: {
    fontSize: 15,
    marginBottom: 18,
    opacity: 0.90,
    lineHeight: 1.7,
  },
  badge: {
    position: 'absolute',
    top: -18,
    right: 18,
    background: '#facc15',
    color: '#222',
    fontWeight: 700,
    fontSize: 13,
    borderRadius: 8,
    padding: '2px 12px',
    boxShadow: '0 1px 4px 0 rgba(60,60,120,0.10)',
    letterSpacing: 0.5,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  button: {
    marginTop: 18,
    padding: '14px 0',
    width: '100%',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 17,
    cursor: 'pointer',
    boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
    transition: 'background 0.2s, transform 0.1s',
    outline: 'none',
  },
  buttonHover: {
    background: 'linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)',
    transform: 'scale(1.04)',
  },
  loading: {
    color: '#6366f1',
    fontStyle: 'italic',
    margin: '24px 0',
    textAlign: 'center',
    fontWeight: 600,
  },
  toggleWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    margin: '0 0 24px 0',
    zIndex: 1,
    position: 'relative',
  },
  toggle: {
    background: '#e0e7ef',
    borderRadius: 20,
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    border: '1.5px solid #6366f1',
    minWidth: 90,
    userSelect: 'none',
  },
  toggleBtn: isActive => ({
    background: isActive ? 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)' : 'transparent',
    color: isActive ? '#fff' : '#6366f1',
    borderRadius: 16,
    padding: '6px 18px',
    fontWeight: 700,
    fontSize: 15,
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
  }),
  testimonialSection: {
    margin: '32px 0 0 0',
    textAlign: 'center',
    zIndex: 1,
    position: 'relative',
  },
  testimonialCard: {
    display: 'inline-block',
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 2px 8px 0 rgba(60,60,120,0.10)',
    padding: '22px 28px',
    margin: '0 12px',
    maxWidth: 320,
    minWidth: 220,
    fontSize: 16,
    color: '#222',
    fontStyle: 'italic',
    position: 'relative',
  },
  testimonialAvatar: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto 8px auto',
    display: 'block',
    boxShadow: '0 1px 4px 0 rgba(60,60,120,0.10)',
  },
  trustBadges: {
    display: 'flex',
    justifyContent: 'center',
    gap: 18,
    margin: '24px 0 0 0',
    zIndex: 1,
    position: 'relative',
  },
  badge: {
    background: '#f8fafc',
    borderRadius: 8,
    padding: '8px 18px',
    fontWeight: 600,
    color: '#6366f1',
    fontSize: 15,
    boxShadow: '0 1px 4px 0 rgba(60,60,120,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(60,60,120,0.18)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 8px 32px 0 rgba(99,102,241,0.18)',
    padding: '36px 32px',
    minWidth: 320,
    maxWidth: 90,
    textAlign: 'center',
    zIndex: 1001,
    position: 'relative',
  },
  closeModalBtn: {
    position: 'absolute',
    top: 12,
    right: 16,
    background: 'none',
    border: 'none',
    fontSize: 22,
    color: '#6366f1',
    cursor: 'pointer',
    outline: 'none',
  },
  toast: {
    position: 'fixed',
    bottom: 32,
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#6366f1',
    color: '#fff',
    borderRadius: 8,
    padding: '12px 28px',
    fontWeight: 600,
    fontSize: 16,
    boxShadow: '0 2px 8px 0 rgba(99,102,241,0.18)',
    zIndex: 2000,
    animation: 'fadeInOut 2.5s',
  },
  '@keyframes fadeInOut': {
    '0%': { opacity: 0 },
    '10%': { opacity: 1 },
    '90%': { opacity: 1 },
    '100%': { opacity: 0 },
  },
  comparisonTable: {
    width: '100%',
    maxWidth: 700,
    margin: '36px auto 0 auto',
    borderCollapse: 'collapse',
    background: '#fff',
    borderRadius: 14,
    boxShadow: '0 1px 4px 0 rgba(60,60,120,0.08)',
    overflow: 'hidden',
    zIndex: 1,
    position: 'relative',
  },
  tableHeader: {
    background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
    textAlign: 'center',
    padding: '14px 0',
  },
  tableCell: {
    border: '1px solid #e5e7eb',
    padding: '12px 0',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: 500,
  },
};

const testimonials = [
  {
    name: 'Sarah M.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    text: 'Homework Helper has made evenings so much easier! The AI answers are spot on and the interface is beautiful.',
  },
  {
    name: 'James L.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    text: 'I love the Pro plan. Unlimited questions and fast support. Highly recommended for busy parents!',
  },
  {
    name: 'Priya S.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'The OCR feature is a lifesaver for math homework. My kids are more independent now.',
  },
];

const trustBadges = [
  { icon: '✅', label: 'Secure Payments' },
  { icon: '🔒', label: 'Privacy First' },
  { icon: '🌎', label: 'Trusted Worldwide' },
  { icon: '💬', label: '24/7 Support' },
];

const features = [
  { name: 'AI Answers', free: true, pro: true },
  { name: 'Unlimited Questions', free: false, pro: true },
  { name: 'Image-to-Text OCR', free: true, pro: true },
  { name: 'Math Support', free: false, pro: true },
  { name: 'Priority Support', free: false, pro: true },
  { name: 'Email Support', free: true, pro: true },
];

function PricingPage() {
  const [loading, setLoading] = useState(true);
  const [btnHover, setBtnHover] = useState(false);
  const [yearly, setYearly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const proCardRef = useRef(null);
  const [cardVisible, setCardVisible] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setTimeout(() => setCardVisible(true), 100); // Animate cards after loading
    }, 400);
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 2200);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Keyboard accessibility for modal
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape' && showModal) setShowModal(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showModal]);

  // --- M-Pesa subscribe logic ---
  const handleSubscribe = () => {
    setPhoneInput("");
    setPhoneError("");
    setSubscribeError("");
    setShowPhoneModal(true);
  };

  const submitPhone = async () => {
    setPhoneError("");
    setSubscribeError("");
    if (!/^2547\d{8}$/.test(phoneInput)) {
      setPhoneError("Enter a valid M-Pesa phone number (format 2547XXXXXXXX)");
      return;
    }
    setSubscribing(true);
    setShowModal(true);
    setShowPhoneModal(false);
    try {
      const userId = localStorage.getItem('userId');
      const plan = yearly ? 'yearly' : 'monthly';
      const res = await axios.post(`${API_URL}/api/subscribe`, { userId, phone: phoneInput, plan });
      setShowToast(true);
      setShowModal(true);
      setSubscribeError("");
    } catch (err) {
      setSubscribeError(err.response?.data?.message || err.message || 'Subscription failed. Please try again.');
      setShowModal(false);
    }
    setSubscribing(false);
  };

  // KES pricing and pay-per-use
  const proPrice = yearly ? 4999 : 499;
  const proLabel = yearly ? 'per year' : 'per month';
  const proDesc = yearly
    ? '• Unlimited questions\n• Priority AI answers\n• Image & math support\n• Priority support\n• 2 months free!'
    : '• Unlimited questions\n• Priority AI answers\n• Image & math support\n• Priority support';
  const payPerUsePrice = 10; // KES per question

  return (
    <div style={styles.wrapper} aria-live="polite" aria-label="Pricing and subscription plans">
      <div style={styles.bgDecor}></div>
      <div style={styles.bgDecor2}></div>
      <div style={styles.title}>Pricing & Subscription</div>
      <div style={{textAlign:'center', marginBottom: 18, color:'#6366f1', fontWeight:600, fontSize:18}}>
        <span>Pay-per-use: <span style={{fontWeight:800}}>Ksh {payPerUsePrice}</span> per question</span>
      </div>
      <div style={styles.toggleWrap}>
        <span id="toggle-label" style={{ fontWeight: 600, color: '#6366f1' }}>Billing:</span>
        <div
          style={styles.toggle}
          role="group"
          aria-labelledby="toggle-label"
        >
          <button
            style={styles.toggleBtn(!yearly)}
            aria-pressed={!yearly}
            tabIndex={0}
            onClick={() => setYearly(false)}
          >
            Monthly
          </button>
          <button
            style={styles.toggleBtn(yearly)}
            aria-pressed={yearly}
            tabIndex={0}
            onClick={() => setYearly(true)}
          >
            Yearly
          </button>
        </div>
      </div>
      {loading ? (
        <div style={styles.loading}>Loading plans...</div>
      ) : (
        <div style={styles.plans}>
          <div
            style={{
              ...styles.plan(false),
              opacity: cardVisible ? 1 : 0,
              transform: cardVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)',
            }}
            tabIndex={0}
            aria-label="Free plan: 10 questions per month, basic AI answers, image-to-text OCR, email support"
          >
            <div style={styles.planIcon} aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="4" fill="#60a5fa"/><path d="M7 9h10M7 13h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div style={styles.planTitle}>Free</div>
            <div style={styles.planPrice}>Ksh 0</div>
            <div style={styles.planDesc}>• 10 questions/month<br/>• Basic AI answers<br/>• Image-to-text OCR<br/>• Email support</div>
          </div>
          <div
            ref={proCardRef}
            style={{
              ...styles.plan(true),
              opacity: cardVisible ? 1 : 0,
              transform: cardVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.7s 0.15s cubic-bezier(.4,0,.2,1), transform 0.7s 0.15s cubic-bezier(.4,0,.2,1)',
              outline: 'none',
            }}
            tabIndex={0}
            aria-label={`Pro plan: unlimited questions, priority AI answers, image & math support, priority support, ${yearly ? 'billed yearly' : 'billed monthly'}`}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') handleSubscribe();
            }}
          >
            <div style={styles.badge}><span role="img" aria-label="star">⭐</span> Most Popular</div>
            <div style={styles.planIcon} aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="4" fill="#6366f1"/><path d="M7 9h10M7 13h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div style={styles.planTitle}>Pro</div>
            <div style={styles.planPrice}>Ksh {proPrice}<span style={{ fontSize: 16, fontWeight: 400 }}>/ {yearly ? 'yr' : 'mo'}</span></div>
            <div style={styles.planDesc}>{proDesc.split('\n').map((line, i) => <div key={i}>{line}</div>)}</div>
            <button
              style={{ ...styles.button, ...(btnHover ? styles.buttonHover : {}) }}
              aria-label={`Subscribe to Pro, ${yearly ? 'yearly' : 'monthly'} billing`}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              onClick={handleSubscribe}
              tabIndex={0}
              disabled={subscribing}
            >
              {subscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </div>
      )}
      {/* Feature Comparison Table */}
      <table style={styles.comparisonTable} aria-label="Feature comparison table">
        <thead>
          <tr>
            <th style={styles.tableHeader}>Feature</th>
            <th style={styles.tableHeader}>Free</th>
            <th style={styles.tableHeader}>Pro</th>
          </tr>
        </thead>
        <tbody>
          {features.map((f, i) => (
            <tr key={f.name}>
              <td style={styles.tableCell}>{f.name}</td>
              <td style={styles.tableCell}>{f.free ? '✔️' : '—'}</td>
              <td style={styles.tableCell}>{f.pro ? '✔️' : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Testimonials */}
      <div style={styles.testimonialSection} aria-label="Testimonials">
        <h3 style={{ color: '#6366f1', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>What Parents Say</h3>
        {testimonials.map((t, i) => (
          <div key={i} style={styles.testimonialCard} tabIndex={0} aria-label={`Testimonial from ${t.name}`}> 
            <img src={t.avatar} alt={t.name} style={styles.testimonialAvatar} />
            <div style={{ fontWeight: 600, color: '#6366f1', marginBottom: 6 }}>{t.name}</div>
            <div>“{t.text}”</div>
          </div>
        ))}
      </div>
      {/* Trust Badges */}
      <div style={styles.trustBadges} aria-label="Trust badges">
        {trustBadges.map((b, i) => (
          <div key={i} style={styles.badge}><span aria-hidden="true">{b.icon}</span> {b.label}</div>
        ))}
      </div>
      {/* Phone Number Modal */}
      {showPhoneModal && (
        <div style={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Enter phone number">
          <div style={styles.modal}>
            <button style={styles.closeModalBtn} aria-label="Close" onClick={() => setShowPhoneModal(false)}>&times;</button>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#6366f1', marginBottom: 8 }}>Enter M-Pesa Phone Number</div>
            <input
              type="text"
              value={phoneInput}
              onChange={e => setPhoneInput(e.target.value)}
              placeholder="2547XXXXXXXX"
              style={{
                width: '100%', padding: 12, fontSize: 16, borderRadius: 8, border: '1.5px solid #6366f1', marginBottom: 12, outline: 'none', textAlign: 'center'
              }}
              autoFocus
              maxLength={12}
            />
            {phoneError && <div style={{ color: '#ef4444', marginBottom: 8 }}>{phoneError}</div>}
            <button
              style={{ ...styles.button, marginTop: 0, width: '100%' }}
              onClick={submitPhone}
              disabled={subscribing}
            >
              {subscribing ? 'Processing...' : 'Continue'}
            </button>
          </div>
        </div>
      )}
      {/* Subscription Modal (Loading/Success) */}
      {showModal && !subscribeError && (
        <div style={styles.modalOverlay} role="dialog" aria-modal="true" aria-label={subscribing ? "Subscription in progress" : "Subscription successful"}>
          <div style={styles.modal}>
            {subscribing ? (
              <>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📲</div>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#6366f1', marginBottom: 8 }}>Check your phone</div>
                <div style={{ fontSize: 16, color: '#222', marginBottom: 12 }}>
                  An M-Pesa prompt has been sent to your phone.<br />Please complete the payment to activate your subscription.
                </div>
                <div style={{ margin: '18px 0' }}>
                  <span style={{
                    display: 'inline-block',
                    width: 32,
                    height: 32,
                    border: '4px solid #e0e7ef',
                    borderTop: '4px solid #6366f1',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></span>
                </div>
              </>
            ) : (
              <>
                <button style={styles.closeModalBtn} aria-label="Close" onClick={() => setShowModal(false)}>&times;</button>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
                <div style={{ fontWeight: 700, fontSize: 20, color: '#6366f1', marginBottom: 8 }}>Subscription Successful!</div>
                <div style={{ fontSize: 16, color: '#222', marginBottom: 12 }}>
                  Thank you for subscribing to the Pro plan.<br />You now have full access to all features.
                </div>
                <button style={{ ...styles.button, marginTop: 8 }} onClick={() => setShowModal(false)} autoFocus>Close</button>
              </>
            )}
          </div>
        </div>
      )}
      {/* Error Modal */}
      {subscribeError && (
        <div style={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Subscription error">
          <div style={styles.modal}>
            <button style={styles.closeModalBtn} aria-label="Close" onClick={() => setSubscribeError("")}>&times;</button>
            <div style={{ fontSize: 32, marginBottom: 12 }}>❌</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#ef4444', marginBottom: 8 }}>Subscription Failed</div>
            <div style={{ fontSize: 16, color: '#222', marginBottom: 12 }}>{subscribeError}</div>
            <button style={{ ...styles.button, background: '#ef4444', marginTop: 8 }} onClick={() => setSubscribeError("")}>Close</button>
          </div>
        </div>
      )}
      {/* Toast notification */}
      {showToast && (
        <div style={styles.toast} role="status" aria-live="polite">Subscription successful!</div>
      )}
    </div>
  );
}

export default PricingPage;
