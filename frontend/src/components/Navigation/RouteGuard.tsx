import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ROUTES } from '@/routes';
import type { UserRole } from '@/types/auth';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const publicPaths = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.FORGOT_PASSWORD,
];

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isPublicPath = publicPaths.includes(router.pathname);
    
    if (status === 'loading') {
      return;
    }

    if (!session && !isPublicPath) {
      setAuthorized(false);
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }

    if (session && isPublicPath) {
      const dashboardRoute = getDashboardByRole(session.user.role as UserRole);
      router.push(dashboardRoute);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(session?.user?.role as UserRole)) {
      setAuthorized(false);
      router.push(ROUTES.ERROR.UNAUTHORIZED);
      return;
    }

    setAuthorized(true);
  }, [status, router, session, allowedRoles]);

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}

function getDashboardByRole(role: UserRole): string {
  switch (role) {
    case 'CLIENT':
      return ROUTES.DASHBOARD.CLIENT;
    case 'TRAINER':
      return ROUTES.DASHBOARD.TRAINER;
    case 'ADMIN':
      return ROUTES.DASHBOARD.ADMIN;
    default:
      return ROUTES.DASHBOARD.CLIENT;
  }
} 