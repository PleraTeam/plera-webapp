'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useOnboardingStatus() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const isOnboardingCompleted = user?.unsafeMetadata
    ?.onboardingCompleted as boolean;

  const redirectToOnboarding = () => {
    if (isLoaded && user && !isOnboardingCompleted) {
      router.push('/onboarding');
    }
  };

  const redirectToDashboard = () => {
    if (isLoaded && user && isOnboardingCompleted) {
      router.push('/dashboard/overview');
    }
  };

  return {
    isOnboardingCompleted,
    redirectToOnboarding,
    redirectToDashboard,
    isLoaded,
    user
  };
}

export function useRequireOnboarding() {
  const { isOnboardingCompleted, redirectToOnboarding, isLoaded, user } =
    useOnboardingStatus();

  useEffect(() => {
    redirectToOnboarding();
  }, [isLoaded, user, isOnboardingCompleted, redirectToOnboarding]);

  return {
    isOnboardingCompleted,
    isLoaded,
    user
  };
}
