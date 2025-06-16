'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Plus, ChevronDown } from 'lucide-react';

interface AddFilterButtonProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValues: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function AddFilterButton({
  label,
  options,
  selectedValues,
  onSelect,
  placeholder: _placeholder = 'Select option'
}: AddFilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const availableOptions = options.filter(
    (option) => !selectedValues.includes(option.value)
  );

  if (availableOptions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='text-muted-foreground border-border hover:border-border justify-start border-dashed'
        >
          <Plus className='mr-2 h-4 w-4' />
          {label}
          <ChevronDown className='ml-auto h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        className='bg-background border-border w-56'
      >
        {availableOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              onSelect(option.value);
              setIsOpen(false);
            }}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
