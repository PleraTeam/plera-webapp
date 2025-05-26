import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';

export default function PlansPage() {
  const plans = [
    {
      name: 'Starter',
      price: 29,
      description: 'Perfect for small businesses getting started',
      features: [
        'Up to 5 clients',
        'Basic reporting',
        'Email support',
        'Core integrations',
        '1 user account'
      ],
      buttonText: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Growth',
      price: 79,
      description: 'For growing businesses ready to scale',
      features: [
        'Up to 25 clients',
        'Advanced reporting & analytics',
        'Priority support',
        'All integrations',
        'Up to 5 user accounts',
        'Custom workflows',
        'API access'
      ],
      buttonText: 'Upgrade to Growth',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 199,
      description: 'For large organizations with complex needs',
      features: [
        'Unlimited clients',
        'Enterprise reporting',
        'Dedicated support',
        'Custom integrations',
        'Unlimited user accounts',
        'Advanced security',
        'White-label options',
        'SLA guarantee'
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <PageContainer scrollable={true}>
      <div className='mx-auto w-full max-w-7xl space-y-8'>
        <div className='space-y-2'>
          <h1 className='text-2xl font-bold md:text-3xl'>Plans & Billing</h1>
          <p className='text-muted-foreground text-sm md:text-base'>
            Manage your subscription and billing preferences
          </p>
        </div>

        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6'>
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative h-fit ${plan.popular ? 'border-[#F65F3E] shadow-lg' : ''}`}
            >
              {plan.popular && (
                <Badge className='absolute -top-3 left-1/2 z-10 -translate-x-1/2 transform bg-[#F65F3E] hover:bg-[#e54a2e]'>
                  Most Popular
                </Badge>
              )}
              <CardHeader className='pb-3 text-center'>
                <CardTitle className='text-lg font-bold'>{plan.name}</CardTitle>
                <div className='mt-3'>
                  <span className='text-2xl font-bold md:text-3xl'>
                    ${plan.price}
                  </span>
                  <span className='text-muted-foreground text-sm'>/month</span>
                </div>
                <p className='text-muted-foreground mt-2 line-clamp-2 text-xs md:text-sm'>
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className='space-y-4 pt-0'>
                <Button
                  className={`h-9 w-full text-sm ${
                    plan.popular
                      ? 'bg-[#F65F3E] text-white hover:bg-[#e54a2e]'
                      : 'bg-background border-input hover:bg-accent border'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.buttonText}
                </Button>

                <div className='space-y-3'>
                  <h4 className='text-sm font-semibold'>
                    What&apos;s included:
                  </h4>
                  <ul className='space-y-2'>
                    {plan.features.map((feature, index) => (
                      <li key={index} className='flex items-start gap-2'>
                        <Check className='mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-500' />
                        <span className='text-xs leading-relaxed md:text-sm'>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className='w-full'>
          <CardHeader>
            <CardTitle className='text-lg'>Billing Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-muted-foreground text-xs md:text-sm'>
              All plans include a 14-day free trial. No credit card required to
              get started.
            </p>
            <div className='bg-muted flex flex-col gap-3 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-sm font-medium'>Current Plan</p>
                <p className='text-muted-foreground text-xs'>Free Trial</p>
              </div>
              <Badge variant='outline' className='w-fit'>
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
