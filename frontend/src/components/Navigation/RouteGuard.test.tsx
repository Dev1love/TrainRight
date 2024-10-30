import { render, screen, waitFor } from '@/utils/test-utils';
import { RouteGuard } from './RouteGuard';
import { ROUTES } from '@/routes';
import { mockUsers } from '@/utils/mock-data';

describe('RouteGuard', () => {
  const mockChildren = <div>Protected Content</div>;

  it('shows loading state initially', () => {
    render(<RouteGuard>{mockChildren}</RouteGuard>, {
      session: null,
    });
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to login for unauthenticated users', async () => {
    const { mockRouter } = render(
      <RouteGuard>{mockChildren}</RouteGuard>,
      {
        session: null,
      }
    );

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.AUTH.LOGIN);
    });
  });

  it('allows access for authenticated users with correct role', async () => {
    render(
      <RouteGuard allowedRoles={['TRAINER']}>{mockChildren}</RouteGuard>,
      {
        session: {
          expires: '',
          user: mockUsers.trainer,
        },
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });

  it('redirects to unauthorized for wrong role', async () => {
    const { mockRouter } = render(
      <RouteGuard allowedRoles={['TRAINER']}>{mockChildren}</RouteGuard>,
      {
        session: {
          expires: '',
          user: mockUsers.client,
        },
      }
    );

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith(ROUTES.ERROR.UNAUTHORIZED);
    });
  });
}); 