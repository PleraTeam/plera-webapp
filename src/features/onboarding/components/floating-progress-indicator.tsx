'use client';

import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
  completedSteps: number[];
}

export function FloatingProgressIndicator({
  totalSteps,
  currentStep,
  completedSteps
}: FloatingProgressIndicatorProps) {
  const progressPercentage = (completedSteps.length / totalSteps) * 100;
  const currentStepPercentage = ((currentStep - 1) / totalSteps) * 100;

  return (
    <motion.div
      className='mx-auto mb-12 w-full max-w-3xl'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Floating container with subtle elevation */}
      <div className='bg-card/60 glassmorphism border-border/40 relative rounded-2xl border p-6 shadow-lg shadow-black/5'>
        {/* Progress track container */}
        <div className='relative'>
          {/* Main progress track */}
          <div className='bg-muted/30 relative h-2 w-full overflow-hidden rounded-full'>
            {/* Completed progress with gradient */}
            <motion.div
              className='from-primary via-primary/90 to-primary absolute top-0 left-0 h-full rounded-full bg-gradient-to-r'
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Current step progress with glow */}
            <motion.div
              className='from-primary/50 to-primary/30 absolute top-0 left-0 h-full rounded-full bg-gradient-to-r'
              initial={{ width: 0 }}
              animate={{ width: `${currentStepPercentage}%` }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>

          {/* Step indicators */}
          <div className='absolute -top-2 right-0 left-0 flex items-center justify-between'>
            {Array.from({ length: totalSteps }, (_, index) => {
              const stepNumber = index + 1;
              const isCompleted = completedSteps.includes(stepNumber);
              const isCurrent = stepNumber === currentStep;
              const isUpcoming = stepNumber > currentStep;

              return (
                <motion.div
                  key={stepNumber}
                  className='relative flex flex-col items-center'
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
                >
                  {/* Step circle */}
                  <div
                    className={cn(
                      'relative flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ease-out',
                      {
                        // Completed state
                        'bg-primary border-primary shadow-primary/30 scale-110 shadow-md':
                          isCompleted,
                        // Current state
                        'bg-primary border-primary shadow-primary/40 ring-primary/20 scale-125 shadow-lg ring-4':
                          isCurrent,
                        // Upcoming state
                        'bg-background border-muted-foreground/40 scale-90':
                          isUpcoming
                      }
                    )}
                  >
                    {/* Inner glow for current step */}
                    {isCurrent && (
                      <motion.div
                        className='bg-primary/20 absolute inset-0 rounded-full'
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                    )}

                    {/* Step number or checkmark */}
                    <AnimatePresence>
                      {isCompleted ? (
                        <motion.svg
                          className='text-primary-foreground h-3 w-3'
                          viewBox='0 0 12 12'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                        >
                          <motion.path
                            d='M2 6l2.5 2.5L10 3'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                          />
                        </motion.svg>
                      ) : (
                        <span
                          className={cn(
                            'text-xs font-medium transition-colors duration-200',
                            {
                              'text-primary-foreground': isCurrent,
                              'text-muted-foreground': isUpcoming
                            }
                          )}
                        >
                          {stepNumber}
                        </span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Step label (hidden on mobile) */}
                  <motion.div
                    className='mt-3 hidden text-center text-xs font-medium sm:block'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <div
                      className={cn('transition-colors duration-200', {
                        'text-primary': isCurrent || isCompleted,
                        'text-muted-foreground': isUpcoming
                      })}
                    >
                      Step {stepNumber}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Progress counter and current step info */}
        <div className='border-border/30 mt-6 flex items-center justify-between border-t pt-4'>
          <motion.div
            className='text-muted-foreground text-sm'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className='hidden sm:inline'>Step </span>
            {Math.min(currentStep, totalSteps)} of {totalSteps}
            <span className='hidden sm:inline'> completed</span>
          </motion.div>

          <motion.div
            className='text-foreground text-sm font-medium'
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            {Math.round((completedSteps.length / totalSteps) * 100)}% complete
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
