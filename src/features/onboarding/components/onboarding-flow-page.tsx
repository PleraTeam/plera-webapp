'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useOnboardingStatus } from '../utils/use-onboarding-status';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  onboardingSchema,
  OnboardingFormData,
  onboardingSteps
} from '../utils/schema';
import { MinimalFloatingProgress } from './minimal-floating-progress';
import { CompletionCard } from './completion-card';
import { CompanyInfoStep } from './steps/company-info-step';
import { RoleInfoStep } from './steps/role-info-step';
import { GoalsChallengesStep } from './steps/goals-challenges-step';
import { TeamStructureStep } from './steps/team-structure-step';
import { PreferencesStep } from './steps/preferences-step';
import { toast } from 'sonner';

export function OnboardingFlowPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { isOnboardingCompleted, redirectToDashboard, isLoaded } =
    useOnboardingStatus();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      companyName: '',
      companySize: undefined,
      industry: '',
      otherIndustry: '',
      businessBottlenecks: [],
      otherBottleneck: '',
      primaryGoals: [],
      otherGoal: '',
      clientAcquisitionMethods: [],
      otherAcquisitionMethod: '',
      communicationPreference: undefined,
      email: '',
      phone: '',
      newsletterOptIn: false
    }
  });

  // Redirect to dashboard if onboarding is already completed
  useEffect(() => {
    if (isLoaded && isOnboardingCompleted) {
      redirectToDashboard();
    }
  }, [isLoaded, isOnboardingCompleted, redirectToDashboard]);

  // Show loading while checking onboarding status
  if (!isLoaded) {
    return (
      <div className='bg-background flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <p className='text-muted-foreground mt-2'>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render the onboarding form if already completed
  if (isOnboardingCompleted) {
    return null;
  }

  const validateCurrentStep = async () => {
    const currentStepConfig = onboardingSteps.find((s) => s.id === currentStep);
    if (!currentStepConfig) return false;

    const isValid = await form.trigger(currentStepConfig.fields as any);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps((prev) => [...prev, currentStep]);
    }

    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);
    try {
      // Here you would typically save the onboarding data to your backend
      // console.log('Onboarding data:', data);

      // You can also update the user's metadata in Clerk
      if (user) {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            onboardingCompleted: true,
            onboardingData: data
          }
        });
      }

      toast.success('Onboarding completed successfully!');
      router.push('/dashboard/overview');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      // console.error('Onboarding submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <CompanyInfoStep form={form} />;
      case 2:
        return <RoleInfoStep form={form} />;
      case 3:
        return <GoalsChallengesStep form={form} />;
      case 4:
        return <TeamStructureStep form={form} />;
      case 5:
        return <PreferencesStep form={form} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === onboardingSteps.length;
  const isCompletion = currentStep > onboardingSteps.length;

  return (
    <div className='bg-background flex min-h-screen flex-col items-center justify-center'>
      <div className='w-full max-w-4xl px-4 py-8'>
        {/* Minimal Progress Indicator */}
        {!isCompletion && (
          <div className='mb-6 flex justify-center'>
            <MinimalFloatingProgress
              totalSteps={onboardingSteps.length}
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>
        )}

        {/* Single Card Layout (no stacking) */}
        <div className='flex justify-center'>
          <div className='w-full max-w-2xl'>
            <div className='bg-card border-border rounded-2xl border shadow-lg'>
              <AnimatePresence mode='wait'>
                {isCompletion ? (
                  <motion.div
                    key='completion'
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CompletionCard
                      onComplete={() => handleSubmit(form.getValues())}
                      isSubmitting={isSubmitting}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className='p-6 sm:p-8'
                  >
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className='space-y-8'
                      >
                        {renderCurrentStep()}

                        {/* Navigation Buttons */}
                        <div className='flex justify-center gap-4 pt-6'>
                          {currentStep > 1 && (
                            <Button
                              type='button'
                              variant='outline'
                              onClick={handlePrevious}
                              className='flex items-center gap-2 rounded-xl transition-all duration-200'
                            >
                              <ArrowLeft className='h-4 w-4' />
                              Previous
                            </Button>
                          )}

                          <Button
                            type='button'
                            onClick={
                              isLastStep
                                ? () => setCurrentStep(currentStep + 1)
                                : handleNext
                            }
                            className='flex items-center gap-2 rounded-xl border-[#F65F3E] bg-[#F65F3E] text-white transition-all duration-200 hover:scale-105 hover:bg-[#e54a2e]'
                          >
                            {isLastStep ? 'Complete' : 'Next'}
                            <ArrowRight className='h-4 w-4' />
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
