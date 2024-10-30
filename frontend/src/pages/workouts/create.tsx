import { useState } from 'react';
import { useRouter } from 'next/router';
import { withAuth } from '@/utils/routeGuards';
import type { User, Exercise } from '@/types/auth';
import { ROUTES } from '@/routes';
import { api } from '@/utils/api';
import { ExerciseLibrary } from '@/components/workouts/ExerciseLibrary';

interface WorkoutCreateProps {
  user: User;
}

interface WorkoutFormData {
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  exercises: Exercise[];
}

const initialFormData: WorkoutFormData = {
  title: '',
  difficulty: 'intermediate',
  duration: '45 minutes',
  exercises: [{ name: '', sets: 3, reps: 12 }]
};

const WorkoutCreate = ({ user }: WorkoutCreateProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<WorkoutFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);

  const handleExerciseChange = (index: number, field: keyof Exercise, value: string | number) => {
    const newExercises = [...formData.exercises];
    newExercises[index] = {
      ...newExercises[index],
      [field]: value
    };
    setFormData({ ...formData, exercises: newExercises });
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { name: '', sets: 3, reps: 12 }]
    });
  };

  const removeExercise = (index: number) => {
    const newExercises = formData.exercises.filter((_, i) => i !== index);
    setFormData({ ...formData, exercises: newExercises });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      // await api.post('/workouts', formData);
      router.push(ROUTES.WORKOUTS.LIST);
    } catch (err) {
      setError('Failed to create workout');
    } finally {
      setLoading(false);
    }
  };

  const handleExerciseSelect = (libraryExercise: LibraryExercise) => {
    const newExercise = {
      name: libraryExercise.name,
      sets: libraryExercise.defaultSets,
      reps: libraryExercise.defaultReps
    };
    
    setFormData({
      ...formData,
      exercises: [...formData.exercises, newExercise]
    });
    
    setShowLibrary(false);
  };

  return (
    <div className="workout-form-container">
      <h1>Create New Workout</h1>

      <form onSubmit={handleSubmit} className="workout-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title">Workout Title</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            disabled={loading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as WorkoutFormData['difficulty'] })}
              disabled={loading}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              disabled={loading}
            />
          </div>
        </div>

        <div className="exercises-section">
          <div className="section-header">
            <h2>Exercises</h2>
            <button
              type="button"
              onClick={() => setShowLibrary(true)}
              className="add-from-library"
            >
              Add from Library
            </button>
          </div>
          {formData.exercises.map((exercise, index) => (
            <div key={index} className="exercise-form">
              <div className="form-row">
                <div className="form-group exercise-name">
                  <label>Exercise Name</label>
                  <input
                    type="text"
                    value={exercise.name}
                    onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Sets</label>
                  <input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value))}
                    min="1"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label>Reps</label>
                  <input
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value))}
                    min="1"
                    required
                    disabled={loading}
                  />
                </div>

                {formData.exercises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="remove-exercise"
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addExercise}
            className="add-exercise"
            disabled={loading}
          >
            Add Exercise
          </button>
        </div>

        {showLibrary && (
          <div className="modal-overlay">
            <div className="modal-content">
              <ExerciseLibrary
                onSelect={handleExerciseSelect}
                onClose={() => setShowLibrary(false)}
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => router.push(ROUTES.WORKOUTS.LIST)}
            className="cancel-button"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Workout'}
          </button>
        </div>
      </form>
    </div>
  );
};

export const getServerSideProps = withAuth<WorkoutCreateProps>(
  async () => ({ props: {} }),
  ['TRAINER']
);

export default WorkoutCreate; 