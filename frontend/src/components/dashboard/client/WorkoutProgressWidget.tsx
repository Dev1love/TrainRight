'use client';

import { mockDataUtils } from '@/mocks/utils';

export default function WorkoutProgressWidget() {
  const recentProgress = mockDataUtils.progress.getAll().slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Workouts</h3>
      <div className="space-y-4">
        {recentProgress.map((workout) => (
          <div key={workout.id} className="border-b pb-4 last:border-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{workout.workoutName}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(workout.date).toLocaleDateString()}
                </p>
              </div>
              <span className="text-2xl" title={`Mood: ${workout.mood}/5`}>
                {['😫', '😕', '😐', '🙂', '😄'][workout.mood - 1]}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="mr-4">Duration: {workout.duration} min</span>
              <span>{workout.exercises.length} exercises</span>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
        View All Workouts →
      </button>
    </div>
  );
} 