'use client';
import React, { useState } from 'react';
import { Tag, MapPin, Plus, Trash2 } from 'lucide-react';

const mockCategories = [
    { id: 1, name: 'IT & Software' },
    { id: 2, name: 'Competitive Exams' },
    { id: 3, name: 'Languages' },
    { id: 4, name: 'Hobby Classes' },
];

const mockLocations = [
    { id: 1, name: 'Hyderabad' },
    { id: 2, name: 'Bangalore' },
    { id: 3, name: 'Chennai' },
];

export default function SiteSettingsPage() {
    const [categories, setCategories] = useState(mockCategories);
    const [locations, setLocations] = useState(mockLocations);
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Site Settings & Master Data</h2>
            <p className="mt-2 text-sm text-gray-600">Manage core data used for filtering and organization across the platform.</p>
            
            <div className="grid gap-8 mt-6 md:grid-cols-2">
                {/* Categories Card */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center text-lg font-semibold text-gray-800">
                            <Tag className="w-5 h-5 mr-2 text-blue-600"/> Course Categories
                        </h3>
                        <button className="flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-1"/> Add
                        </button>
                    </div>
                    <ul className="mt-4 space-y-2">
                        {categories.map(cat => (
                            <li key={cat.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-700">{cat.name}</span>
                                <button className="text-gray-400 hover:text-red-600">
                                    <Trash2 className="w-4 h-4"/>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Locations Card */}
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center text-lg font-semibold text-gray-800">
                            <MapPin className="w-5 h-5 mr-2 text-green-600"/> Locations
                        </h3>
                         <button className="flex items-center px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                            <Plus className="w-4 h-4 mr-1"/> Add
                        </button>
                    </div>
                    <ul className="mt-4 space-y-2">
                        {locations.map(loc => (
                             <li key={loc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                <span className="text-sm text-gray-700">{loc.name}</span>
                                 <button className="text-gray-400 hover:text-red-600">
                                    <Trash2 className="w-4 h-4"/>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
