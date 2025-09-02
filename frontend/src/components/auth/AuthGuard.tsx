'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Oval } from 'react-loader-spinner';

/**
 * A guard component that protects routes requiring authentication.
 * It redirects unauthenticated users to the login page.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthSession();
  const router = useRouter();

  useEffect(() => {
    // If the session has been checked and there is no user, redirect to login.
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  // While checking the session, show a full-screen loading spinner.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Oval color="#4f46e5" height={50} width={50} />
      </div>
    );
  }

  // If a user is found, render the protected page content.
  if (user) {
    return <>{children}</>;
  }

  // If no user and not loading (i.e., during the redirect), render nothing to prevent content flashes.
  return null;
}
