'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MinimalFloatingProgressProps {
  totalSteps: number;
  currentStep: number;
  completedSteps: number[];
}

export function MinimalFloatingProgress({
  totalSteps,
  currentStep,
  completedSteps
}: MinimalFloatingProgressProps) {
  const progressPercentage = (completedSteps.length / totalSteps) * 100;

  return (
    <motion.div
      className='mx-auto mb-6 w-full max-w-2xl'
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Minimal container */}
      <div className='bg-card/40 glassmorphism border-border/30 relative rounded-xl border p-4 shadow-sm'>
        {/* Progress track container */}
        <div className='relative'>
          {/* Main progress track */}
          <div className='bg-muted/30 relative h-1.5 w-full overflow-hidden rounded-full'>
            {/* Completed progress */}
            <motion.div
              className='absolute top-0 left-0 h-full rounded-full bg-[#F65F3E]'
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>

          {/* Step indicators */}
          <div className='absolute -top-1.5 right-0 left-0 flex items-center justify-between'>
            {Array.from({ length: totalSteps }, (_, index) => {
              const stepNumber = index + 1;
              const isCompleted = completedSteps.includes(stepNumber);
              const isCurrent = stepNumber === currentStep;
              const isUpcoming = stepNumber > currentStep;

              return (
                <motion.div
                  key={stepNumber}
                  className='relative'
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  {/* Step circle */}
                  <div
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded-full border transition-all duration-200',
                      {
                        // Completed state
                        'border-[#F65F3E] bg-[#F65F3E]': isCompleted,
                        // Current state
                        'border-[#F65F3E] bg-[#F65F3E] ring-2 ring-[#F65F3E]/30':
                          isCurrent,
                        // Upcoming state
                        'bg-background border-muted-foreground/40': isUpcoming
                      }
                    )}
                  >
                    {/* Checkmark for completed steps */}
                    <AnimatePresence>
                      {isCompleted && (
                        <motion.svg
                          className='h-2.5 w-2.5 text-white'
                          viewBox='0 0 12 12'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path
                            d='M2 6l2.5 2.5L10 3'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </motion.svg>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
