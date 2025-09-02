'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building,
  Users,
  ShieldAlert,
  FileText,
  Settings,
  UserCog,
  ShieldCheck,
  LogOut,
  BookOpen,
  ShoppingBag,
  Bell,
} from 'lucide-react';
import { useAuthSession } from '@/hooks/useAuthSession';

const SidebarLink = ({ href, icon: Icon, children }: { href: string; icon: React.ElementType; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={`flex items-center rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200 ${
        isActive ? 'bg-gray-200 font-semibold' : ''
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{children}</span>
    </Link>
  );
};

export function Sidebar() {
  const { logout } = useAuthSession();

  const navLinks = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/dashboard/institutes", icon: Building, label: "Institutes" },
    { href: "/admin/dashboard/students", icon: Users, label: "Students" },
    { href: "/admin/dashboard/users", icon: UserCog, label: "Admin Users" },
    { href: "/admin/dashboard/roles", icon: ShieldCheck, label: "Roles" },
    { href: "/admin/dashboard/moderation", icon: ShieldAlert, label: "Moderation" },
    { href: "/admin/dashboard/blog-cms", icon: FileText, label: "Blog & CMS" },
    { href: "/admin/dashboard/notifications", icon: Bell, label: "Notifications" },
    { href: "/admin/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="hidden w-64 flex-col border-r bg-gray-100 p-4 md:flex">
      <div className="flex items-center mb-6">
        <ShieldCheck className="h-8 w-8 text-indigo-600" />
        <h1 className="ml-2 text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => (
          <SidebarLink key={link.href} href={link.href} icon={link.icon}>
            {link.label}
          </SidebarLink>
        ))}
      </nav>
      <div>
        <button
          onClick={logout}
          className="flex w-full items-center rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
