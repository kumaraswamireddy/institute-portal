import { GuestGuard } from '@/components/auth/GuestGuard';
import { AdminLoginPageClient } from '@/components/auth/AdminLoginPageClient';
import React from 'react';

/**
 * The admin login page.
 * Wrapped in a GuestGuard to prevent authenticated admins from seeing it.
 */
export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <GuestGuard>
        <AdminLoginPageClient />
      </GuestGuard>
    </main>
  );
}
