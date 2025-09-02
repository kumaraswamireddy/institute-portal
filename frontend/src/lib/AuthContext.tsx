'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { CredentialResponse } from '@react-oauth/google';
import { adminAuthApi } from './api/adminAuth.api';
import { googleAuthApi } from './api/googleAuth.api';
import { setAuthToken } from './apiClient'; // Import the new token setter

// Define a unified User type
interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'institute_owner' | 'super_admin' | 'moderator';
  permissions?: string[]; // Permissions for admins
}

// State for new user registration flow
interface NewUserData {
  email: string;
  name: string;
  googleId: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isNewUser: boolean;
  newUserData: NewUserData | null;
  login: (email: string, password: string) => Promise<void>;
  handleGoogleSuccess: (credentialResponse: CredentialResponse) => Promise<void>;
  registerAndLogin: (role: 'student' | 'institute', instituteName?: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean; // For RBAC
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isNewUser, setIsNewUser] = useState(false);
    const [newUserData, setNewUserData] = useState<NewUserData | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setAuthToken(storedToken); // Set token in axios headers on initial load
        }
        setLoading(false);
    }, []);

    const hasPermission = (permission: string): boolean => {
        return user?.permissions?.includes(permission) ?? false;
    };

    const handleLoginSuccess = (userData: User, userToken: string) => {
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(userToken);
        setUser(userData);
        setAuthToken(userToken); // Set token in axios headers on login
        setError(null);
        setIsNewUser(false);
        setNewUserData(null);

        if (userData.role.includes('admin')) {
            router.push('/admin/dashboard');
        } else if (userData.role === 'institute_owner') {
            router.push('/institute/dashboard');
        } else {
            router.push('/student/dashboard');
        }
    };

    const login = async (email: string, password: string) => {
        setError(null);
        try {
            const response = await adminAuthApi.login(email, password);
            handleLoginSuccess(response.data.user, response.data.token);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Admin login failed.');
            throw err;
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        setError(null);
        if (!credentialResponse.credential) {
            setError('Google sign-in failed. Please try again.');
            return;
        }
        try {
            const response = await googleAuthApi.signIn(credentialResponse.credential);
            const { isNewUser: newFlag, token: userToken, user: userData, ...newUserTempData } = response.data;

            if (newFlag) {
                setIsNewUser(true);
                setNewUserData(newUserTempData);
            } else {
                handleLoginSuccess(userData, userToken);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Google sign-in failed.');
        }
    };

    const registerAndLogin = async (role: 'student' | 'institute', instituteName?: string) => {
        if (!newUserData) {
            setError('Registration failed: No user data found.');
            return;
        }
        setError(null);
        try {
            const payload = { ...newUserData, role, instituteName };
            const response = await googleAuthApi.register(payload);
            handleLoginSuccess(response.data.user, response.data.token);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        setAuthToken(null); // Clear token from axios headers
        router.push('/login');
    };

    const value = {
        user,
        token,
        loading,
        error,
        isNewUser,
        newUserData,
        login,
        handleGoogleSuccess,
        registerAndLogin,
        logout,
        hasPermission,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

