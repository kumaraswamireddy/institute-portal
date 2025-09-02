'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Oval } from 'react-loader-spinner';

/**
 * A guard component that redirects authenticated users away from guest-only pages (e.g., login, register).
 */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // User is logged in, redirect them to their appropriate dashboard.
      if (user.role === 'student') {
        router.push('/student/dashboard');
      } else if (user.role === 'institute_owner') {
        router.push('/institute/dashboard');
      } else {
        router.push('/'); // Fallback redirect
      }
    }
  }, [user, loading, router]);

  // While checking the session, show a loading spinner to prevent flashes of content.
  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Oval color="#4f46e5" height={50} width={50} />
      </div>
    );
  }

  // If not loading and no user, it's a guest, so render the page.
  return <>{children}</>;
}
