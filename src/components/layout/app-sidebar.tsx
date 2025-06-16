'use client';

import Link from 'next/link';
import { navItems, bottomNavItems } from '@/constants/data';

export default function AppSidebar() {
  return (
    <div className='fixed top-10 left-0 h-[calc(100vh-2.5rem)] w-72 overflow-y-auto border-r-0 bg-[#262626]'>
      {/* Create Team Button */}
      <div className='p-6'>
        <button className='w-24 border border-white/20 px-3 py-2 text-xs text-white/80 transition-colors hover:border-white hover:bg-white/5 hover:text-white'>
          Create Team
        </button>
      </div>

      {/* Section Divider */}
      <div className='mx-6 border-t border-[#404040]'></div>

      {/* Main Navigation */}
      <div className='space-y-1 p-6'>
        {navItems.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            className='block px-3 py-2 text-xs text-white/70 transition-colors hover:bg-white/5 hover:text-white'
          >
            {item.title}
          </Link>
        ))}
      </div>

      {/* Section Divider */}
      <div className='mx-6 border-t border-[#404040]'></div>

      {/* Bottom Navigation */}
      <div className='space-y-1 p-6'>
        {bottomNavItems.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            className='group flex items-center gap-2 px-3 py-2 text-xs text-white/50 hover:text-white/70'
          >
            <span className='group-hover:underline'>{item.title}</span>
            <span className='text-white/30 transition-colors group-hover:text-white/50'>
              ↗
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
