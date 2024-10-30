import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { withAuth } from '@/utils/routeGuards';
import type { User } from '@/types/auth';
import { ROUTES } from '@/routes';
import { api } from '@/utils/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ClientDetailProps {
  user: User;
}

interface ClientData {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive?: string;
  workouts: {
    assigned: number;
    completed: number;
    inProgress: number;
  };
  progress: {
    date: string;
    metric: string;
    value: number;
  }[];
}

const ClientDetail = ({ user }: ClientDetailProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        // Mock API call for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        setClient({
          id: id as string,
          name: 'John Doe',
          email: 'john@example.com',
          status: 'active',
          lastActive: '2024-02-20T10:00:00Z',
          workouts: {
            assigned: 5,
            completed: 3,
            inProgress: 1,
          },
          progress: [
            { date: '2024-02-15', metric: 'Weight', value: 80 },
            { date: '2024-02-08', metric: 'Weight', value: 81 },
            { date: '2024-02-01', metric: 'Weight', value: 82 },
          ],
        });
      } catch (err) {
        setError('Failed to load client data');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!client) return null;

  return (
    <div className="client-detail">
      <div className="client-header">
        <div className="client-info">
          <h1>{client.name}</h1>
          <span className={`status-badge ${client.status}`}>
            {client.status}
          </span>
        </div>
        <button 
          onClick={() => router.push(ROUTES.WORKOUTS.CREATE)}
          className="assign-workout-button"
        >
          Assign New Workout
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Assigned Workouts</h3>
          <p>{client.workouts.assigned}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p>{client.workouts.completed}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p>{client.workouts.inProgress}</p>
        </div>
      </div>

      <div className="content-grid">
        <div className="workouts-section">
          <h2>Recent Workouts</h2>
          {/* Add workout list component here */}
        </div>

        <div className="progress-section">
          <h2>Progress Tracking</h2>
          <div className="progress-chart">
            {client.progress.map((entry, index) => (
              <div key={index} className="progress-entry">
                <span className="date">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <span className="metric">{entry.metric}</span>
                <span className="value">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="actions-section">
        <button className="secondary-button">Message Client</button>
        <button className="secondary-button">View Full History</button>
        <button className="danger-button">Remove Client</button>
      </div>
    </div>
  );
};

export const getServerSideProps = withAuth<ClientDetailProps>(
  async () => ({ props: {} }),
  ['TRAINER']
);

export default ClientDetail; 