import { useState } from 'react';
import { api } from '@/utils/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { User } from '@/types/auth';

interface WorkoutAssignmentProps {
  workoutId: string;
  onAssign: () => void;
  onCancel: () => void;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

export function WorkoutAssignment({ workoutId, onAssign, onCancel }: WorkoutAssignmentProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trainer's clients
  useState(() => {
    const fetchClients = async () => {
      try {
        // Mock API call for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        setClients([
          { id: '1', name: 'John Doe', email: 'john@example.com' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
          { id: '3', name: 'Bob Wilson', email: 'bob@example.com' },
        ]);
      } catch (err) {
        setError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleClientToggle = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleAssign = async () => {
    if (selectedClients.length === 0) {
      setError('Please select at least one client');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mock API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      // await api.post(`/workouts/${workoutId}/assign`, { clientIds: selectedClients });
      onAssign();
    } catch (err) {
      setError('Failed to assign workout');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="workout-assignment">
      <h2>Assign Workout to Clients</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="clients-list">
        {clients.map(client => (
          <div key={client.id} className="client-item">
            <label className="client-checkbox">
              <input
                type="checkbox"
                checked={selectedClients.includes(client.id)}
                onChange={() => handleClientToggle(client.id)}
                disabled={loading}
              />
              <div className="client-info">
                <span className="client-name">{client.name}</span>
                <span className="client-email">{client.email}</span>
              </div>
            </label>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="no-clients">
          <p>No clients available for assignment</p>
        </div>
      )}

      <div className="assignment-actions">
        <button
          type="button"
          onClick={onCancel}
          className="cancel-button"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleAssign}
          className="assign-button"
          disabled={loading || selectedClients.length === 0}
        >
          {loading ? 'Assigning...' : 'Assign Workout'}
        </button>
      </div>
    </div>
  );
} 