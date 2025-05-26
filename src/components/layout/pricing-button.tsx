'use client';

import { Button } from '@/components/ui/button';
import { IconCreditCard } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export function PricingButton() {
  const router = useRouter();

  const handlePricingClick = () => {
    router.push('/dashboard/plans');
  };

  return (
    <Button
      onClick={handlePricingClick}
      variant='default'
      size='sm'
      className='gap-2 border-[#F65F3E] bg-[#F65F3E] text-white hover:bg-[#e54a2e]'
    >
      <IconCreditCard className='h-4 w-4' />
      Upgrade
    </Button>
  );
}
