import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ROUTES } from '@/routes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { UserRole } from '@/types/auth';

interface MainLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  route: string;
  roles: UserRole[];
}

const navigationItems: NavItem[] = [
  { label: 'Dashboard', route: ROUTES.DASHBOARD.CLIENT, roles: ['CLIENT'] },
  { label: 'Dashboard', route: ROUTES.DASHBOARD.TRAINER, roles: ['TRAINER'] },
  { label: 'My Workouts', route: ROUTES.WORKOUTS.LIST, roles: ['CLIENT'] },
  { label: 'Manage Workouts', route: ROUTES.WORKOUTS.LIST, roles: ['TRAINER'] },
  { label: 'Create Workout', route: ROUTES.WORKOUTS.CREATE, roles: ['TRAINER'] },
];

export function MainLayout({ children }: MainLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: ROUTES.AUTH.LOGIN 
      });
      router.push(ROUTES.AUTH.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  const userRole = session?.user?.role as UserRole;
  const filteredNavItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand" onClick={() => router.push('/')}>
          TrainRight
        </div>
        
        {session && (
          <>
            <button 
              className="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} />
            </button>

            <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
              {filteredNavItems.map((item, index) => (
                <button
                  key={`${item.label}-${index}`}
                  onClick={() => {
                    router.push(item.route);
                    setIsMobileMenuOpen(false);
                  }}
                  className={router.pathname === item.route ? 'active' : ''}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="user-menu">
                <button 
                  onClick={() => {
                    router.push(ROUTES.PROFILE.VIEW);
                    setIsMobileMenuOpen(false);
                  }}
                  className={router.pathname === ROUTES.PROFILE.VIEW ? 'active' : ''}
                >
                  {session.user.name || session.user.email}
                </button>
                <button 
                  onClick={handleLogout} 
                  className="logout-button"
                >
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </nav>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>© 2024 TrainRight. All rights reserved.</p>
      </footer>
    </div>
  );
} 