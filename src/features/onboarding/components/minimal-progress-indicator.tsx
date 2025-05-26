'use client';

import { cn } from '@/lib/utils';

interface MinimalProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
  completedSteps: number[];
}

export function MinimalProgressIndicator({
  totalSteps,
  currentStep,
  completedSteps
}: MinimalProgressIndicatorProps) {
  const progressPercentage = (completedSteps.length / totalSteps) * 100;

  return (
    <div className='bg-background/80 border-border/20 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur-sm'>
      <div className='relative h-2 w-full overflow-hidden'>
        {/* Background line */}
        <div className='bg-muted/30 absolute inset-0' />

        {/* Progress line */}
        <div
          className='bg-primary absolute top-0 left-0 h-full transition-all duration-200 ease-out'
          style={{ width: `${progressPercentage}%` }}
        />

        {/* Step dots */}
        <div className='absolute inset-0 flex items-center justify-between px-4 sm:px-8'>
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = completedSteps.includes(stepNumber);
            const isCurrent = stepNumber === currentStep;

            return (
              <div
                key={stepNumber}
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-all duration-200 ease-out',
                  {
                    'bg-primary scale-125': isCompleted,
                    'bg-primary ring-primary/30 scale-150 ring-2': isCurrent,
                    'bg-muted-foreground/40': !isCompleted && !isCurrent
                  }
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
