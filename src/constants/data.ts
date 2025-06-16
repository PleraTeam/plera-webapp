import { NavItem } from '@/types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Workspaces',
    url: '/dashboard/overview',
    icon: 'page',
    isActive: false,
    shortcut: ['w', 'w'],
    items: []
  },
  {
    title: 'Private API Network',
    url: '/dashboard/api-network',
    icon: 'dashboard',
    shortcut: ['p', 'n'],
    isActive: false,
    items: []
  },
  {
    title: 'Reports',
    url: '/dashboard/reports',
    icon: 'post',
    shortcut: ['r', 'r'],
    isActive: false,
    items: []
  },
  {
    title: 'Insights',
    url: '/dashboard/insights',
    icon: 'media',
    shortcut: ['i', 'i'],
    isActive: false,
    items: []
  }
];

// Additional navigation items for the bottom section
export const bottomNavItems: NavItem[] = [
  {
    title: 'What is Plera',
    url: '/docs/what-is-plera',
    icon: 'help',
    isActive: false,
    shortcut: ['h', 'p'],
    items: []
  },
  {
    title: 'How to Publish',
    url: '/docs/how-to-publish',
    icon: 'post',
    isActive: false,
    shortcut: ['h', 'p'],
    items: []
  },
  {
    title: 'Learning Center',
    url: '/docs/learning-center',
    icon: 'pizza',
    isActive: false,
    shortcut: ['l', 'c'],
    items: []
  },
  {
    title: 'Support Center',
    url: '/dashboard/support',
    icon: 'user',
    isActive: false,
    shortcut: ['s', 'c'],
    items: []
  },
  {
    title: 'Plera Enterprise',
    url: '/enterprise',
    icon: 'billing',
    isActive: false,
    shortcut: ['p', 'e'],
    items: []
  },
  {
    title: 'Download Desktop App',
    url: '/download',
    icon: 'laptop',
    isActive: false,
    shortcut: ['d', 'a'],
    items: []
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
