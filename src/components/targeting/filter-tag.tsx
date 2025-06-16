'use client';

import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FilterTagProps {
  label: string;
  onRemove: () => void;
  variant?: 'default' | 'secondary' | 'outline';
}

export function FilterTag({
  label,
  onRemove,
  variant = 'secondary'
}: FilterTagProps) {
  return (
    <Badge
      variant={variant}
      className='bg-muted text-muted-foreground hover:bg-muted/80 flex items-center gap-1 px-3 py-1 text-sm'
    >
      {label}
      <button
        onClick={onRemove}
        className='hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5 transition-colors'
        aria-label={`Remove ${label}`}
      >
        <X className='h-3 w-3' />
      </button>
    </Badge>
  );
}
