'use client';

import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { User, Building, Loader2 } from 'lucide-react';

/**
 * This component now uses the new, focused hooks for its logic.
 */
const LoginPageClient = () => {
  const { loading } = useAuthSession(); // For the global loading state
  const { handleGoogleSuccess, registerAndLogin, error, isNewUser, newUserData } = useGoogleAuth();
  
  const [selectedRole, setSelectedRole] = useState<'student' | 'institute' | null>(null);
  const [instituteName, setInstituteName] = useState('');

  const handleRegister = () => {
    if (selectedRole) {
      registerAndLogin(selectedRole, instituteName);
    }
  };
  
  // The rest of the component's JSX remains exactly the same...

  if (loading) {
    return (
        <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-gray-500" />
            <p className="mt-4 text-lg text-gray-700">Signing in...</p>
        </div>
    );
  }

  if (isNewUser && newUserData) {
    return (
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {newUserData.name}!</h2>
        <p className="text-gray-600">Complete your registration by choosing your role.</p>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setSelectedRole('student')}
            className={`flex flex-col items-center p-4 border-2 rounded-lg w-32 transition-all ${selectedRole === 'student' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <User className="h-8 w-8 text-blue-500 mb-2" />
            <span className="font-semibold">Student</span>
          </button>
          <button
            onClick={() => setSelectedRole('institute')}
            className={`flex flex-col items-center p-4 border-2 rounded-lg w-32 transition-all ${selectedRole === 'institute' ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
          >
            <Building className="h-8 w-8 text-green-500 mb-2" />
            <span className="font-semibold">Institute</span>
          </button>
        </div>
        
        {selectedRole === 'institute' && (
          <div className="text-left pt-2">
            <label htmlFor="instituteName" className="block text-sm font-medium text-gray-700">
              Institute Name
            </label>
            <input
              id="instituteName"
              type="text"
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              placeholder="e.g., The Grand Academy"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={!selectedRole || (selectedRole === 'institute' && !instituteName)}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          Complete Registration
        </button>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg text-center">
        <div className="relative flex justify-center items-center">
            <User className="h-10 w-10 text-blue-500 z-10 bg-white p-1 rounded-full border-2 border-white" />
            <div className="absolute h-1 w-12 bg-gray-200"></div>
            <Building className="h-10 w-10 text-green-500 z-10 bg-white p-1 rounded-full border-2 border-white" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">Student & Institute Portal</h2>
        <p className="mt-2 text-sm text-gray-600">
            Sign in or create an account with your Google account.
        </p>
        
        <div className="flex justify-center pt-4">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                    console.error('Google Login Failed');
                }}
            />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default LoginPageClient;

