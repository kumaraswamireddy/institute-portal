'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { setAuthToken } from '../apiClient';
import { authApi } from '../api/auth.api'; // Import the new general auth API

// ... (interfaces for User, NewUserData, and AuthContextType remain the same) ...
interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'institute_owner' | 'super_admin' | 'moderator';
  profilePictureUrl?: string;
}
interface NewUserData {
  email: string;
  name: string;
  googleId: string;
  profilePictureUrl?: string;
}
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isNewUser: boolean;
  newUserData: NewUserData | null;
  setAuthState: (user: User | null, token: string | null) => void;
  setRegistrationState: (data: NewUserData | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserData, setNewUserData] = useState<NewUserData | null>(null);

  // =================================================================
  // <<< THE DEFINITIVE FIX >>>
  // This useEffect now runs on app load to validate any existing session.
  // =================================================================
  useEffect(() => {
    const validateSession = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken);
        try {
          const response = await authApi.getMe();
          // The session is valid, sync the state with fresh data from the backend.
          setAuthState(response.data.data, storedToken);
        } catch (error) {
          // The session is invalid (e.g., user deleted). This is the "ghost session" case.
          // We call logout() to clear the stale data from localStorage.
          console.warn('Session validation failed. Clearing stale session.');
          logout();
        }
      }
      setLoading(false);
    };

    validateSession();
  }, []); // The empty dependency array ensures this runs only once on initial mount.


  const setAuthState = (user: User | null, token: string | null) => {
    // ... (this function's logic remains the same) ...
    setUser(user);
    setToken(token);
    setAuthToken(token);

    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    
    // Reset registration flow state
    setIsNewUser(false);
    setNewUserData(null);
  };

  const setRegistrationState = (data: NewUserData | null) => {
    // ... (this function's logic remains the same) ...
    if (data) {
        setIsNewUser(true);
        setNewUserData(data);
    } else {
        setIsNewUser(false);
        setNewUserData(null);
    }
  };
  
  const logout = () => {
    // ... (this function's logic remains the same) ...
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsNewUser(false);
    setNewUserData(null);
    // No router.push here, let the guards handle redirection
  };

  const value = { user, token, loading, isNewUser, newUserData, setAuthState, setRegistrationState, setLoading, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

