'use client';

import { AuthProvider } from "@/lib/auth/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

/**
 * This is a dedicated client component to manage all client-side context providers.
 */
export function Providers({ children }: { children: React.ReactNode }) {
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!GOOGLE_CLIENT_ID) {
        // This check is important to provide a clear error during development
        // if the environment variable is missing.
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'red', fontSize: '1.2rem', fontFamily: 'sans-serif' }}>
                <h1>Configuration Error</h1>
                <p>The Google Client ID is missing. Please check your .env.local file and ensure NEXT_PUBLIC_GOOGLE_CLIENT_ID is set correctly.</p>
            </div>
        );
    }
    
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </GoogleOAuthProvider>
    );
}
