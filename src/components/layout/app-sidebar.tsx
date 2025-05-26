'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from '@/components/ui/sidebar';
import { navItems } from '@/constants/data';
import { useMediaQuery } from '@/hooks/use-media-query';
import { IconChevronRight } from '@tabler/icons-react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { Icons } from '../icons';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { useSidebar } from '@/components/ui/sidebar';

export default function AppSidebar() {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const { state } = useSidebar();

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <div className={state === 'collapsed' ? 'p-1' : 'p-2'}>
          <OrganizationSwitcher
            appearance={{
              elements: {
                organizationSwitcherTrigger:
                  state === 'collapsed'
                    ? 'p-2 w-8 h-8 justify-center hover:bg-sidebar-accent rounded-md [&>*:last-child]:hidden'
                    : 'p-2 w-full justify-start hover:bg-sidebar-accent rounded-md gap-2',
                organizationPreviewMainIdentifier:
                  state === 'collapsed' ? 'sr-only' : 'font-semibold text-sm',
                organizationPreviewSecondaryIdentifier:
                  state === 'collapsed'
                    ? 'sr-only'
                    : 'text-xs text-muted-foreground',
                organizationSwitcherPopoverCard: 'shadow-lg border z-50',
                organizationSwitcherPopoverActionButton:
                  'hover:bg-sidebar-accent',
                organizationPreviewAvatarBox:
                  state === 'collapsed' ? 'h-4 w-4' : 'h-4 w-4',
                organizationSwitcherTriggerIcon:
                  state === 'collapsed' ? 'hidden' : ''
              }
            }}
            createOrganizationMode='modal'
            organizationProfileMode='modal'
            hidePersonal={false}
          />
        </div>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel className={state === 'collapsed' ? 'sr-only' : ''}>
            Overview
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                  className='group/collapsible'
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={pathname === item.url}
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <IconChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={`flex items-center p-2 ${state === 'collapsed' ? 'justify-center' : 'justify-start'}`}
            >
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'h-8 w-8',
                    userButtonPopoverCard: 'shadow-lg border',
                    userButtonPopoverActionButton: 'hover:bg-accent',
                    userButtonBox:
                      state === 'collapsed' ? 'flex-row-reverse' : 'flex-row'
                  }
                }}
                showName={state !== 'collapsed'}
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
