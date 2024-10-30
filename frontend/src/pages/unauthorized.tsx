import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ROUTES } from '@/routes';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleDashboardClick = () => {
    if (!session) {
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }

    switch (session.user.role) {
      case 'CLIENT':
        router.push(ROUTES.DASHBOARD.CLIENT);
        break;
      case 'TRAINER':
        router.push(ROUTES.DASHBOARD.TRAINER);
        break;
      case 'ADMIN':
        router.push(ROUTES.DASHBOARD.ADMIN);
        break;
      default:
        router.push(ROUTES.AUTH.LOGIN);
    }
  };

  return (
    <div className="error-page">
      <div className="error-content">
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <div className="error-actions">
          <button 
            onClick={() => router.back()}
            className="secondary-button"
          >
            Go Back
          </button>
          <button 
            onClick={handleDashboardClick}
            className="primary-button"
          >
            {session ? 'Go to Dashboard' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
} 