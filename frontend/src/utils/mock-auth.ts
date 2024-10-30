import { Session } from 'next-auth';
import { mockUser } from './test-utils';

export function getMockSession(): Session {
  return {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    user: mockUser
  };
}

// Mock next-auth session hook
export function mockUseSession() {
  return {
    data: getMockSession(),
    status: 'authenticated',
    update: () => Promise.resolve()
  };
} 