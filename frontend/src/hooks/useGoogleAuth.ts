import { useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CredentialResponse } from '@react-oauth/google';
import { AuthContext } from '@/lib/auth/AuthContext';
import { googleAuthApi } from '@/lib/api/googleAuth.api';

/**
 * Hook containing all logic for the public Google Sign-In and registration flow.
 */
export const useGoogleAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useGoogleAuth must be used within an AuthProvider');
  }

  const {
    isNewUser,
    newUserData,
    setAuthState,
    setRegistrationState,
    setLoading: setAuthLoading,
  } = context;

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleSuccess = useCallback(async (credentialResponse: CredentialResponse) => {
    setAuthLoading(true);
    setError(null);
    if (!credentialResponse.credential) {
      setError('Google sign-in failed: No credential received.');
      setAuthLoading(false);
      return;
    }
    try {
      const response = await googleAuthApi.signIn(credentialResponse.credential);
      const { isNewUser, user, token, googleProfile } = response.data.data;

      if (isNewUser) {
        setRegistrationState(googleProfile);
      } else {
        setAuthState(user, token);
        if (user.role === 'student') {
            router.push('/student/dashboard');
        } else if (user.role === 'institute_owner') {
            router.push('/institute/dashboard');
        } else {
            router.push('/');
        }
      }
    } catch (err: any) {
      console.error('Sign-in error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'An error occurred during sign-in.');
    } finally {
      setAuthLoading(false);
    }
  }, [setAuthLoading, setRegistrationState, setAuthState, router]);

  const registerAndLogin = useCallback(async (role: 'student' | 'institute', instituteName?: string) => {
    if (!newUserData) {
      setError('Registration failed: No user data found.');
      return;
    }
    setAuthLoading(true);
    setError(null);
    try {
      const payload = { ...newUserData, role, instituteName, profilePictureUrl: newUserData.profilePictureUrl };
      const response = await googleAuthApi.register(payload);
      
      const { user, token } = response.data.data;
      setAuthState(user, token);
      
      if (role === 'student') {
        router.push('/student/dashboard');
      } else if (role === 'institute') {
        router.push('/institute/dashboard');
      }

    } catch (err: any) {
      console.error('Registration API Error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Registration failed. Please check the console for details.');
    } finally {
        setAuthLoading(false);
    }
  }, [newUserData, setAuthLoading, setAuthState, router]);

  return {
    handleGoogleSuccess,
    registerAndLogin,
    error,
    isNewUser,
    newUserData,
    loading: context.loading
  };
};