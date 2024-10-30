import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { User } from '@/types/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Mock users for development
        const mockUsers = {
          trainer: {
            id: '1',
            email: 'trainer@example.com',
            password: 'password123',
            role: 'TRAINER',
            name: 'Mock Trainer'
          },
          client: {
            id: '2',
            email: 'client1@example.com',
            password: 'password123',
            role: 'CLIENT',
            name: 'Mock Client'
          }
        };

        // Check credentials against mock users
        const user = Object.values(mockUsers).find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          // Don't send the password in the session
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword as User;
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions); 