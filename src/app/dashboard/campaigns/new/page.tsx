import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { CampaignWizard } from '@/features/campaigns/components/campaign-wizard';

export const metadata = {
  title: 'Dashboard: Create Campaign'
};

export default function Page() {
  return (
    <PageContainer scrollable={true}>
      <div className='flex min-w-0 flex-1 flex-col space-y-6'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Create Campaign'
            description='Set up a new outreach campaign with our step-by-step wizard.'
          />
        </div>
        <Separator />
        <div className='mx-auto w-full overflow-x-auto'>
          <CampaignWizard className='w-full' />
        </div>
        n{' '}
      </div>
    </PageContainer>
  );
}
