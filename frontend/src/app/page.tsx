import React from 'react';
import Link from 'next/link';
import { Shield, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8">
        <BookOpen className="mx-auto h-16 w-16 text-blue-600" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Institute Management Portal
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Your one-stop destination to find and manage the best educational institutes.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Find an Institute or Login
          </Link>
          <Link
            href="/admin/login"
            className="text-sm font-semibold leading-6 text-gray-900 group flex items-center"
          >
            Admin Portal <span aria-hidden="true" className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
