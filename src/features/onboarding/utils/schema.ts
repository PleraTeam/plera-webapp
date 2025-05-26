import { z } from 'zod';

export const onboardingSchema = z
  .object({
    // Step 1: Company Information
    companyName: z.string().min(1, 'Company name is required'),
    companySize: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+'], {
      required_error: 'Please select your company size'
    }),
    industry: z.string().min(1, 'Industry is required'),
    otherIndustry: z.string().optional(),

    // Step 2: Business Challenge
    businessBottlenecks: z
      .array(z.string())
      .min(1, 'Please select at least one bottleneck'),
    otherBottleneck: z.string().optional(),

    // Step 3: Target Outcomes
    primaryGoals: z
      .array(z.string())
      .min(1, 'Please select at least one outcome'),
    otherGoal: z.string().optional(),

    // Step 4: Client Acquisition
    clientAcquisitionMethods: z
      .array(z.string())
      .min(1, 'Please select at least one method')
      .max(2, 'Please select only your top 2 methods'),
    otherAcquisitionMethod: z.string().optional(),

    // Step 5: Communication Preferences
    communicationPreference: z.enum(['Email', 'Phone'], {
      required_error: 'Please select your preferred communication method'
    }),
    email: z.string().optional(),
    phone: z.string().optional(),
    newsletterOptIn: z.boolean().optional()
  })
  .refine(
    (data) => {
      // If "Other" is selected in industry, otherIndustry must be provided
      if (data.industry === 'Other') {
        return data.otherIndustry && data.otherIndustry.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Please specify your industry',
      path: ['otherIndustry']
    }
  )
  .refine(
    (data) => {
      // If "Other" is selected in businessBottlenecks, otherBottleneck must be provided
      if (data.businessBottlenecks.includes('Other')) {
        return data.otherBottleneck && data.otherBottleneck.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Please describe your other bottleneck',
      path: ['otherBottleneck']
    }
  )
  .refine(
    (data) => {
      // If "Other" is selected in primaryGoals, otherGoal must be provided
      if (data.primaryGoals.includes('Other')) {
        return data.otherGoal && data.otherGoal.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Please describe your other target outcome',
      path: ['otherGoal']
    }
  )
  .refine(
    (data) => {
      // If "Other" is selected in clientAcquisitionMethods, otherAcquisitionMethod must be provided
      if (data.clientAcquisitionMethods.includes('Other')) {
        return (
          data.otherAcquisitionMethod &&
          data.otherAcquisitionMethod.trim().length > 0
        );
      }
      return true;
    },
    {
      message: 'Please describe your other acquisition method',
      path: ['otherAcquisitionMethod']
    }
  )
  .refine(
    (data) => {
      // If Email is selected, email field must be provided and valid
      if (data.communicationPreference === 'Email') {
        return (
          data.email && data.email.trim().length > 0 && data.email.includes('@')
        );
      }
      return true;
    },
    {
      message: 'Please provide a valid email address',
      path: ['email']
    }
  )
  .refine(
    (data) => {
      // If Phone is selected, phone field must be provided
      if (data.communicationPreference === 'Phone') {
        return data.phone && data.phone.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Please provide your phone number',
      path: ['phone']
    }
  );

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export const onboardingSteps = [
  {
    id: 1,
    title: 'About Your Business',
    description: 'Help us understand your business context',
    fields: ['companyName', 'companySize', 'industry', 'otherIndustry']
  },
  {
    id: 2,
    title: 'Business Bottlenecks',
    description: "What's slowing down your growth right now?",
    fields: ['businessBottlenecks', 'otherBottleneck']
  },
  {
    id: 3,
    title: 'Target Outcomes',
    description: 'What would removing these bottlenecks unlock for you?',
    fields: ['primaryGoals', 'otherGoal']
  },
  {
    id: 4,
    title: 'Client Acquisition',
    description: 'How do you currently get most of your new clients?',
    fields: ['clientAcquisitionMethods', 'otherAcquisitionMethod']
  },
  {
    id: 5,
    title: 'Stay Connected',
    description: 'How should we keep in touch?',
    fields: ['communicationPreference', 'email', 'phone', 'newsletterOptIn']
  }
] as const;

export const industryOptions = [
  'Technology',
  'Marketing',
  'Consulting',
  'Retail',
  'Real Estate',
  'Recruitment ',
  'Other'
];

export const goalOptions = [
  'Consistent qualified leads weekly',
  'Automated meeting bookings',
  'More time for strategy, less admin',
  'Systems running on autopilot',
  'Faster delivery without burnout',
  'Staying ahead of tasks',
  'Other'
];

export const bottleneckOptions = [
  'Not enough qualified leads coming in',
  'Too much time spent on manual client outreach',
  'Overwhelming customer support/communication',
  'Admin work eating into billable hours',
  "Can't deliver services fast enough",
  'Other'
];

export const clientAcquisitionOptions = [
  'LinkedIn outreach and networking',
  'Email marketing campaigns',
  'Referrals from existing clients',
  'Cold calling prospects',
  'Social media content/ads',
  'Industry events and conferences',
  'Partnership/affiliate referrals',
  'Inbound from website/SEO',
  'Other'
];
