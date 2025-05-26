'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Megaphone, Users, Settings } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  current?: boolean;
  badge?: number;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();

  const navigation: NavigationItem[] = [
    {
      name: 'Home',
      href: '/dashboard',
      icon: LayoutDashboard,
      current: pathname === '/dashboard' || pathname === '/dashboard/'
    },
    {
      name: 'Campaign',
      href: '/dashboard/campaign',
      icon: Megaphone,
      current: pathname.startsWith('/dashboard/campaign')
    },
    {
      name: 'Leads',
      href: '/dashboard/leads',
      icon: Users,
      current: pathname.startsWith('/dashboard/leads'),
      badge: 3 // Example badge for new leads
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      current: pathname.startsWith('/dashboard/settings')
    }
  ];

  return (
    <div className='space-y-6'>
      {/* Main Content */}
      {children}
    </div>
  );
}
