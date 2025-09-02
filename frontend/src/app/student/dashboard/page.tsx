'use client';
import React from 'react';

export default function StudentDashboardPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to your Student Dashboard</h1>
        <p className="text-gray-600">This is your personal space to manage your courses, applications, and profile.</p>
        {/* TODO: Add student-specific components and data here */}
      </div>
    </div>
  );
}