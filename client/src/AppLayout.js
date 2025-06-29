import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';
import Header from './components/Header';

const onboardingStyles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(60,60,120,0.18)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 8px 32px 0 rgba(99,102,241,0.18)',
    padding: '36px 32px',
    minWidth: 320,
    maxWidth: 400,
    textAlign: 'center',
    zIndex: 2001,
    position: 'relative',
  },
  closeBtn: {
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
  title: {
    fontWeight: 800,
    fontSize: 26,
    color: '#6366f1',
    marginBottom: 12,
  },
  step: {
    fontSize: 16,
    color: '#222',
    margin: '18px 0',
    textAlign: 'left',
    lineHeight: 1.7,
  },
  actionBtn: {
    marginTop: 18,
    padding: '12px 0',
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
  skipBtn: {
    marginTop: 10,
    background: 'none',
    border: 'none',
    color: '#6366f1',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

function OnboardingModal({ onClose }) {
  const steps = [
    {
      icon: '🤖',
      text: 'Ask homework questions and get instant AI-powered answers.'
    },
    {
      icon: '📷',
      text: 'Snap a photo of homework for image-to-text OCR and math help.'
    },
    {
      icon: '💬',
      text: 'Chat with the AI or review your question history anytime.'
    },
    {
      icon: '👤',
      text: 'Manage your profile, subscription, and settings from the dashboard.'
    },
  ];
  const [step, setStep] = useState(0);
  return (
    <div style={onboardingStyles.overlay} role="dialog" aria-modal="true" aria-label="Welcome to Homework Helper">
      <div style={onboardingStyles.modal}>
        <button style={onboardingStyles.closeBtn} aria-label="Close" onClick={onClose}>&times;</button>
        <div style={onboardingStyles.title}>Welcome to Homework Helper!</div>
        <div style={{ fontSize: 18, color: '#222', marginBottom: 10 }}>Let’s get you started:</div>
        <div style={onboardingStyles.step}>
          <span style={{ fontSize: 28, marginRight: 10 }}>{steps[step].icon}</span>
          {steps[step].text}
        </div>
        <button
          style={onboardingStyles.actionBtn}
          onClick={() => step < steps.length - 1 ? setStep(step + 1) : onClose()}
          autoFocus
        >
          {step < steps.length - 1 ? 'Next' : 'Get Started'}
        </button>
        <button style={onboardingStyles.skipBtn} onClick={onClose}>Skip</button>
      </div>
    </div>
  );
}

function AppLayout({ children }) {
  const { theme } = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('hh_onboarding_seen')) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('hh_onboarding_seen', '1');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: theme === 'dark' ? '#181c24' : '#F9FAFB' }}>
      <Header />
      <main style={{ flex: 1, padding: '32px 32px 64px 32px', background: theme === 'dark' ? '#23293a' : '#fff', borderRadius: '1rem', margin: 24, boxShadow: '0 2px 16px 0 rgba(60,60,120,0.08)', minHeight: 0, overflow: 'auto' }}>
        {children}
        {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
      </main>
      <footer style={{ width: '100%', height: 56, background: theme === 'dark' ? '#23293a' : '#e0e7ef', color: theme === 'dark' ? '#fff' : '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: 16, letterSpacing: 1, boxShadow: '0 -2px 8px 0 rgba(60,60,120,0.06)', position: 'relative', zIndex: 10 }}>
        &copy; {new Date().getFullYear()} Homework Helper
      </footer>
    </div>
  );
}

export default AppLayout;
