'use client';

import { mockDataUtils } from '@/mocks/utils';

export default function UpcomingSessionsWidget() {
  const upcomingSessions = mockDataUtils.schedule.getAll()
    .filter(session => new Date(session.date) > new Date())
    .slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Upcoming Sessions</h3>
      <div className="space-y-4">
        {upcomingSessions.map((session) => (
          <div key={session.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{session.title}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(session.date).toLocaleDateString()} at {session.startTime}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                session.type === 'personal' 
                  ? 'bg-green-100 text-green-800'
                  : session.type === 'group'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {session.type}
              </span>
            </div>
            {session.trainer && (
              <p className="text-sm text-gray-600">
                with {session.trainer.name}
              </p>
            )}
            <div className="mt-2 text-sm text-gray-500">
              Duration: {session.duration} min
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
        View Schedule →
      </button>
    </div>
  );
} 