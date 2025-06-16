'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Info, X, CreditCard, Star } from 'lucide-react';
import Header from '@/components/layout/header';
import Link from 'next/link';

export default function BillingPage() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedSidebar, setSelectedSidebar] = useState('plan-payments');
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'resource-usage') {
      setSelectedSidebar('resource-usage');
    }
  }, [searchParams]);

  const sidebarItems = [
    { id: 'plan-payments', label: 'Plan and payments' },
    { id: 'resource-usage', label: 'Resource usage' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'invoices', label: 'Invoices' },
    { id: 'history', label: 'History' },
    { id: 'payment-methods', label: 'Payment methods' }
  ];

  return (
    <div className='bg-background text-foreground min-h-screen'>
      <Header />

      <div className='mx-auto flex max-w-7xl pt-10'>
        {/* Left Sidebar - Fixed */}
        <div className='border-border bg-background fixed top-10 h-screen w-64 flex-shrink-0 overflow-hidden border-r'>
          <div className='p-4'>
            <h2 className='mb-4 text-base font-medium'>Billing</h2>
            <nav className='space-y-0.5'>
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSidebar(item.id)}
                  className={`w-full rounded-none px-2 py-1.5 text-left text-xs transition-colors ${
                    selectedSidebar === item.id
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className='ml-64 h-screen flex-1 overflow-y-auto'>
          <div className='mx-auto max-w-4xl px-6 py-6'>
            {selectedSidebar === 'plan-payments' && (
              <>
                {/* Header */}
                <div className='mb-6'>
                  <h1 className='mb-3 text-lg font-medium'>
                    Plan and payments
                  </h1>

                  {/* Tabs */}
                  <div className='border-border border-b'>
                    <nav className='flex space-x-6'>
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedTab(tab.id)}
                          className={`border-b-2 px-1 py-2 text-xs font-medium transition-colors ${
                            selectedTab === tab.id
                              ? 'border-orange-500 text-orange-500'
                              : 'text-muted-foreground hover:text-foreground border-transparent'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Content based on selected tab */}
                {selectedTab === 'overview' && (
                  <div className='space-y-6'>
                    {/* Upgrade Section */}
                    <div className='py-12 text-center'>
                      <div className='mb-4'>
                        {/* Astronaut Icon */}
                        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center'>
                          <Star className='h-12 w-12 text-orange-500' />
                        </div>
                      </div>

                      <h2 className='mb-2 text-base font-medium'>
                        Upgrade to a paid plan
                      </h2>
                      <p className='text-muted-foreground mb-1 text-xs'>
                        Get unlimited collaboration members and increased
                        resource limits.
                      </p>
                      <p className='text-muted-foreground mb-6 text-xs'>
                        We&apos;ve got a plan to fit every team.
                      </p>

                      <div className='space-y-2'>
                        <Button
                          asChild
                          className='h-8 rounded-none bg-orange-500 px-4 text-xs text-white hover:bg-orange-600'
                        >
                          <Link href='/pricing'>Upgrade Plan</Link>
                        </Button>

                        <div>
                          <Button
                            variant='outline'
                            className='border-border hover:bg-muted/50 h-8 rounded-none px-4 text-xs'
                          >
                            Enter purchase key
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTab === 'invoices' && (
                  <div className='space-y-4'>
                    <div className='py-12 text-center'>
                      <div className='text-muted-foreground mx-auto mb-4 flex h-12 w-12 items-center justify-center'>
                        <CreditCard className='h-8 w-8' />
                      </div>
                      <h3 className='mb-1 text-base font-medium'>
                        No invoices yet
                      </h3>
                      <p className='text-muted-foreground text-xs'>
                        Your invoices will appear here once you upgrade to a
                        paid plan.
                      </p>
                    </div>
                  </div>
                )}

                {selectedTab === 'history' && (
                  <div className='space-y-4'>
                    <div className='py-12 text-center'>
                      <div className='text-muted-foreground mx-auto mb-4 flex h-12 w-12 items-center justify-center'>
                        <Info className='h-8 w-8' />
                      </div>
                      <h3 className='mb-1 text-base font-medium'>
                        No billing history
                      </h3>
                      <p className='text-muted-foreground text-xs'>
                        Your billing history will appear here once you make
                        transactions.
                      </p>
                    </div>
                  </div>
                )}

                {selectedTab === 'payment-methods' && (
                  <div className='space-y-4'>
                    <div className='py-12 text-center'>
                      <div className='text-muted-foreground mx-auto mb-4 flex h-12 w-12 items-center justify-center'>
                        <CreditCard className='h-8 w-8' />
                      </div>
                      <h3 className='mb-1 text-base font-medium'>
                        No payment methods
                      </h3>
                      <p className='text-muted-foreground mb-4 text-xs'>
                        Add a payment method to upgrade your plan and manage
                        billing.
                      </p>
                      <Button
                        variant='outline'
                        className='border-border hover:bg-muted/50 h-8 rounded-none px-4 text-xs'
                      >
                        Add Payment Method
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {selectedSidebar === 'resource-usage' && (
              <>
                {/* Header */}
                <div className='mb-6'>
                  <h1 className='mb-2 text-lg font-medium'>Resource usage</h1>
                  <p className='text-muted-foreground text-xs'>
                    This usage as of 8:35 PM, 15 Jun 2025.
                  </p>
                </div>

                {/* Add-on resources section */}
                <div className='mb-8'>
                  <div className='mb-4 flex items-center justify-between'>
                    <div>
                      <h2 className='mb-1 text-base font-medium'>
                        Add-on resources
                      </h2>
                      <p className='text-muted-foreground text-xs'>
                        Additional add-ons for these resources can be purchased.
                      </p>
                    </div>
                    <Button
                      variant='outline'
                      className='border-border hover:bg-muted/50 h-8 rounded-none px-3 text-xs'
                    >
                      Purchase Add-ons
                    </Button>
                  </div>

                  {/* Usage items */}
                  <div className='space-y-6'>
                    {/* Campaign Runs Usage */}
                    <div>
                      <div className='mb-2 flex items-center gap-2'>
                        <h3 className='text-sm font-medium'>
                          Campaign Runs Usage
                        </h3>
                        <Info className='text-muted-foreground h-3 w-3' />
                      </div>
                      <div className='mb-2'>
                        <div className='mb-1 flex items-center justify-between text-xs'>
                          <span className='text-muted-foreground'>
                            0 / 1,000 calls
                          </span>
                          <span className='text-muted-foreground'>
                            Monthly limit resets on 13 Jul, 2025
                          </span>
                        </div>
                        <Progress value={0} className='bg-muted h-1.5' />
                      </div>
                    </div>

                    {/* Lead Lookups Usage */}
                    <div>
                      <div className='mb-2 flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <h3 className='text-sm font-medium'>
                            Lead Lookups Usage
                          </h3>
                          <Info className='text-muted-foreground h-3 w-3' />
                        </div>
                        <Link
                          href='#'
                          className='text-xs text-orange-500 hover:underline'
                        >
                          View detailed usage
                        </Link>
                      </div>
                      <div className='mb-2'>
                        <div className='mb-1 flex items-center justify-between text-xs'>
                          <span className='text-muted-foreground'>
                            0 / 1,000 calls
                          </span>
                          <span className='text-muted-foreground'>
                            Monthly limit resets on 13 Jul, 2025
                          </span>
                        </div>
                        <Progress value={0} className='bg-muted h-1.5' />
                      </div>

                      {/* Info notice */}
                      <div className='bg-muted/30 border-border mt-3 rounded-none border p-3'>
                        <div className='flex items-start gap-2'>
                          <Info className='text-muted-foreground mt-0.5 h-3 w-3 flex-shrink-0' />
                          <div>
                            <p className='text-foreground text-xs'>
                              Your lead lookup usage will include calls made by
                              scheduling campaign runs.
                              <Link
                                href='#'
                                className='text-orange-500 hover:underline'
                              >
                                Learn more about scheduling runs
                              </Link>
                            </p>
                          </div>
                          <button className='text-muted-foreground hover:text-foreground'>
                            <X className='h-3 w-3' />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* API Credits */}
                    <div>
                      <div className='mb-2 flex items-center gap-2'>
                        <h3 className='text-sm font-medium'>API Credits</h3>
                        <Info className='text-muted-foreground h-3 w-3' />
                      </div>
                      <div className='mb-2'>
                        <div className='mb-1 flex items-center justify-between text-xs'>
                          <span className='text-muted-foreground'>
                            0 / 500 credits
                          </span>
                          <span className='text-muted-foreground'>
                            Monthly limit resets on 13 Jul, 2025
                          </span>
                        </div>
                        <Progress value={0} className='bg-muted h-1.5' />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other resources section */}
                <div>
                  <div className='mb-4'>
                    <h2 className='mb-1 text-base font-medium'>
                      Other resources
                    </h2>
                    <p className='text-muted-foreground text-xs'>
                      Resources which are included in your plan.
                    </p>
                  </div>

                  {/* Manual Collection Runner Runs */}
                  <div>
                    <div className='mb-2 flex items-center gap-2'>
                      <h3 className='text-sm font-medium'>
                        Manual Collection Runner Runs
                      </h3>
                      <Info className='text-muted-foreground h-3 w-3' />
                    </div>
                    <div className='mb-2'>
                      <div className='mb-1 flex items-center justify-between text-xs'>
                        <span className='text-muted-foreground'>
                          0 / 25 runs
                        </span>
                        <span className='text-muted-foreground'>
                          Monthly limit resets on 13 Jul, 2025
                        </span>
                      </div>
                      <Progress value={0} className='bg-muted h-1.5' />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
