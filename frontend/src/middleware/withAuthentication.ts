import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import type { User } from '@/types/auth';

export interface AuthenticatedRequest extends NextApiRequest {
  user: User;
}

export function withAuthentication(handler: NextApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const session = await getSession({ req });

      if (!session) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Authentication required'
        });
      }

      // Validate user data
      if (!session.user?.id || !session.user?.role) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Invalid session data'
        });
      }

      // Add typed user data to request
      req.user = session.user as User;
      
      // Add session validation timestamp
      req.user.validatedAt = new Date().toISOString();

      return handler(req, res);
    } catch (error) {
      console.error('Authentication Error:', error);
      return res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Authentication system error'
      });
    }
  };
} 