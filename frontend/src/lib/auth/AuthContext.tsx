'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { setAuthToken } from '../apiClient';

// The unified User type remains the same
interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'institute_owner' | 'super_admin' | 'moderator';
  permissions?: string[];
}

// State for the new user registration flow
interface NewUserData {
  email: string;
  name: string;
  googleId: string;
  profilePictureUrl?: string;
}

// The context now holds state and simple updater functions
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isNewUser: boolean;
  newUserData: NewUserData | null;
  setAuthState: (user: User, token: string) => void;
  clearAuthState: () => void;
  setRegistrationState: (data: NewUserData) => void;
  clearRegistrationState: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserData, setNewUserData] = useState<NewUserData | null>(null);

  // Effect to rehydrate auth state from localStorage on initial load
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setAuthState(parsedUser, storedToken);
      }
    } catch (e) {
      console.error("Failed to parse auth data from localStorage", e);
      clearAuthState();
    }
    setLoading(false);
  }, []);

  // Sets the full authenticated state and persists it
  const setAuthState = (userData: User, authToken: string) => {
    const userToStore = { ...userData, name: userData.name || (userData as any).stu_full_name || (userData as any).owner_full_name };
    localStorage.setItem('user', JSON.stringify(userToStore));
    localStorage.setItem('token', authToken);
    setUser(userToStore);
    setToken(authToken);
    setAuthToken(authToken);
    clearRegistrationState();
  };
  
  // Clears the authenticated state from memory and persistence
  const clearAuthState = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setAuthToken(null);
    clearRegistrationState();
  };

  // Sets the state for a new user registration flow
  const setRegistrationState = (data: NewUserData) => {
      setNewUserData(data);
      setIsNewUser(true);
  };
  
  // Clears the registration flow state
  const clearRegistrationState = () => {
      setIsNewUser(false);
      setNewUserData(null);
  };

  const value = {
    user,
    token,
    loading,
    isNewUser,
    newUserData,
    setAuthState,
    clearAuthState,
    setRegistrationState,
    clearRegistrationState,
    setLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
