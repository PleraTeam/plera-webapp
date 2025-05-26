'use client';

import { ClientDashboard } from '@/components/dashboard/client-dashboard';
import {
  ErrorBoundary,
  DashboardErrorFallback
} from '@/components/error-boundary';
import { useUser, useOrganization } from '@clerk/nextjs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

export default function DashboardHomePage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();

  // Loading state while Clerk loads user and organization data
  if (!userLoaded || !orgLoaded) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>
          Unable to load user information. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  // Priority: organization ID > user metadata clientId > null for transitional state
  const clientId =
    organization?.id || (user.publicMetadata?.clientId as string) || null;

  // Handle users in transitional state (no organization or clientId)
  if (!clientId) {
    return (
      <div className='space-y-6'>
        <div className='space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Hi, {user.firstName || 'Welcome'} 👋
          </h2>
          <p className='text-muted-foreground'>Welcome to your dashboard!</p>
        </div>

        <Alert>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            You need to join or create an organization to view your dashboard
            data. Please contact your administrator or create an organization to
            get started.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={DashboardErrorFallback}>
      <div className='space-y-6'>
        {/* Welcome header */}
        <div className='space-y-2'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Hi, {user.firstName || 'Welcome'} 👋
          </h2>
          <p className='text-muted-foreground'>
            Here&apos;s what&apos;s happening with your AI agent today.
          </p>
        </div>

        {/* Main dashboard component */}
        <ClientDashboard clientId={clientId} />
      </div>
    </ErrorBoundary>
  );
}

// Loading skeleton for the dashboard page
function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-9 w-64' />
        <Skeleton className='h-5 w-96' />
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='space-y-3'>
            <Skeleton className='h-24 w-full' />
          </div>
        ))}
      </div>

      <Skeleton className='h-64 w-full' />
    </div>
  );
}
