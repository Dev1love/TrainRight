import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { ROUTES } from '@/routes';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { UserRole } from '@/types/auth';

export default function HomePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push(ROUTES.AUTH.LOGIN);
      return;
    }

    const role = session.user.role as UserRole;
    switch (role) {
      case 'CLIENT':
        router.push(ROUTES.DASHBOARD.CLIENT);
        break;
      case 'TRAINER':
        router.push(ROUTES.DASHBOARD.TRAINER);
        break;
      default:
        router.push(ROUTES.AUTH.LOGIN);
    }
  }, [session, status, router]);

  return <LoadingSpinner />;
} 