'use client';

import { useRequireOnboarding } from '@/features/onboarding/utils/use-onboarding-status';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export function DashboardWrapper({ children }: DashboardWrapperProps) {
  const { isOnboardingCompleted, isLoaded } = useRequireOnboarding();

  if (!isLoaded) {
    return (
      <div className='space-y-4 p-6'>
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-32 w-full' />
      </div>
    );
  }

  if (!isOnboardingCompleted) {
    return null; // The hook will redirect to onboarding
  }

  return <>{children}</>;
}
