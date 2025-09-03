'use client';

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { Oval } from 'react-loader-spinner';
import { RegistrationForm } from './RegistrationForm'; // Import the new component

export function LoginPageClient() {
  const { handleLoginSuccess, error, isLoading, isNewUser, newUserData } = useGoogleAuth();

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Oval color="#4f46e5" height={50} width={50} />
        </div>
      ) : isNewUser && newUserData ? (
        // If the user is new, render the detailed registration form
        <RegistrationForm />
      ) : (
        // Otherwise, show the standard Google login prompt
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in with your Google account to continue.</p>
            <div className="flex justify-center pt-6">
                <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => console.error('Google Login Failed')}
                    useOneTap
                />
            </div>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
      )}
    </div>
  );
}

