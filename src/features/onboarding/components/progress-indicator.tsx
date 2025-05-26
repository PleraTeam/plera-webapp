'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  steps: Array<{
    id: number;
    title: string;
    description: string;
    fields: readonly string[];
  }>;
  currentStep: number;
  completedSteps: number[];
}

export function ProgressIndicator({
  steps,
  currentStep,
  completedSteps
}: ProgressIndicatorProps) {
  return (
    <div className='mx-auto w-full max-w-4xl px-4'>
      <div className='flex items-center justify-between'>
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isNext = index < steps.length - 1;

          return (
            <div key={step.id} className='flex flex-1 items-center'>
              <div className='flex flex-col items-center'>
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200',
                    {
                      'bg-primary border-primary text-primary-foreground':
                        isCompleted,
                      'bg-primary border-primary text-primary-foreground ring-primary/20 ring-4':
                        isCurrent,
                      'bg-background border-muted-foreground/30 text-muted-foreground':
                        !isCompleted && !isCurrent
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className='h-5 w-5' />
                  ) : (
                    <span className='text-sm font-medium'>{step.id}</span>
                  )}
                </div>
                <div className='mt-2 text-center'>
                  <div
                    className={cn(
                      'text-sm font-medium',
                      isCurrent || isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </div>
                  <div className='text-muted-foreground hidden text-xs sm:block'>
                    {step.description}
                  </div>
                </div>
              </div>
              {isNext && (
                <div
                  className={cn(
                    'mx-4 h-0.5 flex-1 transition-all duration-200',
                    isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
