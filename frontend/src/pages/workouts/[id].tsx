import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ErrorHandler } from '@/utils/errorHandler';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { withAuth } from '@/utils/routeGuards';
import { ROUTES } from '@/routes';
import type { User, WorkoutData } from '@/types/auth';
import { api } from '@/utils/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { GetServerSideProps } from 'next';
import { WorkoutAssignment } from '@/components/workouts/WorkoutAssignment';

interface WorkoutPageProps {
  user: User;
  initialWorkout?: WorkoutData;
}

const WorkoutPage = ({ user, initialWorkout }: WorkoutPageProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [error, setError] = useState<string | null>(null);
  const [workout, setWorkout] = useState<WorkoutData | null>(initialWorkout || null);
  const [loading, setLoading] = useState(!initialWorkout);
  const [showAssignment, setShowAssignment] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!id || initialWorkout) return;
      
      try {
        setLoading(true);
        const response = await api.mock.getWorkout(id as string);
        setWorkout(response.data.data);
      } catch (error) {
        const errorMessage = ErrorHandler.getErrorMessage(error);
        setError(errorMessage);

        if (ErrorHandler.isNotFoundError(error)) {
          router.push(ROUTES.ERROR.NOT_FOUND);
        } else if (ErrorHandler.isAuthenticationError(error)) {
          router.push(ROUTES.AUTH.LOGIN);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id, router, initialWorkout]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => router.reload()}>Try Again</button>
      </div>
    );
  }

  if (!workout) {
    return null;
  }

  return (
    <ErrorBoundary>
      <div className="workout-container">
        <h1>{workout.title}</h1>
        <div className="workout-meta">
          <p>Duration: {workout.duration}</p>
          <p>Difficulty: {workout.difficulty}</p>
        </div>
        
        <div className="exercises-list">
          <h2>Exercises</h2>
          {workout.exercises.map((exercise, index) => (
            <div key={`${exercise.name}-${index}`} className="exercise-item">
              <h3>{exercise.name}</h3>
              <p>{exercise.sets} sets x {exercise.reps} reps</p>
            </div>
          ))}
        </div>

        {user.role === 'TRAINER' && (
          <div className="trainer-controls">
            <button onClick={() => router.push(ROUTES.WORKOUTS.EDIT(id as string))}>
              Edit Workout
            </button>
            <button onClick={() => setShowAssignment(true)}>
              Assign to Clients
            </button>
          </div>
        )}

        {showAssignment && (
          <div className="modal-overlay">
            <div className="modal-content">
              <WorkoutAssignment
                workoutId={id as string}
                onAssign={() => {
                  setShowAssignment(false);
                  // Optionally show success message
                }}
                onCancel={() => setShowAssignment(false)}
              />
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export const getServerSideProps: GetServerSideProps<WorkoutPageProps> = withAuth(
  async (context) => {
    try {
      const { id } = context.params || {};
      if (!id || Array.isArray(id)) {
        return {
          notFound: true
        };
      }

      // Optional: Fetch initial workout data server-side
      // const response = await api.mock.getWorkout(id);
      // const initialWorkout = response.data.data;

      return {
        props: {
          // initialWorkout,
        }
      };
    } catch (error) {
      return {
        props: {}
      };
    }
  },
  ['CLIENT', 'TRAINER']
);

export default WorkoutPage;