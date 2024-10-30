import { useRouter } from 'next/router';
import { withAuth } from '@/utils/routeGuards';
import type { User } from '@/types/auth';
import { ROUTES } from '@/routes';

interface ProfileViewProps {
  user: User;
}

function ProfileView({ user }: ProfileViewProps) {
  const router = useRouter();

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
        <button 
          onClick={() => router.push(ROUTES.PROFILE.EDIT)}
          className="edit-button"
        >
          Edit Profile
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name</label>
              <p>{user.name || 'Not set'}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Role</label>
              <p>{user.role}</p>
            </div>
          </div>
        </div>

        {user.role === 'CLIENT' && (
          <div className="profile-section">
            <h2>Fitness Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Assigned Workouts</label>
                <p>0</p>
              </div>
              <div className="info-item">
                <label>Completed Workouts</label>
                <p>0</p>
              </div>
              <div className="info-item">
                <label>Active Since</label>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}

        {user.role === 'TRAINER' && (
          <div className="profile-section">
            <h2>Trainer Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Active Clients</label>
                <p>0</p>
              </div>
              <div className="info-item">
                <label>Created Workouts</label>
                <p>0</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps = withAuth<ProfileViewProps>();

export default ProfileView; 