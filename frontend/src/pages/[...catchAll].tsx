import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ROUTES } from '@/routes';

export default function CatchAllPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(ROUTES.ERROR.NOT_FOUND);
  }, [router]);

  return null;
} 