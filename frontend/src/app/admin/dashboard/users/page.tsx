'use client';

import React from 'react';
import { useAuth } from '../../../../lib/AuthContext'; // Corrected to relative path
import { Users, PlusCircle, MoreVertical, ShieldCheck, Eye, Edit } from 'lucide-react';

// Mock data for demonstration
const adminUsers = [
  { id: 'U001', name: 'Alice Johnson', email: 'alice.j@eduportal.com', role: 'super_admin', lastLogin: '2024-08-15 09:00 AM', status: 'Active' },
  { id: 'U002', name: 'Bob Williams', email: 'bob.w@eduportal.com', role: 'manager', lastLogin: '2024-08-14 03:20 PM', status: 'Active' },
  { id: 'U003', name: 'Charlie Brown', email: 'charlie.b@eduportal.com', role: 'viewer', lastLogin: '2024-08-15 11:05 AM', status: 'Active' },
  { id: 'U004', name: 'Diana Miller', email: 'diana.m@eduportal.com', role: 'manager', lastLogin: '2024-08-13 01:00 PM', status: 'Inactive' },
];

const roleIcons = {
  super_admin: <ShieldCheck className="mr-2 h-4 w-4 text-red-500" />,
  manager: <Edit className="mr-2 h-4 w-4 text-blue-500" />,
  viewer: <Eye className="mr-2 h-4 w-4 text-green-500" />,
};

export default function AdminUserManagementPage() {
  const { hasPermission } = useAuth();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin User Management</h1>
        {hasPermission('admin:create') && (
          <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
            <PlusCircle className="h-4 w-4" />
            Add Admin User
          </button>
        )}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Last Login</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {adminUsers.map((user) => (
                <tr key={user.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center text-sm capitalize text-gray-700">
                      {roleIcons[user.role as keyof typeof roleIcons]}
                      {user.role.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.lastLogin}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

