'use client';
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const mockContent = [
    { id: 'rev_001', type: 'Review', content: 'This institute was amazing! Great faculty.', user: 'Rohan S.', date: '2025-08-28', status: 'pending' },
    { id: 'qa_001', type: 'Q&A', content: 'What is the fee for the Java course?', user: 'Priya P.', date: '2025-08-27', status: 'pending' },
    { id: 'rev_002', type: 'Review', content: 'Not worth the money, poor infrastructure.', user: 'Amit S.', date: '2025-08-26', status: 'pending' },
];

export default function ModerationPage() {
    const [activeTab, setActiveTab] = useState('reviews');

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Content Moderation</h2>
            <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px space-x-8">
                        <button onClick={() => setActiveTab('reviews')} className={`px-1 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'reviews' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Reviews
                        </button>
                        <button onClick={() => setActiveTab('qna')} className={`px-1 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === 'qna' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            Q&A
                        </button>
                    </nav>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="w-2/5 px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Content</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">User</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockContent.filter(c => c.type.toLowerCase().includes(activeTab.slice(0, -1))).map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 text-sm text-gray-600">{item.content}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{item.user}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{item.date}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                        <button className="inline-flex items-center justify-center w-8 h-8 text-green-600 bg-green-100 rounded-full hover:bg-green-200">
                                            <Check className="w-5 h-5"/>
                                        </button>
                                        <button className="inline-flex items-center justify-center w-8 h-8 ml-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200">
                                            <X className="w-5 h-5"/>
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
