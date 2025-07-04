'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard/overview': [{ title: 'Dashboard', link: '/dashboard/overview' }],
  '/dashboard/employee': [
    { title: 'Dashboard', link: '/dashboard/overview' },
    { title: 'Employee', link: '/dashboard/employee' }
  ],
  '/dashboard/campaigns': [
    { title: 'Dashboard', link: '/dashboard/overview' },
    { title: 'Campaigns', link: '/dashboard/campaigns' }
  ],
  '/dashboard/campaigns/new': [
    { title: 'Dashboard', link: '/dashboard/overview' },
    { title: 'Campaigns', link: '/dashboard/campaigns' },
    { title: 'Create Campaign', link: '/dashboard/campaigns/new' }
  ],
  '/dashboard/support': [
    { title: 'Dashboard', link: '/dashboard/overview' },
    { title: 'Support', link: '/dashboard/support' }
  ],
  '/dashboard/plans': [
    { title: 'Dashboard', link: '/dashboard/overview' },
    { title: 'Plans', link: '/dashboard/plans' }
  ],
  '/dashboard/profile': [
    { title: 'Dashboard', link: '/dashboard/overview' },
    { title: 'Profile', link: '/dashboard/profile' }
  ],
  '/dashboard/journey': [
    { title: 'Dashboard', link: '/dashboard/overview' },
    { title: 'Journey', link: '/dashboard/journey' }
  ]
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
