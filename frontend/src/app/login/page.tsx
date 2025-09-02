'use client';

import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { ShieldCheck, User, Building } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext'; // This context will handle the Google login logic

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

function UnifiedLoginPageContent() {
    // This function will be implemented in your AuthContext to handle the logic
    const { handleGoogleSuccess, error } = useAuth(); 

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg text-center">
                <div className="relative flex justify-center items-center">
                    <User className="h-10 w-10 text-blue-500 z-10 bg-white p-1 rounded-full border-2 border-white" />
                    <div className="absolute h-1 w-12 bg-gray-200"></div>
                    <Building className="h-10 w-10 text-green-500 z-10 bg-white p-1 rounded-full border-2 border-white" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Student & Institute Portal</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Sign in with your Google account to access your dashboard.
                </p>
                
                <div className="flex justify-center pt-4">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            console.error('Google Login Failed');
                        }}
                        useOneTap
                    />
                </div>

                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </div>
        </div>
    );
}

export default function UnifiedLoginPage() {
    if (!GOOGLE_CLIENT_ID) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-red-500">Error: Google Client ID is not configured in environment variables.</p>
            </div>
        );
    }
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <UnifiedLoginPageContent />
        </GoogleOAuthProvider>
    );
}
