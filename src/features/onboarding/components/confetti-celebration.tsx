'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCelebrationProps {
  trigger: boolean;
  delay?: number;
}

export function ConfettiCelebration({
  trigger,
  delay = 0
}: ConfettiCelebrationProps) {
  useEffect(() => {
    if (!trigger) return;

    const brandColors = [
      '#F65F3E', // Primary brand orange
      '#ff7961', // Lighter orange
      '#e64a2e', // Darker orange
      '#ffffff', // White
      '#f5f5f5', // Light gray
      '#ffd54f' // Complementary gold
    ];

    const fireConfetti = () => {
      // Main center burst - realistic spread
      confetti({
        particleCount: 120,
        spread: 60,
        origin: { x: 0.5, y: 0.55 },
        colors: brandColors,
        gravity: 0.9,
        drift: 0,
        scalar: 1.1,
        shapes: ['square', 'circle'],
        ticks: 300
      });

      // Left side burst
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 50,
          origin: { x: 0.3, y: 0.6 },
          colors: brandColors,
          gravity: 0.8,
          drift: 0.1,
          scalar: 0.9,
          angle: 70,
          ticks: 250
        });
      }, 150);

      // Right side burst
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 50,
          origin: { x: 0.7, y: 0.6 },
          colors: brandColors,
          gravity: 0.8,
          drift: -0.1,
          scalar: 0.9,
          angle: 110,
          ticks: 250
        });
      }, 300);

      // Final top burst for extra celebration
      setTimeout(() => {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { x: 0.5, y: 0.3 },
          colors: [brandColors[0], brandColors[5], brandColors[3]], // Focus on brand colors
          gravity: 1.1,
          scalar: 0.8,
          ticks: 200
        });
      }, 600);

      // Subtle continuous fall for 3 seconds
      const continuousFall = () => {
        confetti({
          particleCount: 3,
          spread: 120,
          origin: { x: Math.random(), y: 0 },
          colors: brandColors.slice(0, 3), // Just brand oranges
          gravity: 0.6,
          scalar: 0.6,
          drift: Math.random() * 0.4 - 0.2,
          ticks: 150
        });
      };

      // Continue falling confetti for realism
      const fallInterval = setInterval(continuousFall, 200);
      setTimeout(() => clearInterval(fallInterval), 3000);
    };

    const timeoutId = setTimeout(fireConfetti, delay);

    return () => clearTimeout(timeoutId);
  }, [trigger, delay]);

  return null; // This component doesn't render anything visible
}
