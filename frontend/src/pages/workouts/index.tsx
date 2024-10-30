import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { withAuth } from '@/utils/routeGuards';
import type { User, WorkoutData } from '@/types/auth';
import { ROUTES } from '@/routes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { api } from '@/utils/api';

interface WorkoutListProps {
  user: User;
}

const WorkoutList = ({ user }: WorkoutListProps) => {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isTrainer = user.role === 'TRAINER';

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const endpoint = isTrainer ? '/workouts/created' : '/workouts/assigned';
        const { data } = await api.get(endpoint);
        setWorkouts(data.data);
      } catch (err) {
        setError('Failed to load workouts');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [isTrainer]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="workouts-container">
      <div className="workouts-header">
        <h1>{isTrainer ? 'Manage Workouts' : 'My Workouts'}</h1>
        {isTrainer && (
          <button 
            onClick={() => router.push(ROUTES.WORKOUTS.CREATE)}
            className="create-button"
          >
            Create New Workout
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="workouts-grid">
        {workouts.map((workout) => (
          <div key={workout.id} className="workout-card">
            <h3>{workout.title}</h3>
            <div className="workout-meta">
              <span>{workout.duration}</span>
              <span>{workout.difficulty}</span>
            </div>
            <p>Exercises: {workout.exercises.length}</p>
            <div className="workout-actions">
              <button 
                onClick={() => router.push(ROUTES.WORKOUTS.DETAIL(workout.id))}
                className="view-button"
              >
                View Details
              </button>
              {isTrainer && (
                <button 
                  onClick={() => router.push(ROUTES.WORKOUTS.EDIT(workout.id))}
                  className="edit-button"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {workouts.length === 0 && (
        <div className="no-workouts">
          <p>{isTrainer ? 'No workouts created yet.' : 'No workouts assigned yet.'}</p>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = withAuth<WorkoutListProps>();

export default WorkoutList; 