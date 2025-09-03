import { GuestGuard } from '@/components/auth/GuestGuard';
// Corrected: Use a named import to match the component's export
import { LoginPageClient } from '@/components/auth/LoginPageClient';
import React from 'react';

/**
 * The public login page.
 * It is wrapped in a GuestGuard to prevent authenticated users from accessing it.
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <GuestGuard>
        <LoginPageClient />
      </GuestGuard>
    </main>
  );
}

