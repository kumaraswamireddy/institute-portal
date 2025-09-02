'use client';

import { useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/auth/AuthContext';
import { adminAuthApi } from '@/lib/api/adminAuth.api';

/**
 * Hook containing all logic for the admin email/password login flow.
 */
export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AuthProvider');
  }

  const { setAuthState, setLoading: setAuthLoading } = context;

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = useCallback(async (email: string, password: string) => {
    setAuthLoading(true);
    setError(null);
    try {
      const response = await adminAuthApi.login(email, password);
      const { user, token } = response.data.data;
      setAuthState(user, token);
      
      // =================================================================
      // <<< THE DEFINITIVE FIX >>>
      // After a successful login, redirect the admin to their dashboard.
      // =================================================================
      router.push('/admin/dashboard'); 

    } catch (err: any) {
      console.error('Admin login error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Admin login failed.');
      throw err; // Re-throw to be caught in the component if needed
    } finally {
      setAuthLoading(false);
    }
  }, [setAuthLoading, setAuthState, router]);

  return { login, error, loading: context.loading };
};

