import { NextApiResponse } from 'next';
import { withAuthentication, AuthenticatedRequest } from '@/middleware/withAuthentication';
import type { WorkoutData } from '@/types/auth';

interface ErrorResponse {
  status: 'error';
  code: number;
  message: string;
  details?: Record<string, unknown>;
}

interface SuccessResponse {
  status: 'success';
  data: WorkoutData;
}

async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse<SuccessResponse | ErrorResponse>
) {
  try {
    if (req.method !== 'GET') {
      throw new Error('Method not allowed');
    }

    const { id } = req.query;
    if (!id || Array.isArray(id)) {
      throw new Error('Valid workout ID is required');
    }

    const canAccessWorkout = await checkWorkoutAccess(id, req.user.id, req.user.role);
    if (!canAccessWorkout) {
      throw new Error('You do not have permission to access this workout');
    }

    const workoutData = await getMockWorkoutData(id);
    
    return res.status(200).json({
      status: 'success',
      data: workoutData
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    const statusCode = getErrorStatusCode(error);
    return res.status(statusCode).json({
      status: 'error',
      code: statusCode,
      message: error instanceof Error ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' 
        ? { stack: error instanceof Error ? error.stack : undefined }
        : undefined
    });
  }
}

function getErrorStatusCode(error: unknown): number {
  if (error instanceof Error) {
    switch (error.message) {
      case 'Method not allowed':
        return 405;
      case 'Valid workout ID is required':
        return 400;
      case 'You do not have permission to access this workout':
        return 403;
      default:
        return 500;
    }
  }
  return 500;
}

async function checkWorkoutAccess(
  workoutId: string, 
  userId: string, 
  userRole: string
): Promise<boolean> {
  // Mock implementation - replace with actual database query
  // Trainers can access all workouts
  if (userRole === 'TRAINER') return true;
  
  // Clients can only access their own workouts
  // In real implementation, check if workout belongs to user
  return true;
}

async function getMockWorkoutData(id: string): Promise<WorkoutData> {
  // Simulate database delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    id,
    title: 'Full Body Workout',
    exercises: [
      { name: 'Squats', sets: 3, reps: 12 },
      { name: 'Push-ups', sets: 3, reps: 15 },
      { name: 'Pull-ups', sets: 3, reps: 8 }
    ],
    duration: '45 minutes',
    difficulty: 'intermediate'
  };
}

export default withAuthentication(handler); 