// app/context/AuthContext.js
"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status when the app loads
    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('https://real-estate-scraper-api.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setUser(data);
      router.push('/'); // Redirect to home page after successful login
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('https://real-estate-scraper-api.onrender.com/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setUser(null);
      router.push('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('https://real-estate-scraper-api.onrender.com/auth/check', {
        method: 'GET',
        credentials: 'include',
      });
  
      const adminResponse = await fetch('https://real-estate-scraper-api.onrender.com/auth/check-admin', {
        method: 'GET',
        credentials: 'include',
      });
  
      const isAdminData = await adminResponse.json();
  
      if (response.ok) {
        const userData = await response.json();
        console.log('User Data:', userData);
        
        setUser({ ...userData, isAdmin: isAdminData.is_admin });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};