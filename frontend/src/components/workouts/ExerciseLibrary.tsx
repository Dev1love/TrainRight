import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ExerciseLibraryProps {
  onSelect: (exercise: LibraryExercise) => void;
  onClose: () => void;
}

interface LibraryExercise {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultSets: number;
  defaultReps: number;
}

interface Category {
  id: string;
  name: string;
}

export function ExerciseLibrary({ onSelect, onClose }: ExerciseLibraryProps) {
  const [exercises, setExercises] = useState<LibraryExercise[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Mock API calls for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setCategories([
          { id: 'strength', name: 'Strength' },
          { id: 'cardio', name: 'Cardio' },
          { id: 'flexibility', name: 'Flexibility' },
        ]);

        setExercises([
          {
            id: '1',
            name: 'Barbell Squat',
            category: 'strength',
            description: 'A compound exercise that targets the lower body.',
            defaultSets: 3,
            defaultReps: 12,
          },
          {
            id: '2',
            name: 'Push-ups',
            category: 'strength',
            description: 'A bodyweight exercise for upper body strength.',
            defaultSets: 3,
            defaultReps: 15,
          },
          {
            id: '3',
            name: 'Running',
            category: 'cardio',
            description: 'Cardiovascular exercise for endurance.',
            defaultSets: 1,
            defaultReps: 1,
          },
          // Add more mock exercises...
        ]);
      } catch (err) {
        setError('Failed to load exercise library');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="exercise-library">
      <div className="library-header">
        <h2>Exercise Library</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <div className="library-filters">
        <input
          type="text"
          placeholder="Search exercises..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="exercises-grid">
        {filteredExercises.map(exercise => (
          <div key={exercise.id} className="exercise-card" onClick={() => onSelect(exercise)}>
            <h3>{exercise.name}</h3>
            <span className="category-tag">{exercise.category}</span>
            <p>{exercise.description}</p>
            <div className="exercise-defaults">
              <span>Default: {exercise.defaultSets} sets × {exercise.defaultReps} reps</span>
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="no-results">
          <p>No exercises found matching your criteria</p>
        </div>
      )}
    </div>
  );
} 