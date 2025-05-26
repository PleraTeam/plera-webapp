'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { bottleneckOptions } from '../../utils/schema';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFormData } from '../../utils/schema';

interface RoleInfoStepProps {
  form: UseFormReturn<OnboardingFormData>;
}

export function RoleInfoStep({ form }: RoleInfoStepProps) {
  const watchBottlenecks = form.watch('businessBottlenecks');
  const isOtherSelected = watchBottlenecks?.includes('Other');

  return (
    <div className='space-y-8'>
      <div className='mb-10 text-center'>
        <p className='text-muted-foreground mx-auto max-w-lg text-base leading-relaxed'>
          What&apos;s currently holding your business back from growing faster?
        </p>
      </div>

      <div className='mx-auto grid max-w-2xl gap-8'>
        <FormField
          control={form.control}
          name='businessBottlenecks'
          render={() => (
            <FormItem>
              <FormLabel>Growth Bottlenecks *</FormLabel>
              <p className='text-muted-foreground mb-4 text-sm'>
                Select all that are slowing down your growth:
              </p>
              <div className='grid grid-cols-1 gap-3'>
                {bottleneckOptions.map((bottleneck) => (
                  <FormField
                    key={bottleneck}
                    control={form.control}
                    name='businessBottlenecks'
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={bottleneck}
                          className='flex flex-row items-start space-y-0 space-x-3'
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(bottleneck)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, bottleneck])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== bottleneck
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className='cursor-pointer text-sm font-normal'>
                            {bottleneck}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {isOtherSelected && (
          <FormField
            control={form.control}
            name='otherBottleneck'
            render={({ field }) => (
              <FormItem>
                <FormLabel>What else is slowing you down? *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Describe what other bottleneck is holding back your growth...'
                    className='min-h-[100px] resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
}
