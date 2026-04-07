import * as Sentry from '@sentry/nextjs';

export async function register(): Promise<void> {
  // Only run on the server (not during build or on edge)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { dbConnect } = await import('@/models');
    await dbConnect();
    console.log('✅ PostgreSQL connected and schema synced');
    await import('./sentry.server.config');
    console.log('✅ Sentry server initialized');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
    console.log('✅ Sentry edge initialized');
  }
}

export const onRequestError = Sentry.captureRequestError;
