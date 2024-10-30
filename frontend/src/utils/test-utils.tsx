import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import { Session } from 'next-auth';

// Mock router for testing
export const createMockRouter = (props: Partial<NextRouter>): NextRouter => ({
  basePath: '',
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/',
  back: jest.fn(),
  beforePopState: jest.fn(),
  prefetch: jest.fn(),
  push: jest.fn(),
  reload: jest.fn(),
  replace: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
  ...props,
});

// Mock session for testing
export const createMockSession = (props: Partial<Session> = {}): Session => ({
  expires: new Date(Date.now() + 2 * 86400).toISOString(),
  user: {
    id: '1',
    email: 'test@example.com',
    role: 'CLIENT',
    name: 'Test User',
    ...props.user,
  },
  ...props,
});

// Custom render function
interface RenderOptions {
  router?: Partial<NextRouter>;
  session?: Session | null;
}

export function render(
  ui: React.ReactElement,
  {
    router = {},
    session = createMockSession(),
    ...renderOptions
  }: RenderOptions = {}
) {
  const mockRouter = createMockRouter(router);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        <RouterContext.Provider value={mockRouter}>
          {children}
        </RouterContext.Provider>
      </SessionProvider>
    );
  }

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    mockRouter,
  };
}

// Re-export everything
export * from '@testing-library/react'; 