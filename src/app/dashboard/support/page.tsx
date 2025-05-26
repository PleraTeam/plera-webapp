'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { CalendarDays, Mail, MessageCircle } from 'lucide-react';
import PageContainer from '@/components/layout/page-container';

export default function SupportPage() {
  const faqs = [
    {
      question: 'How do I get started with Plera?',
      answer:
        "Getting started is easy! After signing up, you'll go through our guided onboarding process that helps you set up your business profile, define your goals, and configure your preferences. The whole process takes about 5 minutes."
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers. All payments are processed securely through Stripe.'
    },
    {
      question: 'Can I change my plan at any time?',
      answer:
        "Yes! You can upgrade or downgrade your plan at any time from the Plans & Billing page. Changes take effect immediately, and you'll be charged prorated amounts for upgrades or receive credits for downgrades."
    },
    {
      question: 'Is my data secure?',
      answer:
        'Absolutely. We use enterprise-grade security measures including SSL encryption, regular security audits, and comply with SOC 2 standards. Your data is stored in secure, geographically distributed data centers.'
    },
    {
      question: 'Do you offer customer support?',
      answer:
        'Yes! We provide email support for all plans, priority support for Growth plans, and dedicated support for Enterprise customers. Our average response time is under 4 hours during business hours.'
    },
    {
      question: 'Can I integrate Plera with other tools?',
      answer:
        'Yes, Plera integrates with popular tools like CRM systems, accounting software, and communication platforms. Our API also allows for custom integrations. Check our integrations page for the full list.'
    },
    {
      question: 'What happens if I exceed my plan limits?',
      answer:
        "We'll notify you when you're approaching your limits. For client limits, you can upgrade your plan. For usage overages, we offer flexible add-on packages so you never lose access to your data."
    },
    {
      question: 'Do you offer refunds?',
      answer:
        "We offer a 14-day free trial so you can test Plera risk-free. For paid plans, we provide a 30-day money-back guarantee if you're not satisfied with our service."
    }
  ];

  return (
    <PageContainer scrollable={true}>
      <div className='mx-auto w-full max-w-4xl space-y-8'>
        {/* Hero Section */}
        <div className='space-y-4 text-center'>
          <h1 className='text-3xl font-bold'>How can we help?</h1>
          <p className='text-muted-foreground'>
            Get the support you need to succeed with Plera.
          </p>
        </div>

        {/* Support Options */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Email Support */}
          <Card>
            <CardHeader className='text-center'>
              <div className='bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                <Mail className='h-6 w-6' />
              </div>
              <CardTitle>Email Support</CardTitle>
            </CardHeader>
            <div className='flex justify-center'>
              <Badge
                variant='outline'
                className='border-green-200 text-green-600'
              >
                <div className='mr-2 h-2 w-2 rounded-full bg-green-500' />
                Average response: 2 hours
              </Badge>
            </div>
            <CardContent className='space-y-4 text-center'>
              <p className='text-muted-foreground text-sm'>
                Send us your questions and we&apos;ll get back to you quickly.
              </p>
              <div className='bg-muted rounded-lg p-4'>
                <a
                  href='mailto:info@plera.co'
                  className='text-lg font-semibold text-[#F65F3E] hover:underline'
                >
                  info@plera.co
                </a>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Response within 2 hours
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Meeting */}
          <Card>
            <CardHeader className='text-center'>
              <div className='bg-muted mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
                <CalendarDays className='h-6 w-6' />
              </div>
              <CardTitle>Schedule a Call</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-center'>
              <p className='text-muted-foreground text-sm'>
                Book a personalized 30-minute consultation with our team.
              </p>
              <div className='text-muted-foreground space-y-2 text-xs'>
                <p>Monday - Friday, 9 AM - 5 PM GMT (South Africa)</p>
                <p>Usually available within 24 hours</p>
              </div>
              <Button
                className='bg-[#F65F3E] hover:bg-[#e54a2e]'
                onClick={() =>
                  window.open(
                    'https://calendly.com/plera-team/plera-support',
                    '_blank'
                  )
                }
              >
                <CalendarDays className='mr-2 h-4 w-4' />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <p className='text-muted-foreground text-sm'>
              Quick answers to common questions about Plera.
            </p>
          </CardHeader>
          <CardContent>
            <Accordion type='single' collapsible className='w-full'>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className='text-left'>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className='text-muted-foreground text-sm leading-relaxed'>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
