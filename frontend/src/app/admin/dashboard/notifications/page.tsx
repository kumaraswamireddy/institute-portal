'use client';

import React, { useState } from 'react';
import { Bell, Send, Search, CheckCircle, Clock } from 'lucide-react';

// Mock data for demonstration
const sentAlerts = [
  { 
    id: 'A001', 
    title: 'System Maintenance Announcement', 
    recipients: 'All Institutes', 
    sentAt: '2024-08-15 10:30 AM', 
    status: 'Sent' 
  },
  { 
    id: 'A002', 
    title: 'New Bidding Feature Launch', 
    recipients: 'Premium Tier Institutes', 
    sentAt: '2024-08-12 02:00 PM', 
    status: 'Sent' 
  },
  { 
    id: 'A003', 
    title: 'Upcoming Holiday Schedule', 
    recipients: 'All Institutes', 
    sentAt: '2024-08-10 11:00 AM', 
    status: 'Read' 
  },
];

export default function NotificationsPage() {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  const handleSend = () => {
    // In a real application, this would call an API
    console.log('Sending notification:', { subject, message });
    alert('Notification has been sent!');
    setSubject('');
    setMessage('');
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Notifications & Alerts</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Composer Section */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Compose Message</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="recipients" className="mb-2 block text-sm font-medium text-gray-700">
                  Recipients
                </label>
                <select 
                  id="recipients" 
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>All Institutes</option>
                  <option>Premium Tier Institutes</option>
                  <option>Specific Institutes (Search below)</option>
                </select>
              </div>
              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Important Update"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Compose your message to the institutes..."
                  required
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                  Send Notification
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* History Section */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Sent History</h2>
          <div className="space-y-4">
            {sentAlerts.map((alert) => (
              <div key={alert.id} className="rounded-md border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-800">{alert.title}</p>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                      alert.status === 'Read' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                     {alert.status === 'Read' ? <CheckCircle className="h-3 w-3"/> : <Clock className="h-3 w-3"/>}
                     {alert.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">To: {alert.recipients}</p>
                <p className="mt-2 text-xs text-gray-400">Sent on: {alert.sentAt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
