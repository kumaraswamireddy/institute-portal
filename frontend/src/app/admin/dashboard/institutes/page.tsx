'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../lib/AuthContext';
import { PlusCircle, Search, FileDown, CheckCircle2, Clock, MoreVertical } from 'lucide-react';
import { instituteApi } from '../../../../lib/api';
import { Institute } from '../../../../../../backend/src/api/v1/models/institute.model'; // Adjust path as needed

// Extend the Institute type to include an 'owner' property for the frontend
type InstituteWithOwner = Institute & { owner: string };


export default function InstituteManagementPage() {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [institutes, setInstitutes] = useState<InstituteWithOwner[]>([]);
  const [filteredInstitutes, setFilteredInstitutes] = useState<InstituteWithOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        setLoading(true);
        // This is a temporary solution for the 'owner' field.
        // In a real app, the backend API should return the owner's name.
        const fetchedInstitutes = await instituteApi.getAll();
        const institutesWithOwners = fetchedInstitutes.map(inst => ({
            ...inst,
            owner: 'Placeholder Owner' // Replace with actual data when backend is ready
        }));
        setInstitutes(institutesWithOwners);
        setFilteredInstitutes(institutesWithOwners);
        setError(null);
      } catch (err) {
        setError('Failed to fetch institutes.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstitutes();
  }, []);


  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const results = institutes.filter(institute =>
      institute.inst_name.toLowerCase().includes(lowercasedTerm) ||
      institute.inst_institute_id.toLowerCase().includes(lowercasedTerm) ||
      institute.inst_city.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredInstitutes(results);
  }, [searchTerm, institutes]);

  const getStatusChipClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'disabled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleDelete = async (instituteId: string) => {
      if (window.confirm('Are you sure you want to delete this institute?')) {
          try {
              await instituteApi.remove(instituteId);
              setInstitutes(prev => prev.filter(inst => inst.inst_institute_id !== instituteId));
          } catch (error) {
              alert('Failed to delete institute.');
              console.error(error);
          }
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Institute Management</h1>
        <div className="flex items-center gap-4">
            {hasPermission('institute:create') && (
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Institute
                </button>
            )}
            <button className="flex flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              <FileDown className="h-4 w-4" />
              <span>Export</span>
            </button>
        </div>
      </div>
      
      <div className="rounded-xl border border-gray-200 bg-white shadow-lg">
        <div className="border-b border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by institute name, ID, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Institute Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">City</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Owner</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Verified</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading && <tr><td colSpan={6} className="p-6 text-center text-gray-500">Loading...</td></tr>}
              {error && <tr><td colSpan={6} className="p-6 text-center text-red-500">{error}</td></tr>}
              {!loading && !error && filteredInstitutes.map((institute) => (
                <tr key={institute.inst_institute_id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{institute.inst_name}</div>
                    <div className="text-xs text-gray-500">ID: {institute.inst_institute_id.substring(0, 8)}...</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{institute.inst_city}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{institute.owner}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusChipClass(institute.inst_status)}`}>
                      {institute.inst_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {institute.inst_is_verified ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex items-center gap-4">
                      {hasPermission('institute:edit') && (
                        <button className="font-semibold text-blue-600 hover:text-blue-800">
                          Edit
                        </button>
                      )}
                      {hasPermission('institute:delete') && (
                        <button onClick={() => handleDelete(institute.inst_institute_id)} className="font-semibold text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      )}
                    </div>
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


