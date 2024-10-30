'use client';

import { mockDataUtils } from '@/mocks/utils';

interface Client {
  id: string;
  name: string;
  email: string;
  activePlans: number;
  lastWorkout: Date | null;
  status: 'active' | 'inactive';
}

// Mock data - will be replaced with real API data later
const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'Jane Client',
    email: 'jane@example.com',
    activePlans: 2,
    lastWorkout: new Date('2024-03-10'),
    status: 'active'
  },
  {
    id: 'c2',
    name: 'John Smith',
    email: 'john@example.com',
    activePlans: 1,
    lastWorkout: new Date('2024-03-08'),
    status: 'active'
  },
  {
    id: 'c3',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    activePlans: 0,
    lastWorkout: null,
    status: 'inactive'
  }
];

export default function ClientListWidget() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Active Clients</h3>
        <div className="flex gap-2">
          <button className="text-sm text-indigo-600 hover:text-indigo-800 px-3 py-1 rounded-md hover:bg-indigo-50">
            Add Client
          </button>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 px-3 py-1 rounded-md hover:bg-indigo-50">
            View All →
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {mockClients.map((client) => (
          <div 
            key={client.id} 
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{client.name}</h4>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                client.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {client.status}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="text-gray-500">Active Plans:</span>{' '}
                <span className={client.activePlans === 0 ? 'text-red-500' : ''}>
                  {client.activePlans}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Last Workout:</span>{' '}
                <span className={!client.lastWorkout ? 'text-red-500' : ''}>
                  {client.lastWorkout 
                    ? new Date(client.lastWorkout).toLocaleDateString() 
                    : 'Never'}
                </span>
              </div>
            </div>
            <div className="mt-3 flex gap-2 justify-end">
              <button className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100">
                Message
              </button>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 