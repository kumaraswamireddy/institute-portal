'use client';
import React from 'react';

const mockPosts = [
    { id: 'post_01', title: 'Top 10 Programming Languages to Learn in 2025', author: 'Super Admin', created: '2025-08-25', status: 'Published' },
    { id: 'post_02', title: 'A Guide to Acing Your Next Technical Interview', author: 'Jane Smith', created: '2025-08-22', status: 'Published' },
    { id: 'post_03', title: 'The Future of AI in Education', author: 'Super Admin', created: '2025-08-20', status: 'Draft' },
    { id: 'post_04', title: 'Why Continuous Learning is Key to Career Growth', author: 'John Doe', created: '2025-08-15', status: 'Published' },
];

export default function BlogCmsPage() {
    const StatusBadge = ({ status }) => {
        const styles = {
            'Published': 'bg-green-100 text-green-800',
            'Draft': 'bg-gray-100 text-gray-800',
        };
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>{status}</span>;
    };
    
    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Blog Content Management</h2>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    New Post
                </button>
            </div>
            <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Title</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Author</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {mockPosts.map(post => (
                                <tr key={post.id}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{post.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{post.author}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{post.created}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap"><StatusBadge status={post.status} /></td>
                                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                        <button className="ml-4 text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
