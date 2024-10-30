'use client';

import { mockDataUtils } from '@/mocks/utils';

export default function ActivePlansWidget() {
  const activePlans = mockDataUtils.workouts.getAll().slice(0, 2);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Active Training Plans</h3>
      <div className="space-y-4">
        {activePlans.map((plan) => (
          <div key={plan.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{plan.name}</h4>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                {plan.difficulty}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{plan.exercises.length} exercises</span>
              <span>{plan.duration} min</span>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium">
        View All Plans →
      </button>
    </div>
  );
} 