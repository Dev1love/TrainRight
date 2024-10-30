'use client';

import { mockDataUtils } from '@/mocks/utils';

export default function TrainingPlansWidget() {
  const recentPlans = mockDataUtils.workouts.getAll().slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Training Plans</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-800">
          Create New Plan
        </button>
      </div>

      <div className="space-y-4">
        {recentPlans.map((plan) => (
          <div key={plan.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{plan.name}</h4>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                plan.difficulty === 'beginner' 
                  ? 'bg-green-100 text-green-800'
                  : plan.difficulty === 'intermediate'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {plan.difficulty}
              </span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{plan.exercises.length} exercises</span>
              <span>{plan.duration} min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 