'use client';

import React, { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LogIn } from 'lucide-react';
import { Oval } from 'react-loader-spinner';

/**
 * The interactive client component for the admin login form.
 */
export function AdminLoginPageClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      // The hook will handle redirection on success
    } catch (err) {
      // The hook will set the error state, which will be displayed
      console.error('Admin login failed');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg text-center">
      <div className="flex justify-center">
        <div className="p-3 bg-indigo-100 rounded-full">
          <LogIn className="w-8 h-8 text-indigo-600" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-900">Admin Portal Login</h2>
      <p className="text-sm text-gray-600">
        Please sign in with your administrative credentials.
      </p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
        )}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            disabled={loading}
          >
            {loading ? (
              <Oval
                height={20}
                width={20}
                color="#fff"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor="#c7d2fe"
                strokeWidth={5}
                strokeWidthSecondary={5}
              />
            ) : (
              'Sign in'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
