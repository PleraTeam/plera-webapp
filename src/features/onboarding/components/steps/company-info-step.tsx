'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { industryOptions } from '../../utils/schema';
import { UseFormReturn } from 'react-hook-form';
import { OnboardingFormData } from '../../utils/schema';

interface CompanyInfoStepProps {
  form: UseFormReturn<OnboardingFormData>;
}

export function CompanyInfoStep({ form }: CompanyInfoStepProps) {
  const watchIndustry = form.watch('industry');
  const isOtherIndustrySelected = watchIndustry === 'Other';

  return (
    <div className='space-y-8'>
      <div className='mb-10 text-center'>
        <h1 className='text-foreground mb-4 text-2xl font-semibold'>
          About Your Business
        </h1>
        <p className='text-muted-foreground mx-auto max-w-lg text-base leading-relaxed'>
          Let&apos;s start with the basics about your business.
        </p>
      </div>

      <div className='mx-auto grid max-w-md gap-8'>
        <FormField
          control={form.control}
          name='companyName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name *</FormLabel>
              <FormControl>
                <Input placeholder='Enter your company name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='companySize'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Size *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select company size' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='1-10'>1-10 employees</SelectItem>
                  <SelectItem value='11-50'>11-50 employees</SelectItem>
                  <SelectItem value='51-200'>51-200 employees</SelectItem>
                  <SelectItem value='201-1000'>201-1000 employees</SelectItem>
                  <SelectItem value='1000+'>1000+ employees</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='industry'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select your industry' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {industryOptions.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isOtherIndustrySelected && (
          <FormField
            control={form.control}
            name='otherIndustry'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Please specify your industry *</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter your specific industry...'
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
