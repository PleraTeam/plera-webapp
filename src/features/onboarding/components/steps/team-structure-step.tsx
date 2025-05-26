'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { clientAcquisitionOptions } from '../../utils/schema';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFormData } from '../../utils/schema';

interface TeamStructureStepProps {
  form: UseFormReturn<OnboardingFormData>;
}

export function TeamStructureStep({ form }: TeamStructureStepProps) {
  const watchMethods = form.watch('clientAcquisitionMethods');
  const isOtherSelected = watchMethods?.includes('Other');

  return (
    <div className='space-y-8'>
      <div className='mb-10 text-center'>
        <p className='text-muted-foreground mx-auto max-w-lg text-base leading-relaxed'>
          Understanding how you currently get clients helps us tailor our
          recommendations.
        </p>
      </div>

      <div className='mx-auto grid max-w-2xl gap-8'>
        <FormField
          control={form.control}
          name='clientAcquisitionMethods'
          render={() => (
            <FormItem>
              <FormLabel>Your Top Client Sources *</FormLabel>
              <p className='text-muted-foreground mb-4 text-sm'>
                Select your top 2 methods for getting new clients:
              </p>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                {clientAcquisitionOptions.map((method) => (
                  <FormField
                    key={method}
                    control={form.control}
                    name='clientAcquisitionMethods'
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={method}
                          className='flex flex-row items-start space-y-0 space-x-3'
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(method)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  // Limit to 2 selections
                                  if (field.value.length < 2) {
                                    field.onChange([...field.value, method]);
                                  }
                                } else {
                                  field.onChange(
                                    field.value?.filter(
                                      (value) => value !== method
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className='cursor-pointer text-sm leading-relaxed font-normal'>
                            {method}
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
            name='otherAcquisitionMethod'
            render={({ field }) => (
              <FormItem>
                <FormLabel>What other method do you use? *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Describe your other client acquisition method...'
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
