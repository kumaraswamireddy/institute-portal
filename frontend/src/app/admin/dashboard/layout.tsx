'use client';

import React from 'react';
import Link from 'next/link'; // Verified correct import for Next.js App Router
import { usePathname } from 'next/navigation'; // Verified correct import for Next.js App Router
import { 
  LayoutDashboard, 
  Building, 
  Users, 
  ShieldAlert, 
  FileText, 
  Settings, 
  Bell,
  UserCog,
  ShieldCheck,
  LogOut,
  UserCircle,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const SidebarLink = ({ href, icon: Icon, children }: { href: string, icon: React.ElementType, children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link href={href}>
      <span className={`flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}>
        <Icon className="mr-3 h-5 w-5" />
        {children}
      </span>
    </Link>
  );
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  const navLinks = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/dashboard/institutes", icon: Building, label: "Institutes" },
    { href: "/admin/dashboard/students", icon: Users, label: "Students" },
    { href: "/admin/dashboard/moderation", icon: ShieldAlert, label: "Moderation" },
    { href: "/admin/dashboard/notifications", icon: Bell, label: "Notifications" },
    { href: "/admin/dashboard/blog-cms", icon: FileText, label: "Blog CMS" },
    { href: "/admin/dashboard/users", icon: UserCog, label: "Admin Users" },
    { href: "/admin/dashboard/roles", icon: ShieldCheck, label: "Roles" },
    { href: "/admin/dashboard/settings", icon: Settings, label: "Site Settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar from old code */}
      <aside className="hidden w-64 flex-shrink-0 bg-white border-r border-gray-200 md:block">
         <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
                <h1 className="ml-3 text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
              {navLinks.map(link => (
                <SidebarLink key={link.href} href={link.href} icon={link.icon}>
                  {link.label}
                </SidebarLink>
              ))}
            </nav>
            <div className="px-4 py-4 border-t border-gray-200">
                <a href="#" onClick={logout}
                    className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900">
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </a>
            </div>
        </div>
      </aside>

      {/* Main content with Header from old code */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200">
             <div className="px-6 py-3">
                <div className="flex items-center justify-end">
                    <div className="flex items-center ml-6">
                        <button className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none">
                            <Bell className="w-6 h-6" />
                        </button>
                        <div className="relative ml-4">
                            <button className="flex items-center focus:outline-none">
                                <UserCircle className="w-8 h-8 text-gray-600" />
                                <span className="hidden ml-2 text-sm font-medium text-gray-700 md:block">{user?.email}</span>
                                <ChevronDown className="hidden w-4 h-4 ml-1 text-gray-500 md:block" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

