'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Check, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DynamicFilterSearchProps {
  label: string;
  placeholder: string;
  selectedValues: string[];
  onValuesChange: (values: string[]) => void;
  searchFunction: (
    query: string
  ) => Promise<Array<{ value: string; label: string }>>;
  allowCustom?: boolean; // Allow users to add custom values
  description?: string;
}

export function DynamicFilterSearch({
  label,
  placeholder,
  selectedValues,
  onValuesChange,
  searchFunction,
  allowCustom = true,
  description
}: DynamicFilterSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [initialResults, setInitialResults] = useState<
    Array<{ value: string; label: string }>
  >([]);

  // Load initial preview results when component mounts
  useEffect(() => {
    const loadInitialResults = async () => {
      try {
        // Load initial results with common terms or empty string
        const results = await searchFunction('');
        setInitialResults(results.slice(0, 10)); // Show top 10 initially
      } catch (error) {
        console.error('Failed to load initial results:', error);
        setInitialResults([]);
      }
    };

    loadInitialResults();
  }, [searchFunction]);

  // Debounced search for user input
  useEffect(() => {
    if (searchQuery.length === 0) {
      // Show initial results when no search query
      setSearchResults(initialResults);
      return;
    }

    if (searchQuery.length < 2) {
      // Still show initial results for single character
      setSearchResults(initialResults);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchFunction(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults(initialResults); // Fall back to initial results
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchFunction, initialResults]);

  const handleSelect = (value: string) => {
    if (!selectedValues.includes(value)) {
      onValuesChange([...selectedValues, value]);
    }
    setOpen(false);
    setSearchQuery('');
  };

  const handleRemove = (value: string) => {
    onValuesChange(selectedValues.filter((v) => v !== value));
  };

  const handleAddCustom = () => {
    if (customInput.trim() && !selectedValues.includes(customInput.trim())) {
      onValuesChange([...selectedValues, customInput.trim()]);
      setCustomInput('');
      setShowCustomInput(false);
    }
  };

  return (
    <div className='space-y-3'>
      <div>
        <label className='text-foreground text-sm font-semibold'>{label}</label>
        {description && (
          <p className='text-muted-foreground mt-1 text-xs'>{description}</p>
        )}
      </div>

      {/* Selected Values */}
      <div className='border-border bg-background flex min-h-[38px] flex-wrap gap-2 rounded-md border p-2'>
        {selectedValues.map((value) => (
          <Badge key={value} variant='outline' className='px-2 py-1 text-xs'>
            {value}
            <button
              onClick={() => handleRemove(value)}
              className='hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5 transition-colors'
              aria-label={`Remove ${value}`}
            >
              <X className='h-3 w-3' />
            </button>
          </Badge>
        ))}

        {/* Add Button */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='border-muted-foreground/25 hover:border-muted-foreground/50 h-6 border border-dashed text-xs'
            >
              <Plus className='mr-1 h-3 w-3' />
              Add {label}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-80 p-0'>
            <Command>
              <CommandInput
                placeholder={placeholder}
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>
                  {isSearching ? (
                    'Searching...'
                  ) : searchQuery.length < 2 ? (
                    'Type to search...'
                  ) : (
                    <div className='space-y-2 p-2'>
                      <p className='text-muted-foreground text-sm'>
                        No results found.
                      </p>
                      {allowCustom && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            if (searchQuery.trim()) {
                              handleSelect(searchQuery.trim());
                            }
                          }}
                          className='w-full'
                        >
                          <Plus className='mr-1 h-3 w-3' />
                          Add &quot;{searchQuery}&quot;
                        </Button>
                      )}
                    </div>
                  )}
                </CommandEmpty>
                <CommandGroup>
                  {searchResults.map((result) => (
                    <CommandItem
                      key={result.value}
                      value={result.value}
                      onSelect={() => handleSelect(result.value)}
                      className='cursor-pointer'
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedValues.includes(result.value)
                            ? 'opacity-100'
                            : 'opacity-0'
                        )}
                      />
                      {result.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Custom Input Option */}
      {allowCustom && !showCustomInput && (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setShowCustomInput(true)}
          className='text-muted-foreground hover:text-foreground text-xs'
        >
          <Plus className='mr-1 h-3 w-3' />
          Add custom {label.toLowerCase()}
        </Button>
      )}

      {showCustomInput && (
        <div className='flex gap-2'>
          <Input
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder={`Enter custom ${label.toLowerCase()}...`}
            className='text-sm'
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddCustom();
              } else if (e.key === 'Escape') {
                setShowCustomInput(false);
                setCustomInput('');
              }
            }}
          />
          <Button
            size='sm'
            onClick={handleAddCustom}
            disabled={!customInput.trim()}
          >
            Add
          </Button>
          <Button
            size='sm'
            variant='outline'
            onClick={() => {
              setShowCustomInput(false);
              setCustomInput('');
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
