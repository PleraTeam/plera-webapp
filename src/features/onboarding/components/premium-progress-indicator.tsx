'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
  completedSteps: number[];
}

export function PremiumProgressIndicator({
  totalSteps,
  currentStep,
  completedSteps
}: PremiumProgressIndicatorProps) {
  const progressPercentage = (completedSteps.length / totalSteps) * 100;
  const currentStepPercentage = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className='fixed top-0 right-0 left-0 z-50'>
      {/* Glassmorphism background */}
      <div className='bg-background/95 glassmorphism border-border/50 border-b shadow-sm'>
        <div className='relative h-1.5 w-full overflow-hidden'>
          {/* Base track with gradient */}
          <div className='from-muted/30 via-muted/20 to-muted/30 absolute inset-0 bg-gradient-to-r' />

          {/* Completed progress with gradient */}
          <motion.div
            className='from-primary via-primary/90 to-primary absolute top-0 left-0 h-full bg-gradient-to-r'
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Current step progress with glow */}
          <motion.div
            className='from-primary/60 to-primary/40 absolute top-0 left-0 h-full bg-gradient-to-r'
            initial={{ width: 0 }}
            animate={{ width: `${currentStepPercentage}%` }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Active step glow effect */}
          <motion.div
            className='via-primary/30 absolute top-0 h-full w-8 bg-gradient-to-r from-transparent to-transparent blur-sm'
            animate={{ left: `${currentStepPercentage}%` }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        {/* Step indicators */}
        <div className='absolute -top-1 right-0 left-0 flex h-4 items-center justify-between px-6 sm:px-12'>
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = completedSteps.includes(stepNumber);
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <motion.div
                key={stepNumber}
                className='relative flex items-center justify-center'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {/* Step circle */}
                <div
                  className={cn(
                    'relative h-2 w-2 rounded-full transition-all duration-300 ease-out',
                    {
                      // Completed state
                      'bg-primary ring-primary/20 scale-110 shadow-md ring-2':
                        isCompleted,
                      // Current state
                      'bg-primary ring-primary/30 scale-125 shadow-lg ring-4':
                        isCurrent,
                      // Upcoming state
                      'bg-muted-foreground/30 scale-75': isUpcoming
                    }
                  )}
                >
                  {/* Inner glow for current step */}
                  {isCurrent && (
                    <motion.div
                      className='bg-primary/40 absolute inset-0 rounded-full'
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                    />
                  )}

                  {/* Completion checkmark */}
                  <AnimatePresence>
                    {isCompleted && (
                      <motion.div
                        className='absolute inset-0 flex items-center justify-center'
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <svg
                          className='text-primary-foreground h-3 w-3'
                          viewBox='0 0 12 12'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <motion.path
                            d='M2 6l2.5 2.5L10 3'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                          />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Connection line to next step */}
                {index < totalSteps - 1 && (
                  <div className='absolute left-2 h-px w-full overflow-hidden'>
                    <div
                      className={cn('h-full transition-all duration-500', {
                        'bg-primary/60': isCompleted,
                        'bg-muted-foreground/20': !isCompleted
                      })}
                      style={{
                        width: 'calc(100vw / var(--total-steps) - 1rem)'
                      }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Step counter */}
      <motion.div
        className='text-muted-foreground bg-background/80 border-border/30 absolute top-4 right-4 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm'
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {Math.min(currentStep, totalSteps)} of {totalSteps}
      </motion.div>
    </div>
  );
}
