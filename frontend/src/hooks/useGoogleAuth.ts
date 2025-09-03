// ... (imports and hook setup remain the same) ...
import { useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { CredentialResponse } from '@react-oauth/google';
import { AuthContext } from '@/lib/auth/AuthContext';
import { googleAuthApi } from '@/lib/api/googleAuth.api';

// Updated: mobileNo is no longer optional in this interface.
interface RegistrationPayload {
    role: 'student' | 'institute';
    fullName: string;
    mobileNo: string;
    instituteName?: string;
}

export const useGoogleAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useGoogleAuth must be used within an AuthProvider');
    }
    const {
        setAuthState,
        setRegistrationState,
        setLoading: setAuthLoading,
        newUserData,
    } = context;
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLoginSuccess = useCallback(async (credentialResponse: CredentialResponse) => {
        // ... (this function's logic remains the same) ...
        setAuthLoading(true);
        setError(null);
        if (!credentialResponse.credential) {
          setError('Google sign-in failed: No credential received.');
          setAuthLoading(false);
          return;
        }
        try {
          const response = await googleAuthApi.signIn(credentialResponse.credential);
          const { isNewUser, user, token, googleProfile, role } = response.data.data;
    
          if (isNewUser) {
            setRegistrationState(googleProfile);
          } else {
            setAuthState(user, token);
            if (role === 'student') {
                router.push('/student/dashboard');
            } else if (role === 'institute_owner') {
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

    const registerAndLogin = useCallback(async (payload: RegistrationPayload) => {
        // ... (this function's logic remains largely the same) ...
        if (!newUserData) {
            setError('Registration failed: No user data found.');
            return;
        }
        setAuthLoading(true);
        setError(null);
        try {
            const apiPayload = {
                ...newUserData,
                ...payload,
            };
            const response = await googleAuthApi.register(apiPayload);
            const { user, token, role } = response.data.data;
            setAuthState(user, token);

            if (role === 'student') {
                router.push('/student/dashboard');
            } else if (role === 'institute_owner') {
                router.push('/institute/dashboard');
            }
        } catch (err: any) {
            console.error('Registration API Error:', err.response?.data || err);
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setAuthLoading(false);
        }
    }, [newUserData, setAuthLoading, setAuthState, router]);

    return {
        handleLoginSuccess,
        registerAndLogin,
        error,
        isNewUser: context.isNewUser,
        newUserData: context.newUserData,
        isLoading: context.loading
    };
};

