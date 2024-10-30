'use client';

import { mockDataUtils } from '@/mocks/utils';

export default function ScheduleOverviewWidget() {
  const todaySchedule = mockDataUtils.schedule.getAll()
    .filter(session => 
      new Date(session.date).toDateString() === new Date().toDateString()
    );

  const getTimeSlot = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  const groupedSchedule = todaySchedule.reduce((acc, session) => {
    const timeSlot = getTimeSlot(session.startTime);
    if (!acc[timeSlot]) acc[timeSlot] = [];
    acc[timeSlot].push(session);
    return acc;
  }, {} as Record<string, typeof todaySchedule>);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Today's Schedule</h3>
        <div className="flex gap-2">
          <button className="text-sm text-indigo-600 hover:text-indigo-800 px-3 py-1 rounded-md hover:bg-indigo-50">
            Add Session
          </button>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 px-3 py-1 rounded-md hover:bg-indigo-50">
            Full Schedule →
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedSchedule).length === 0 ? (
          <p className="text-gray-500 text-center py-4">No sessions scheduled for today</p>
        ) : (
          Object.entries(groupedSchedule).map(([timeSlot, sessions]) => (
            <div key={timeSlot}>
              <h4 className="text-sm font-medium text-gray-500 mb-3">{timeSlot}</h4>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{session.title}</h4>
                        <p className="text-sm text-gray-500">
                          {session.startTime} ({session.duration} min)
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
                    {session.client && (
                      <div className="text-sm text-gray-600">
                        Client: {session.client.name}
                      </div>
                    )}
                    {session.notes && (
                      <p className="mt-2 text-sm text-gray-500 italic">
                        {session.notes}
                      </p>
                    )}
                    <div className="mt-3 flex gap-2 justify-end">
                      <button className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100">
                        Reschedule
                      </button>
                      <button className="text-sm text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50">
                        Start Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 