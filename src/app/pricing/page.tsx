'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  Info,
  X,
  Bot,
  Workflow,
  Shield,
  BarChart3,
  Users
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import { useState } from 'react';

export default function PricingPage() {
  const [selectedAddon, setSelectedAddon] = useState('ai-assistant');

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description:
        'For individuals or a small team of 3 or less to start automating business processes',
      features: [
        'Up to 3 team members',
        'Basic campaign creation',
        '5 Active campaigns',
        '30 day data retention',
        '25 automation runs',
        'Access to basic templates',
        '50 free lead lookups',
        'Basic analytics'
      ],
      addOns: [
        'Additional team members',
        'Extended data retention',
        'Advanced templates'
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const,
      current: true
    },
    {
      name: 'Professional',
      price: '$29',
      priceSubtext: 'per seat/month, billed monthly',
      description:
        'Business automation for growing teams, advanced targeting, and performance analytics',
      features: [
        'Everything in Free, plus:',
        'Unlimited team members',
        'Advanced targeting filters',
        '10,000 lead lookups',
        '10,000 automation runs',
        'Advanced analytics & reporting',
        'Custom integrations',
        'Priority email support',
        'Advanced campaign templates',
        '1 year data retention'
      ],
      addOns: [
        'Additional lead lookups',
        'Advanced integrations',
        'Custom templates',
        'Extended analytics'
      ],
      buttonText: 'Select Plan',
      buttonVariant: 'default' as const
    },
    {
      name: 'Enterprise',
      price: '$99',
      priceSubtext: 'per seat/month, billed monthly',
      description:
        'Advanced business automation with enterprise-grade security, compliance, and control',
      features: [
        'Everything in Professional, plus:',
        'Unlimited lead lookups',
        'Custom AI model training',
        'Advanced security & compliance',
        'Dedicated account manager',
        'Custom onboarding',
        'SLA guarantees',
        'Advanced role-based access',
        'Custom integrations',
        'Unlimited data retention'
      ],
      addOns: [
        'Custom AI training',
        'Dedicated infrastructure',
        'Advanced security audits',
        'Custom compliance reports',
        'White-label solutions'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const
    },
    {
      name: 'Custom',
      price: 'Custom',
      priceSubtext: 'tailored to your needs',
      description:
        'White-label solutions with complete customization, dedicated infrastructure, and premium support',
      features: [
        'Everything in Enterprise, plus:',
        'White-label platform',
        'Custom branding & UI',
        'Dedicated cloud infrastructure',
        'Custom API development',
        'Priority feature development',
        'Dedicated customer success manager',
        'Custom SLA agreements',
        'On-premise deployment options',
        'Advanced security certifications'
      ],
      addOns: [
        'Custom AI model development',
        'Dedicated data centers',
        'Custom integration development',
        'Premium compliance packages',
        'Enterprise training programs'
      ],
      buttonText: 'Contact Us',
      buttonVariant: 'outline' as const
    }
  ];

  const addOns = [
    {
      id: 'ai-assistant',
      name: 'AI Business Assistant',
      description:
        'Supercharge your business automation with our AI-powered assistant. Speed up workflows with natural-language input and contextual suggestions.',
      icon: Bot,
      features: [
        {
          name: 'AI writes campaign templates',
          free: true,
          pro: true,
          enterprise: true
        },
        {
          name: 'AI automates lead scoring',
          free: true,
          pro: true,
          enterprise: true
        },
        {
          name: 'AI optimizes messaging',
          free: true,
          pro: true,
          enterprise: true
        },
        {
          name: 'AI analyzes campaign performance',
          free: true,
          pro: true,
          enterprise: true
        },
        {
          name: 'Advanced AI training',
          free: false,
          pro: false,
          enterprise: true
        },
        { name: 'Custom AI models', free: false, pro: false, enterprise: true }
      ],
      pricing: { pro: '$15', enterprise: '$29' }
    },
    {
      id: 'automation-engine',
      name: 'Advanced Automation Engine',
      description:
        'Get unlimited monthly automation runs to scale your business processes. Schedule complex workflows and reuse automation scripts.',
      icon: Workflow,
      features: [
        {
          name: 'Unlimited automation runs',
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Advanced workflow scheduling',
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Custom automation templates',
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Multi-step campaign automation',
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Enterprise-grade orchestration',
          free: false,
          pro: false,
          enterprise: true
        },
        {
          name: 'Custom workflow APIs',
          free: false,
          pro: false,
          enterprise: true
        }
      ],
      pricing: { pro: '$12', enterprise: '$25' }
    },
    {
      id: 'team-collaboration',
      name: 'Team Collaboration Suite',
      description:
        'Enable external collaborators to not only view but also edit campaigns and share resources in team workspaces.',
      icon: Users,
      features: [
        {
          name: 'Shared team workspaces',
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Role-based permissions',
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Campaign collaboration tools',
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Team performance analytics',
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Advanced security controls',
          free: false,
          pro: false,
          enterprise: true
        },
        {
          name: 'Enterprise SSO integration',
          free: false,
          pro: false,
          enterprise: true
        }
      ],
      pricing: { pro: '$8', enterprise: '$15' }
    },
    {
      id: 'security-admin',
      name: 'Advanced Security Administration',
      description:
        'Enable enterprise-grade security for your team, and maintain org-wide security and compliance.',
      icon: Shield,
      features: [
        {
          name: 'Enterprise-grade security',
          free: false,
          pro: false,
          enterprise: true
        },
        {
          name: 'Advanced compliance reporting',
          free: false,
          pro: false,
          enterprise: true
        },
        {
          name: 'SOC 2 Type II compliance',
          free: false,
          pro: false,
          enterprise: true
        },
        {
          name: 'Advanced audit logging',
          free: false,
          pro: false,
          enterprise: true
        },
        {
          name: 'Custom security policies',
          free: false,
          pro: false,
          enterprise: true
        },
        {
          name: 'Dedicated security support',
          free: false,
          pro: false,
          enterprise: true
        }
      ],
      pricing: { enterprise: '$25' }
    },
    {
      id: 'analytics-suite',
      name: 'Advanced Analytics Suite',
      description:
        'Standardize your campaign analytics and get complete business intelligence capabilities with advanced reporting.',
      icon: BarChart3,
      features: [
        {
          name: 'Advanced campaign analytics',
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Custom dashboard creation',
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Automated reporting',
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'ROI tracking and optimization',
          free: false,
          pro: true,
          enterprise: true
        },
        {
          name: 'Enterprise data warehouse',
          free: false,
          pro: false,
          enterprise: true
        },
        {
          name: 'Custom BI integrations',
          free: false,
          pro: false,
          enterprise: true
        }
      ],
      pricing: { pro: '$10', enterprise: '$20' }
    }
  ];

  return (
    <div className='bg-background text-foreground min-h-screen'>
      <Header />

      {/* Scrollable Content */}
      <div className='h-screen overflow-y-auto pt-10'>
        <div className='container mx-auto px-6 py-12'>
          <div className='mb-12 text-center'>
            <h1 className='mb-4 text-2xl font-semibold'>
              Scale your business automation tools with your team
            </h1>
          </div>

          {/* Pricing Cards */}
          <div className='border-border mx-auto grid max-w-7xl grid-cols-1 gap-1 border md:grid-cols-2 lg:grid-cols-4'>
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative border-0 bg-transparent ${index < plans.length - 1 ? 'border-border border-r' : ''}`}
              >
                {plan.current && (
                  <Badge className='bg-muted text-muted-foreground absolute -top-3 left-4 rounded-none'>
                    CURRENT
                  </Badge>
                )}

                <div className='space-y-4 p-6'>
                  {/* Header */}
                  <div className='space-y-4'>
                    <h3 className='text-lg font-medium'>{plan.name}</h3>
                    <div>
                      <span className='text-3xl font-semibold'>
                        {plan.price}
                      </span>
                      {plan.priceSubtext && (
                        <span className='text-muted-foreground ml-2 text-xs'>
                          {plan.priceSubtext}
                        </span>
                      )}
                    </div>

                    {/* CTA Button directly under price */}
                    <Button
                      className={`h-8 w-full rounded-none text-xs ${plan.buttonVariant === 'default' ? 'bg-orange-500 text-white hover:bg-orange-600' : 'border-border hover:bg-muted/50'}`}
                      variant={plan.buttonVariant}
                      asChild
                    >
                      <Link
                        href={
                          plan.buttonText === 'Contact Sales'
                            ? '/contact'
                            : '/auth/sign-up'
                        }
                      >
                        {plan.buttonText}
                      </Link>
                    </Button>

                    <p className='text-muted-foreground text-xs leading-relaxed'>
                      {plan.description}
                    </p>
                  </div>

                  {/* What's Included */}
                  <div className='space-y-3'>
                    <h4 className='text-sm font-medium'>
                      What&apos;s included:
                    </h4>
                    <ul className='space-y-1.5'>
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className='flex items-start gap-2 text-xs'
                        >
                          <Check className='mt-0.5 h-3 w-3 flex-shrink-0 text-green-500' />
                          <span className='text-muted-foreground'>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Available Add-ons */}
                  <div className='space-y-3'>
                    <h4 className='text-sm font-medium'>
                      Available add-ons for purchase:
                    </h4>
                    <ul className='space-y-1.5'>
                      {plan.addOns.map((addon, idx) => (
                        <li
                          key={idx}
                          className='flex items-start gap-2 text-xs'
                        >
                          <div className='mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-orange-500' />
                          <span className='text-orange-500'>{addon}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add-ons Section */}
          <div className='mt-16'>
            <div className='mb-16 text-center'>
              <h2 className='mb-3 text-xl font-semibold'>
                Maximize your productivity with add-ons
              </h2>
              <p className='text-muted-foreground text-sm'>
                Leverage AI, advanced automation, and enterprise tools to
                streamline your business workflows.
              </p>
            </div>

            <div className='mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-4'>
              {/* Side Navigation */}
              <div className='lg:col-span-1'>
                <div className='space-y-0 bg-transparent p-0'>
                  {addOns.map((addon) => {
                    const Icon = addon.icon;
                    const isSelected = selectedAddon === addon.id;
                    return (
                      <button
                        key={addon.id}
                        onClick={() => setSelectedAddon(addon.id)}
                        className={`w-full rounded-none border-0 p-4 text-left transition-colors ${
                          isSelected
                            ? 'border-l-2 border-l-orange-500 bg-orange-500/5'
                            : 'hover:bg-muted/30'
                        }`}
                      >
                        <div className='flex items-start gap-3'>
                          <Icon
                            className={`mt-0.5 h-5 w-5 ${isSelected ? 'text-orange-500' : 'text-muted-foreground'}`}
                          />
                          <div className='flex-1'>
                            <h4
                              className={`mb-1 text-sm font-medium ${isSelected ? 'text-foreground' : 'text-foreground'}`}
                            >
                              {addon.name}
                            </h4>
                            <p className='text-muted-foreground text-xs leading-relaxed'>
                              {addon.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Content Area */}
              <div className='lg:col-span-3'>
                {(() => {
                  const selectedAddonData = addOns.find(
                    (addon) => addon.id === selectedAddon
                  );
                  if (!selectedAddonData) return null;

                  return (
                    <div className='space-y-4'>
                      {/* Header with description */}
                      <div className='space-y-3'>
                        <p className='text-muted-foreground text-sm leading-relaxed'>
                          {selectedAddonData.description}{' '}
                          <Link
                            href='#'
                            className='text-orange-500 hover:underline'
                          >
                            Learn More
                          </Link>
                        </p>
                      </div>

                      {/* Feature Comparison Table */}
                      <div className='space-y-4'>
                        <div className='mb-4 grid grid-cols-3 gap-4 text-center'>
                          <div>
                            <h4 className='text-muted-foreground text-sm font-medium'>
                              Feature Description
                            </h4>
                          </div>
                          <div>
                            <h4 className='text-muted-foreground text-sm font-medium'>
                              {selectedAddonData.name} for Professional plan
                            </h4>
                          </div>
                          <div>
                            <h4 className='text-muted-foreground text-sm font-medium'>
                              {selectedAddonData.name} for Enterprise plan
                            </h4>
                          </div>
                        </div>

                        {/* Feature rows */}
                        <div className='space-y-3'>
                          {selectedAddonData.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className='border-border/30 grid grid-cols-3 items-center gap-4 border-b py-2 last:border-0'
                            >
                              <div>
                                <span className='text-sm'>{feature.name}</span>
                              </div>
                              <div className='text-center'>
                                {feature.pro ? (
                                  <Check className='mx-auto h-4 w-4 text-green-500' />
                                ) : (
                                  <X className='text-muted-foreground mx-auto h-4 w-4' />
                                )}
                              </div>
                              <div className='text-center'>
                                {feature.enterprise ? (
                                  <Check className='mx-auto h-4 w-4 text-green-500' />
                                ) : (
                                  <X className='text-muted-foreground mx-auto h-4 w-4' />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className='mt-6'>
                        <div className='grid grid-cols-2 gap-6'>
                          {selectedAddonData.pricing.pro && (
                            <div className='text-center'>
                              <div className='mb-1 text-xl font-semibold'>
                                {selectedAddonData.pricing.pro}
                              </div>
                              <div className='text-muted-foreground mb-3 text-xs'>
                                per user/month
                              </div>
                              <Button
                                variant='outline'
                                size='sm'
                                className='w-full rounded-none'
                              >
                                Purchase Add-on
                              </Button>
                            </div>
                          )}
                          {selectedAddonData.pricing.enterprise && (
                            <div className='text-center'>
                              <div className='mb-1 text-xl font-semibold'>
                                {selectedAddonData.pricing.enterprise}
                              </div>
                              <div className='text-muted-foreground mb-3 text-xs'>
                                per user/month
                              </div>
                              <Button
                                variant='outline'
                                size='sm'
                                className='w-full rounded-none'
                              >
                                Purchase Add-on
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer note */}
                      <div className='text-muted-foreground mt-6 text-center text-xs'>
                        <p className='flex items-center justify-center gap-2'>
                          <Info className='h-3 w-3' />
                          This add-on can only be assigned to team members.
                          Available only on Professional and Enterprise plans.
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
