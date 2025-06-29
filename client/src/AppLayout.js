import React from 'react';
import { useTheme } from './ThemeContext';
import Header from './components/Header';

function AppLayout({ children }) {
  const { theme } = useTheme();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: theme === 'dark' ? '#181c24' : '#F9FAFB' }}>
      <Header />
      <main style={{ flex: 1, padding: '32px 32px 64px 32px', background: theme === 'dark' ? '#23293a' : '#fff', borderRadius: '1rem', margin: 24, boxShadow: '0 2px 16px 0 rgba(60,60,120,0.08)', minHeight: 0, overflow: 'auto' }}>
        {children}
      </main>
      <footer style={{ width: '100%', height: 56, background: theme === 'dark' ? '#23293a' : '#e0e7ef', color: theme === 'dark' ? '#fff' : '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: 16, letterSpacing: 1, boxShadow: '0 -2px 8px 0 rgba(60,60,120,0.06)', position: 'relative', zIndex: 10 }}>
        &copy; {new Date().getFullYear()} Homework Helper
      </footer>
    </div>
  );
}

export default AppLayout;
