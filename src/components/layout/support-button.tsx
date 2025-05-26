'use client';

import { Button } from '@/components/ui/button';
import { IconHelp } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export function SupportButton() {
  const router = useRouter();

  const handleSupportClick = () => {
    router.push('/dashboard/support');
  };

  return (
    <Button
      onClick={handleSupportClick}
      variant='ghost'
      size='icon'
      className='h-8 w-8'
    >
      <IconHelp className='h-4 w-4' />
      <span className='sr-only'>Support</span>
    </Button>
  );
}
