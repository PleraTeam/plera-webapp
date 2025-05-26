'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFormData } from '../../utils/schema';

interface PreferencesStepProps {
  form: UseFormReturn<OnboardingFormData>;
}

export function PreferencesStep({ form }: PreferencesStepProps) {
  const watchPreference = form.watch('communicationPreference');

  return (
    <div className='space-y-8'>
      <div className='mb-10 text-center'>
        <p className='text-muted-foreground mx-auto max-w-lg text-base leading-relaxed'>
          How should we keep you in the loop?
        </p>
      </div>

      <div className='mx-auto grid max-w-md gap-8'>
        <FormField
          control={form.control}
          name='communicationPreference'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Communication Method *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='How would you like us to reach out?' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='Email'>Email</SelectItem>
                  <SelectItem value='Phone'>Phone</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchPreference === 'Email' && (
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='Enter your email address'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {watchPreference === 'Phone' && (
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input
                    type='tel'
                    placeholder='Enter your phone number'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name='newsletterOptIn'
          render={({ field }) => (
            <FormItem className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4'>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className='space-y-1 leading-none'>
                <FormLabel className='cursor-pointer'>
                  Subscribe to newsletter
                </FormLabel>
                <p className='text-muted-foreground text-sm'>
                  Receive product updates, tips, and industry insights. You can
                  unsubscribe at any time.
                </p>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
