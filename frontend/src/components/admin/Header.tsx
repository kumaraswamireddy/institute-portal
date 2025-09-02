'use client';

import React from 'react';
import { Bell, UserCircle, ChevronDown, Menu } from 'lucide-react';
import { useAuthSession } from '@/hooks/useAuthSession';

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuthSession();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
       <button onClick={onMenuClick} className="md:hidden p-2 text-gray-600">
            <Menu className="h-6 w-6" />
        </button>
      <div className="flex-1">
        {/* Can add search bar or other header elements here */}
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
          <Bell className="h-6 w-6" />
        </button>
        <div className="relative">
          <button className="flex items-center space-x-2">
            <UserCircle className="h-8 w-8 text-gray-600" />
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-800">{user?.name || 'Admin'}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-gray-500 md:block" />
          </button>
          {/* Dropdown menu can be added here */}
        </div>
      </div>
    </header>
  );
}
