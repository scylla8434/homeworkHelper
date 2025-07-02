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
        <span>&copy; {new Date().getFullYear()} Homework Helper</span>
        <span style={{ marginLeft: 18, display: 'flex', gap: 12 }}>
          <a href="https://github.com/scylla8434" target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/amalemba-anangwe-a961b721b" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
          </a>
        </span>
      </footer>
    </div>
  );
}

export default AppLayout;
