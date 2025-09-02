import { useContext, useState } from 'react';
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

    const adminLogin = async (email: string, password: string) => {
        setAuthLoading(true);
        setError(null);
        try {
            const response = await adminAuthApi.login(email, password);
            setAuthState(response.data.user, response.data.token);
            router.push('/admin/dashboard');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Admin login failed.';
            setError(errorMessage);
            throw new Error(errorMessage); // Re-throw for form handling
        } finally {
            setAuthLoading(false);
        }
    };

    return {
        error,
        adminLogin,
    };
};
