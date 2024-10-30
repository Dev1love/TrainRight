export const config = {
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
  auth: {
    cookieName: 'next-auth.session-token',
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
  },
} as const; 