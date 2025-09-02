import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/lib/auth/AuthContext';

/**
 * Hook for accessing core auth state and session management functions.
 */
export const useAuthSession = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthSession must be used within an AuthProvider');
  }
  const router = useRouter();
  const { user, token, loading, clearAuthState, hasPermission: contextHasPermission } = context;

  const logout = () => {
    clearAuthState();
    router.push('/');
  };
  
  const hasPermission = (permission: string): boolean => {
      return user?.permissions?.includes(permission) ?? false;
  };

  return {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    logout,
    hasPermission,
  };
};
