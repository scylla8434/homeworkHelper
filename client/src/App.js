import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PricingPage from './pages/PricingPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AppLayout from './AppLayout';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <AppLayout>
                <HomePage />
              </AppLayout>
            }
          />
          <Route
            path="/chat"
            element={
              <AppLayout>
                <ChatPage />
              </AppLayout>
            }
          />
          <Route
            path="/pricing"
            element={
              <AppLayout>
                <PricingPage />
              </AppLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
