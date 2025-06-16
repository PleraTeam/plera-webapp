'use client';

import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FilterTag } from './filter-tag';

interface KeywordInputProps {
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
  placeholder?: string;
  maxKeywords?: number;
}

export function KeywordInput({
  keywords,
  onAddKeyword,
  onRemoveKeyword,
  placeholder = 'Enter keywords...',
  maxKeywords = 10
}: KeywordInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddKeyword = () => {
    const trimmedValue = inputValue.trim();
    if (
      trimmedValue &&
      !keywords.includes(trimmedValue) &&
      keywords.length < maxKeywords
    ) {
      onAddKeyword(trimmedValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div className='space-y-3'>
      <div className='flex gap-2'>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className='flex-1'
          disabled={keywords.length >= maxKeywords}
        />
        <Button
          type='button'
          onClick={handleAddKeyword}
          disabled={!inputValue.trim() || keywords.length >= maxKeywords}
          variant='outline'
          size='icon'
        >
          <Plus className='h-4 w-4' />
        </Button>
      </div>

      {keywords.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {keywords.map((keyword) => (
            <FilterTag
              key={keyword}
              label={keyword}
              onRemove={() => onRemoveKeyword(keyword)}
            />
          ))}
        </div>
      )}

      {keywords.length >= maxKeywords && (
        <p className='text-muted-foreground text-xs'>
          Maximum {maxKeywords} keywords allowed
        </p>
      )}
    </div>
  );
}
