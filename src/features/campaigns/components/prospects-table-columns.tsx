'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Mail, ExternalLink } from 'lucide-react';
import { TargetSegment } from '@/types/targeting';

export interface Prospect {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  email?: string;
  linkedinUrl: string;
  companySize?: string;
  phoneNumber?: string;
  companyWebsite?: string;
}

interface ProspectsTableMeta {
  targetSegments: TargetSegment[];
  onProspectClick: (prospect: Prospect) => void;
  onAccessEmail: (prospect: Prospect, e: React.MouseEvent) => void;
}

export const createProspectsColumns = (
  meta: ProspectsTableMeta
): ColumnDef<Prospect>[] => [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    size: 200,
    minSize: 150,
    enablePinning: true,
    cell: ({ row }) => {
      const prospect = row.original;
      return (
        <div className='flex items-center gap-3'>
          <div className='bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full'>
            <span className='text-muted-foreground text-xs font-medium'>
              {prospect.firstName?.[0] || 'U'}
              {prospect.lastName?.[0] || 'U'}
            </span>
          </div>
          <div className='min-w-0 flex-1'>
            <div className='text-foreground truncate font-medium'>
              {prospect.name || 'Unknown Name'}
            </div>
            <div className='text-muted-foreground text-xs'>
              ID: {prospect.id?.slice(-8)}
            </div>
          </div>
        </div>
      );
    }
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Title',
    size: 140,
    minSize: 100,
    cell: ({ getValue }) => (
      <span className='text-foreground truncate text-sm'>
        {(getValue() as string) || 'Unknown Title'}
      </span>
    )
  },
  {
    id: 'company',
    accessorKey: 'company',
    header: 'Company',
    size: 160,
    minSize: 120,
    cell: ({ row }) => {
      const prospect = row.original;
      return (
        <div className='flex items-center gap-3'>
          <div className='bg-muted flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full'>
            {prospect.companyWebsite ? (
              <img
                src={`https://logo.clearbit.com/${new URL(prospect.companyWebsite).hostname}?size=32`}
                alt={`${prospect.company} logo`}
                className='h-8 w-8 rounded-full object-cover'
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className='bg-muted flex h-8 w-8 items-center justify-center rounded-full'
              style={{ display: prospect.companyWebsite ? 'none' : 'flex' }}
            >
              <span className='text-muted-foreground text-xs font-medium'>
                {prospect.company?.slice(0, 2).toUpperCase() || 'CO'}
              </span>
            </div>
          </div>
          <div className='min-w-0 flex-1'>
            <div className='text-foreground truncate text-sm font-medium'>
              {prospect.company || 'Unknown Company'}
            </div>
            <div className='text-muted-foreground truncate text-xs'>
              {prospect.companySize || 'Size unknown'}
            </div>
          </div>
        </div>
      );
    }
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    size: 140,
    minSize: 100,
    cell: ({ row }) => {
      const prospect = row.original;
      if (prospect.email) {
        if (
          prospect.email.includes('@domain.com') ||
          prospect.email.includes('not_unlocked')
        ) {
          return (
            <Button
              variant='outline'
              size='sm'
              className='h-7 px-2 text-xs'
              onClick={(e) => meta.onAccessEmail(prospect, e)}
            >
              <Mail className='mr-1 h-3 w-3' />
              Access Email
            </Button>
          );
        } else {
          return (
            <div className='flex items-center gap-2'>
              <Mail className='h-3 w-3 text-green-600' />
              <span className='truncate font-mono text-xs'>
                {prospect.email}
              </span>
            </div>
          );
        }
      }
      return <span className='text-muted-foreground text-xs'>No email</span>;
    }
  },
  {
    id: 'linkedin',
    accessorKey: 'linkedinUrl',
    header: 'LinkedIn',
    size: 70,
    minSize: 50,
    cell: ({ getValue }) => {
      const linkedinUrl = getValue() as string;
      if (linkedinUrl) {
        return (
          <Button
            variant='ghost'
            size='sm'
            className='h-7 w-7 p-0'
            onClick={(e) => {
              e.stopPropagation();
              window.open(linkedinUrl, '_blank');
            }}
          >
            <ExternalLink className='h-3 w-3' />
          </Button>
        );
      }
      return <span className='text-muted-foreground text-xs'>-</span>;
    }
  }
];
