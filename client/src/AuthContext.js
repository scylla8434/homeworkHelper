import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [lastActive, setLastActive] = useState(Date.now());
  const navigate = useNavigate();
  const location = useLocation();

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Track activity for auto-logout
  useEffect(() => {
    const updateActivity = () => setLastActive(Date.now());
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, []);

  // Auto-logout after 5 minutes idle
  useEffect(() => {
    if (!user) return;
    const timeout = setTimeout(() => {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.setItem('redirectAfterLogin', location.pathname);
      navigate('/login');
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearTimeout(timeout);
  }, [lastActive, user, navigate, location.pathname]);

  // Login function
  const login = useCallback((userData) => {
    setUser(userData);
    // Redirect to last page or home
    const redirect = localStorage.getItem('redirectAfterLogin') || '/';
    localStorage.removeItem('redirectAfterLogin');
    navigate(redirect);
  }, [navigate]);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  // Update user info (e.g. after profile update)
  const updateUser = useCallback((newUser) => {
    setUser(newUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
