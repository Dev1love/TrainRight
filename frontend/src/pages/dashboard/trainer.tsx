import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { withAuth } from '@/utils/routeGuards';
import type { User } from '@/types/auth';
import { ROUTES } from '@/routes';
import { api } from '@/utils/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { InviteForm } from '@/components/invitations/InviteForm';

interface TrainerDashboardProps {
  user: User;
}

interface ClientData {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'inactive';
  lastActive?: string;
  assignedWorkouts: number;
  completedWorkouts: number;
}

const TrainerDashboard = ({ user }: TrainerDashboardProps) => {
  const router = useRouter();
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteType, setInviteType] = useState<'CLIENT' | 'TRAINER'>('CLIENT');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        // Mock API call for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        setClients([
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            status: 'active',
            lastActive: '2024-02-20T10:00:00Z',
            assignedWorkouts: 5,
            completedWorkouts: 3,
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            status: 'pending',
            assignedWorkouts: 0,
            completedWorkouts: 0,
          },
          // Add more mock clients...
        ]);
      } catch (err) {
        setError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleClientClick = (clientId: string) => {
    router.push(`/clients/${clientId}`);
  };

  const handleInviteSuccess = () => {
    setShowInviteForm(false);
    // Optionally show success message or refresh client list
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="trainer-dashboard">
      <div className="dashboard-header">
        <h1>Trainer Dashboard</h1>
        <button 
          onClick={() => router.push(ROUTES.WORKOUTS.CREATE)}
          className="create-workout-button"
        >
          Create New Workout
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Active Clients</h3>
          <p>{clients.filter(c => c.status === 'active').length}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Clients</h3>
          <p>{clients.filter(c => c.status === 'pending').length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Workouts</h3>
          <p>{clients.reduce((sum, client) => sum + client.assignedWorkouts, 0)}</p>
        </div>
      </div>

      <div className="clients-section">
        <div className="section-header">
          <h2>My Clients</h2>
          <div className="invite-actions">
            <button 
              onClick={() => {
                setInviteType('CLIENT');
                setShowInviteForm(true);
              }}
              className="invite-button"
            >
              Invite Client
            </button>
            <button 
              onClick={() => {
                setInviteType('TRAINER');
                setShowInviteForm(true);
              }}
              className="invite-button secondary"
            >
              Invite Trainer
            </button>
          </div>
        </div>

        <div className="clients-grid">
          {clients.map(client => (
            <div 
              key={client.id} 
              className={`client-card ${client.status}`}
              onClick={() => handleClientClick(client.id)}
            >
              <div className="client-header">
                <h3>{client.name}</h3>
                <span className={`status-badge ${client.status}`}>
                  {client.status}
                </span>
              </div>
              <p className="client-email">{client.email}</p>
              {client.lastActive && (
                <p className="last-active">
                  Last active: {new Date(client.lastActive).toLocaleDateString()}
                </p>
              )}
              <div className="workout-stats">
                <div>
                  <span>Assigned</span>
                  <p>{client.assignedWorkouts}</p>
                </div>
                <div>
                  <span>Completed</span>
                  <p>{client.completedWorkouts}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {clients.length === 0 && (
          <div className="no-clients">
            <p>No clients yet. Start by inviting your first client!</p>
          </div>
        )}
      </div>

      {showInviteForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <InviteForm
              inviteType={inviteType}
              onSuccess={handleInviteSuccess}
              onCancel={() => setShowInviteForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = withAuth<TrainerDashboardProps>(
  async () => ({ props: {} }),
  ['TRAINER']
);

export default TrainerDashboard; 