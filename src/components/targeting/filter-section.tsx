'use client';

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FilterSectionProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  children: ReactNode;
  className?: string;
}

export function FilterSection({
  title,
  icon: Icon,
  iconColor = 'text-purple-600',
  children,
  className = ''
}: FilterSectionProps) {
  return (
    <Card className={`border-0 bg-transparent shadow-none ${className}`}>
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center gap-3 text-base font-medium text-gray-900'>
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 pt-0'>{children}</CardContent>
    </Card>
  );
}
