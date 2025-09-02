'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../lib/AuthContext'; // Corrected to relative path
import { Users, FileDown, PlusCircle, Search } from 'lucide-react';

// Mock data updated with mobile numbers
const initialStudents = [
  { id: 'S001', name: 'Aarav Sharma', email: 'aarav.sharma@example.com', phone: '9876543210', city: 'Mumbai', joined: '2023-01-15', status: 'Active' },
  { id: 'S002', name: 'Vivaan Singh', email: 'vivaan.singh@example.com', phone: '9123456780', city: 'Delhi', joined: '2023-02-20', status: 'Active' },
  { id: 'S003', name: 'Aditya Kumar', email: 'aditya.kumar@example.com', phone: '8901234567', city: 'Bangalore', joined: '2023-03-10', status: 'Inactive' },
  { id: 'S004', name: 'Arjun Gupta', email: 'arjun.gupta@example.com', phone: '7890123456', city: 'Hyderabad', joined: '2023-04-05', status: 'Active' },
  { id: 'S005', name: 'Sai Prasad', email: 'sai.prasad@example.com', phone: '6789012345', city: 'Chennai', joined: '2023-05-21', status: 'Active' },
];

export default function StudentManagementPage() {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState(initialStudents);

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const results = initialStudents.filter(student =>
      student.name.toLowerCase().includes(lowercasedTerm) ||
      student.email.toLowerCase().includes(lowercasedTerm) ||
      student.phone.includes(searchTerm) // Direct check for phone number
    );
    setFilteredStudents(results);
  }, [searchTerm]);

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <FileDown className="h-4 w-4" />
            Export
          </button>
          {hasPermission('user:create') && (
            <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
              <PlusCircle className="h-4 w-4" />
              Add Student
            </button>
          )}
        </div>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or mobile no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name & Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">City</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Joined Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                      <div className="text-sm text-gray-500">{student.phone}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{student.city}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{student.joined}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                     <button className="rounded-md bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200">
                        View Profile
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

