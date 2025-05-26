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
import { goalOptions } from '../../utils/schema';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFormData } from '../../utils/schema';

interface GoalsChallengesStepProps {
  form: UseFormReturn<OnboardingFormData>;
}

export function GoalsChallengesStep({ form }: GoalsChallengesStepProps) {
  const watchGoals = form.watch('primaryGoals');
  const isOtherGoalSelected = watchGoals?.includes('Other');

  return (
    <div className='space-y-8'>
      <div className='mb-10 text-center'>
        <p className='text-muted-foreground mx-auto max-w-lg text-base leading-relaxed'>
          What would your business look like if we removed those bottlenecks?
        </p>
      </div>

      <div className='mx-auto grid max-w-2xl gap-8'>
        <FormField
          control={form.control}
          name='primaryGoals'
          render={() => (
            <FormItem>
              <FormLabel>Your Ideal Outcomes *</FormLabel>
              <p className='text-muted-foreground mb-4 text-sm'>
                Select all that would be unlocked for you:
              </p>
              <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                {goalOptions.map((goal) => (
                  <FormField
                    key={goal}
                    control={form.control}
                    name='primaryGoals'
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={goal}
                          className='flex flex-row items-start space-y-0 space-x-3'
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(goal)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, goal])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== goal
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className='cursor-pointer text-sm leading-relaxed font-normal'>
                            {goal}
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

        {isOtherGoalSelected && (
          <FormField
            control={form.control}
            name='otherGoal'
            render={({ field }) => (
              <FormItem>
                <FormLabel>What else would be unlocked? *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Describe what other outcome removing your bottlenecks would unlock...'
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
