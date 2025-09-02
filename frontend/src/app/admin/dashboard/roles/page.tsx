'use client';
import React from 'react';
import { useAuth } from '../../../../lib/AuthContext'; // Corrected to relative path
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

const roles = [
    { name: 'Super Admin', description: 'Unrestricted access to all platform features.', permissions: 25 },
    { name: 'Manager', description: 'Can manage institutes, courses, and content.', permissions: 15 },
    { name: 'Content Moderator', description: 'Can only approve/reject reviews and Q&A.', permissions: 4 },
    { name: 'Viewer', description: 'Read-only access to platform analytics.', permissions: 2 },
];

export default function RoleManagementPage() {
    const { currentUser } = useAuth();
    const router = useRouter();

    // This is a client-side route guard. A backend middleware is also essential.
    if (currentUser && currentUser.role !== 'super_admin') {
        router.push('/admin/dashboard'); // Redirect if not a super admin
        return null; // Render nothing while redirecting
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Role & Permission Management</h2>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Create New Role
                </button>
            </div>
             <div className="p-4 mt-4 text-sm text-yellow-800 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg" role="alert">
                <div className="flex items-center">
                    <ShieldAlert className="w-5 h-5 mr-3"/>
                    <p><span className="font-bold">Security Notice:</span> Changes here directly impact admin capabilities. Proceed with caution.</p>
                </div>
            </div>
            <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Role Name</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Description</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Permissions Count</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {roles.map(role => (
                                <tr key={role.name}>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">{role.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{role.description}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{role.permissions}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                        <button className="text-blue-600 hover:text-blue-900" disabled={role.name === 'Super Admin'}>
                                            Edit
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

