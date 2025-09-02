'use client';
import React from 'react';
import { Building, Users, Megaphone } from 'lucide-react';

const mockDashboardStats = {
    totalInstitutes: 1250,
    totalStudents: 52340,
    activeLeads: 3280,
    metrics: [
        { metric: 'New Student Signups', today: 150, thisWeek: 850, thisMonth: 3200, trend: 15 },
        { metric: 'New Institute Registrations', today: 5, thisWeek: 25, thisMonth: 110, trend: 5 },
        { metric: 'Total Enquiries Generated', today: 320, thisWeek: 1800, thisMonth: 7500, trend: 12 },
    ]
};

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
                <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
            </div>
        </div>
    </div>
);

export default function DashboardPage() {
    const stats = mockDashboardStats;
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <div className="grid gap-6 mt-6 md:grid-cols-2 xl:grid-cols-3">
                <StatCard title="Total Institutes" value={stats.totalInstitutes} icon={Building} />
                <StatCard title="Total Students" value={stats.totalStudents} icon={Users} />
                <StatCard title="Active Leads" value={stats.activeLeads} icon={Megaphone} />
            </div>
            <div className="mt-8">
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800">Platform Metrics</h3>
                    <div className="overflow-x-auto mt-4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Metric</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Today</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">This Week</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">This Month</th>
                                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stats.metrics.map(item => (
                                    <tr key={item.metric}>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{item.metric}</td>
                                        <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">{item.today.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">{item.thisWeek.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-right text-gray-500 whitespace-nowrap">{item.thisMonth.toLocaleString()}</td>
                                        <td className={`px-6 py-4 text-sm text-right whitespace-nowrap ${item.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.trend > 0 ? `+${item.trend}` : item.trend}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
