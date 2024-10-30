import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import type { UserRole } from '@/types/auth';
import { ROUTES } from '@/routes';

interface AuthenticatedPageProps {
  user: {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
  };
}

export function withAuth<P extends AuthenticatedPageProps>(
  getServerSideProps?: GetServerSideProps<P>,
  allowedRoles?: UserRole[]
): GetServerSideProps<P> {
  return async (context: GetServerSidePropsContext) => {
    const session = await getSession(context);

    if (!session) {
      return {
        redirect: {
          destination: ROUTES.AUTH.LOGIN,
          permanent: false,
        },
      };
    }

    if (allowedRoles && !allowedRoles.includes(session.user.role as UserRole)) {
      return {
        redirect: {
          destination: ROUTES.ERROR.UNAUTHORIZED,
          permanent: false,
        },
      };
    }

    if (getServerSideProps) {
      const result = await getServerSideProps(context);
      if ('props' in result) {
        return {
          props: {
            ...result.props,
            user: session.user,
          },
        };
      }
      return result;
    }

    return {
      props: { user: session.user } as P,
    };
  };
} 