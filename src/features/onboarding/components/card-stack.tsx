'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardStackProps {
  children: ReactNode;
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  isCompletion?: boolean;
}

export function CardStack({
  children,
  currentStep,
  completedSteps,
  totalSteps,
  isCompletion = false
}: CardStackProps) {
  const completedCount = completedSteps.length;

  return (
    <div className='perspective-1000 relative flex items-center justify-center'>
      {/* Completed cards stack */}
      {completedSteps.map((stepNumber, index) => {
        const stackIndex = completedCount - index;
        const offset = stackIndex * 8;
        const scale = 1 - stackIndex * 0.03;
        const opacity = 1 - stackIndex * 0.15;

        return (
          <div
            key={`completed-${stepNumber}`}
            className={cn(
              'absolute w-full max-w-2xl transition-all duration-200 ease-out',
              'bg-card border-border/60 rounded-2xl border',
              'hidden shadow-sm sm:block'
            )}
            style={{
              transform: `translateZ(-${offset}px) scale(${scale})`,
              opacity: Math.max(opacity, 0.2),
              zIndex: 10 - stackIndex
            }}
          >
            <div className='flex h-[400px] items-center justify-center p-8'>
              <div className='text-muted-foreground text-sm font-medium'>
                Step {stepNumber} Completed
              </div>
            </div>
          </div>
        );
      })}

      {/* Current/active card */}
      <div
        className={cn(
          'relative w-full max-w-2xl transition-all duration-200 ease-out',
          'bg-card border-border rounded-2xl border',
          {
            'shadow-xl shadow-black/5': !isCompletion,
            'shadow-primary/20 border-primary/20 from-card to-primary/5 bg-gradient-to-br shadow-2xl':
              isCompletion
          }
        )}
        style={{
          transform: 'translateZ(0px) scale(1)',
          zIndex: 20
        }}
      >
        {children}
      </div>

      {/* Subtle next step preview (very faint) */}
      {currentStep < totalSteps && !isCompletion && (
        <div
          className={cn(
            'absolute w-full max-w-2xl transition-all duration-200 ease-out',
            'bg-card/40 border-border/30 rounded-2xl border',
            'pointer-events-none hidden sm:block'
          )}
          style={{
            transform: 'translateZ(-12px) scale(0.97)',
            opacity: 0.1,
            zIndex: 5
          }}
        >
          <div className='h-[400px]' />
        </div>
      )}
    </div>
  );
}
