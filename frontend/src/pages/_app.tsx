import React from 'react';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { RouteGuard } from '@/components/navigation/RouteGuard';
import { MainLayout } from '@/components/layout/MainLayout';
import '@/styles/error-pages.css';
import '@/styles/components/loading-spinner.css';
import '@/styles/login.css';
import '@/styles/dashboard.css';
import '@/styles/layout.css';
import '@/styles/profile.css';
import '@/styles/workouts.css';
import '@/styles/error.css';

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <RouteGuard>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </RouteGuard>
    </SessionProvider>
  );
}

export default App; 