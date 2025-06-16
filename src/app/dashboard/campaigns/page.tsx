import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { CampaignListing } from '@/features/campaigns/components/campaign-listing';
import { cn } from '@/lib/utils';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard: Campaigns'
};

export default function Page() {
  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Campaigns'
            description='Manage your outreach campaigns and track performance.'
          />
          <Link
            href='/dashboard/campaigns/new'
            className={cn(buttonVariants(), 'text-xs md:text-sm')}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Create Campaign
          </Link>
        </div>
        <Separator />

        <CampaignListing />
      </div>
    </PageContainer>
  );
}
