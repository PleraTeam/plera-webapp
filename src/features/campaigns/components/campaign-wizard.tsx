'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CampaignBasicsStep } from './steps/campaign-basics-step';
import { CampaignTargetingStep } from './steps/campaign-targeting-step';
import { CampaignLeadSearchStep } from './steps/campaign-lead-search-step';
import { CampaignMessagingStep } from './steps/campaign-messaging-step';
import { Check, Clock, Lock, Zap } from 'lucide-react';

interface CampaignWizardProps {
  className?: string;
}

export type CampaignStep =
  | 'basics'
  | 'targeting'
  | 'leads'
  | 'messages'
  | 'launch';

export interface CampaignWizardData {
  basics: {
    campaignGoal: string;
    companyWebsite: string;
    alternativeInput: {
      type: 'upload' | 'paste' | null;
      content: string | File | null;
    };
    analysis?: any; // Business analysis from Step 1
  };
  targeting: {
    segments: any[]; // Target segments from Step 2
  };
  leads: {
    prospects: any[]; // Found leads from Step 3
    searchStats: any; // Search result statistics
  };
  messages: {
    template: any; // Message templates from Step 4
  };
  launch: {
    // Campaign execution data from Step 5
  };
}

const initialData: CampaignWizardData = {
  basics: {
    campaignGoal: '',
    companyWebsite: '',
    alternativeInput: {
      type: null,
      content: null
    }
  },
  targeting: {
    segments: []
  },
  leads: {
    prospects: [],
    searchStats: null
  },
  messages: {
    template: null
  },
  launch: {}
};

// Development bypass data
const developmentData: CampaignWizardData = {
  basics: {
    campaignGoal: 'Lead Generation',
    companyWebsite: 'https://plera.ai',
    alternativeInput: {
      type: null,
      content: null
    },
    analysis: {
      companyName: 'Plera',
      industry: 'AI/SaaS',
      targetMarket: 'B2B Sales Teams',
      valueProposition: 'AI-powered lead generation and sales automation',
      competitors: ['Apollo', 'Outreach', 'Salesforce'],
      keyFeatures: ['Lead Discovery', 'Email Automation', 'Sales Analytics']
    }
  },
  targeting: {
    segments: [
      {
        id: '1',
        name: 'VP of Sales - Tech Companies',
        filters: {
          jobTitles: ['VP of Sales', 'Director of Sales', 'Head of Sales'],
          industries: ['Software', 'Technology', 'SaaS'],
          companySizes: [
            { label: '51-200', min: 51, max: 200 },
            { label: '201-500', min: 201, max: 500 },
            { label: '501-1000', min: 501, max: 1000 }
          ],
          locations: ['United States', 'Canada'],
          keywords: ['B2B', 'SaaS', 'Sales'],
          departments: ['Sales'],
          functions: ['Sales'],
          seniorities: ['VP', 'Director', 'Head']
        },
        priority: 'high'
      },
      {
        id: '2',
        name: 'Sales Development Representatives',
        filters: {
          jobTitles: [
            'Sales Development Representative',
            'SDR',
            'Business Development Representative'
          ],
          industries: ['Software', 'Technology'],
          companySizes: [
            { label: '11-50', min: 11, max: 50 },
            { label: '51-200', min: 51, max: 200 }
          ],
          locations: ['United States'],
          keywords: ['outbound', 'lead generation'],
          departments: ['Sales', 'Business Development'],
          functions: ['Sales', 'Business Development'],
          seniorities: ['Individual Contributor', 'Senior']
        },
        priority: 'medium'
      }
    ]
  },
  leads: {
    prospects: [],
    searchStats: null
  },
  messages: {
    template: null
  },
  launch: {}
};

const steps = [
  {
    id: 'basics' as const,
    title: 'Basics',
    description: 'Campaign goals and company details'
  },
  {
    id: 'targeting' as const,
    title: 'Targeting',
    description: 'Define your audience'
  },
  {
    id: 'leads' as const,
    title: 'Leads',
    description: 'Find matching prospects'
  },
  {
    id: 'messages' as const,
    title: 'Messages',
    description: 'Craft personalized content'
  },
  {
    id: 'launch' as const,
    title: 'Launch',
    description: 'Review and execute campaign'
  }
];

export function CampaignWizard({ className }: CampaignWizardProps) {
  const [currentStep, setCurrentStep] = useState<CampaignStep>('basics');
  const [completedSteps, setCompletedSteps] = useState<Set<CampaignStep>>(
    new Set()
  );
  const [campaignData, setCampaignData] =
    useState<CampaignWizardData>(initialData);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);

  // Check if we're in development mode
  useEffect(() => {
    setIsDevelopmentMode(process.env.NODE_ENV === 'development');
  }, []);

  const skipToLeadsStep = () => {
    setCampaignData(developmentData);
    setCompletedSteps(new Set(['basics', 'targeting'] as CampaignStep[]));
    setCurrentStep('leads');
  };

  const isStepCompleted = (stepId: CampaignStep) => completedSteps.has(stepId);
  const isStepAccessible = (stepId: CampaignStep) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

    // Current step and completed steps are always accessible
    if (stepId === currentStep || isStepCompleted(stepId)) {
      return true;
    }

    // Next step is accessible if current step is completed
    return stepIndex === currentStepIndex + 1 && isStepCompleted(currentStep);
  };

  const handleStepComplete = (stepId: CampaignStep, data: any) => {
    setCompletedSteps((prev) => new Set(prev).add(stepId));
    setCampaignData((prev) => ({
      ...prev,
      [stepId]: data
    }));

    // Auto-advance to next step if available
    const currentIndex = steps.findIndex((step) => step.id === stepId);
    const nextStep = steps[currentIndex + 1];
    if (nextStep) {
      setCurrentStep(nextStep.id);
    }
  };

  const getStepIcon = (stepId: CampaignStep) => {
    if (isStepCompleted(stepId)) {
      return <Check className='h-4 w-4' />;
    }
    if (stepId === currentStep) {
      return <Clock className='h-4 w-4' />;
    }
    return <Lock className='h-4 w-4' />;
  };

  const getStepStatus = (stepId: CampaignStep) => {
    if (isStepCompleted(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    if (isStepAccessible(stepId)) return 'accessible';
    return 'locked';
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              Create New Campaign
              <Badge variant='outline' className='text-xs'>
                Step {steps.findIndex((step) => step.id === currentStep) + 1} of{' '}
                {steps.length}
              </Badge>
            </div>
            {isDevelopmentMode && (
              <Button
                variant='outline'
                size='sm'
                onClick={skipToLeadsStep}
                className='flex items-center gap-2 text-xs'
              >
                <Zap className='h-3 w-3' />
                Skip to Leads (Dev)
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={currentStep}
            onValueChange={(value) => {
              const stepId = value as CampaignStep;
              if (isStepAccessible(stepId)) {
                setCurrentStep(stepId);
              }
            }}
          >
            {/* Progress Stepper */}
            <TabsList className='mb-8 grid w-full grid-cols-5'>
              {steps.map((step) => {
                const status = getStepStatus(step.id);
                return (
                  <TabsTrigger
                    key={step.id}
                    value={step.id}
                    disabled={!isStepAccessible(step.id)}
                    className='flex items-center gap-2'
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        status === 'completed'
                          ? 'text-green-600 dark:text-green-400'
                          : status === 'locked'
                            ? 'text-muted-foreground'
                            : ''
                      }`}
                    >
                      {getStepIcon(step.id)}
                      <span className='hidden sm:inline'>{step.title}</span>
                    </div>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Step Content */}
            <div className='space-y-6'>
              {/* Step Header */}
              <div className='space-y-2 text-center'>
                <h2 className='text-2xl font-semibold'>
                  {steps.find((step) => step.id === currentStep)?.title}
                </h2>
                <p className='text-muted-foreground'>
                  {steps.find((step) => step.id === currentStep)?.description}
                </p>
              </div>

              {/* Step Forms */}
              <TabsContent value='basics' className='mt-8 space-y-6'>
                <CampaignBasicsStep
                  data={campaignData.basics}
                  onComplete={(data) => handleStepComplete('basics', data)}
                  onDataChange={(data) =>
                    setCampaignData((prev) => ({ ...prev, basics: data }))
                  }
                />
              </TabsContent>

              <TabsContent value='targeting' className='mt-8 space-y-6'>
                {isStepCompleted('basics') && campaignData.basics.analysis ? (
                  <CampaignTargetingStep
                    businessAnalysis={campaignData.basics.analysis}
                    campaignGoal={campaignData.basics.campaignGoal}
                    onComplete={(segments) =>
                      handleStepComplete('targeting', { segments })
                    }
                    onDataChange={(segments) =>
                      setCampaignData((prev) => ({
                        ...prev,
                        targeting: { segments }
                      }))
                    }
                  />
                ) : (
                  <div className='text-muted-foreground py-12 text-center'>
                    <Lock className='mx-auto mb-4 h-12 w-12' />
                    <p>Complete the Basics step to unlock Targeting</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value='leads' className='mt-8 space-y-6'>
                {isStepCompleted('targeting') &&
                campaignData.targeting.segments.length > 0 ? (
                  <CampaignLeadSearchStep
                    targetSegments={campaignData.targeting.segments}
                    onComplete={(data) => handleStepComplete('leads', data)}
                    onDataChange={(data) =>
                      setCampaignData((prev) => ({
                        ...prev,
                        leads: data
                      }))
                    }
                    onBack={() => setCurrentStep('targeting')}
                  />
                ) : (
                  <div className='text-muted-foreground py-12 text-center'>
                    <Lock className='mx-auto mb-4 h-12 w-12' />
                    <p>Complete the Targeting step to unlock Lead Search</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value='messages' className='mt-8 space-y-6'>
                {isStepCompleted('leads') &&
                campaignData.leads.prospects.length > 0 ? (
                  <CampaignMessagingStep
                    prospects={campaignData.leads.prospects}
                    businessAnalysis={campaignData.basics.analysis}
                    campaignGoal={campaignData.basics.campaignGoal}
                    targetingCriteria={{
                      industries: Array.from(
                        new Set(
                          campaignData.targeting.segments.flatMap(
                            (segment) => segment.filters?.industries || []
                          )
                        )
                      ),
                      roles: Array.from(
                        new Set(
                          campaignData.targeting.segments.flatMap(
                            (segment) => segment.filters?.jobTitles || []
                          )
                        )
                      ),
                      companySize: Array.from(
                        new Set(
                          campaignData.targeting.segments.flatMap(
                            (segment) =>
                              segment.filters?.companySizes?.map(
                                (size: any) => size.label
                              ) || []
                          )
                        )
                      ),
                      location: Array.from(
                        new Set(
                          campaignData.targeting.segments.flatMap(
                            (segment) => segment.filters?.locations || []
                          )
                        )
                      )
                    }}
                    campaignId={`campaign-${Date.now()}`}
                    campaignName={campaignData.basics.campaignGoal}
                    onComplete={(data) => handleStepComplete('messages', data)}
                    onDataChange={(data) =>
                      setCampaignData((prev) => ({
                        ...prev,
                        messages: data
                      }))
                    }
                    onBack={() => setCurrentStep('leads')}
                  />
                ) : (
                  <div className='text-muted-foreground py-12 text-center'>
                    <Lock className='mx-auto mb-4 h-12 w-12' />
                    <p>
                      Complete the Lead Search step to unlock Message
                      Configuration
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value='launch' className='mt-8 space-y-6'>
                <div className='text-muted-foreground py-12 text-center'>
                  <Lock className='mx-auto mb-4 h-12 w-12' />
                  <p>Complete previous steps to unlock Campaign Launch</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
