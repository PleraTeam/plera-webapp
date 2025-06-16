'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Search,
  Settings,
  Bell,
  ChevronDown,
  Info,
  Coffee,
  SettingsIcon,
  Grid,
  Folder,
  Zap,
  BarChart3,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/dropdown-menu';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent } from '../ui/dialog';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import { UserButton, OrganizationSwitcher } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedSettingsTab, setSelectedSettingsTab] = useState('general');
  const [selectedNotificationTab, setSelectedNotificationTab] =
    useState('direct');
  const [isCommandCenterOpen, setIsCommandCenterOpen] = useState(false);
  const commandCenterRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close command center
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandCenterRef.current &&
        !commandCenterRef.current.contains(event.target as Node)
      ) {
        setIsCommandCenterOpen(false);
      }
    };

    if (isCommandCenterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCommandCenterOpen]);

  return (
    <>
      <header
        className='border-border fixed top-0 right-0 left-0 z-50 flex h-10 shrink-0 items-center justify-between gap-2 border-b px-3'
        style={{ backgroundColor: '#262626' }}
      >
        {/* Left Navigation */}
        <div className='flex items-center gap-1'>
          <Link href='/dashboard/overview'>
            <Button
              variant='ghost'
              className='h-8 rounded-none px-3 text-sm font-medium text-white/80 hover:bg-white/5 hover:text-white'
            >
              Home
            </Button>
          </Link>

          <OrganizationSwitcher
            appearance={{
              elements: {
                // Main trigger button - hide logo but keep org name
                organizationSwitcherTrigger:
                  'px-3 py-1.5 hover:bg-white/5 rounded-none gap-1 text-white h-8',
                organizationPreviewAvatarBox: 'hidden',
                organizationPreviewMainIdentifier:
                  'font-semibold text-sm text-white',
                organizationPreviewSecondaryIdentifier: 'text-xs text-white/70',
                organizationSwitcherTriggerIcon: 'text-white',

                // Popover container
                organizationSwitcherPopoverCard:
                  'bg-[#2a2a2a] border-[#404040] shadow-xl rounded-lg p-0 min-w-64',
                organizationSwitcherPopoverActions: 'p-2 space-y-1',

                // Organization list container
                organizationList: 'p-2 space-y-1',
                organizationListItem: 'w-full',

                // Individual organization items in dropdown
                organizationSwitcherPreviewButton:
                  'w-full hover:bg-[#333333] rounded-md p-3 text-left flex items-center gap-3 text-white transition-colors',
                organizationPreviewAvatarContainer: 'flex-shrink-0',
                organizationPreviewTextContainer: 'flex-1 min-w-0',

                // Action buttons
                organizationSwitcherPopoverActionButton:
                  'w-full text-left hover:bg-[#333333] rounded-md p-3 text-sm text-white transition-colors flex items-center gap-3',
                organizationSwitcherPopoverActionButtonText: 'text-white',
                organizationSwitcherPopoverActionButtonIcon:
                  'text-white/70 h-4 w-4',

                // Separators
                organizationSwitcherPopoverFooter:
                  'border-t border-[#404040] pt-2 mt-2 p-2',

                // Create organization button
                organizationSwitcherPopoverActionButton__createOrganization:
                  'w-full text-left hover:bg-orange-500/10 rounded-md p-3 text-sm text-orange-500 transition-colors flex items-center gap-3',
                organizationSwitcherPopoverActionButtonText__createOrganization:
                  'text-orange-500 font-medium',
                organizationSwitcherPopoverActionButtonIcon__createOrganization:
                  'text-orange-500 h-4 w-4',

                // Manage organization button
                organizationSwitcherPopoverActionButton__manageOrganization:
                  'w-full text-left hover:bg-[#333333] rounded-md p-3 text-sm text-white/80 transition-colors flex items-center gap-3',
                organizationSwitcherPopoverActionButtonText__manageOrganization:
                  'text-white/80',
                organizationSwitcherPopoverActionButtonIcon__manageOrganization:
                  'text-white/60 h-4 w-4',

                // Personal account section
                personalAccountButton:
                  'w-full text-left hover:bg-[#333333] rounded-md p-3 text-white transition-colors flex items-center gap-3',
                personalAccountButtonText: 'text-white text-sm',
                personalAccountButtonIcon: 'text-white/70 h-4 w-4'
              }
            }}
            createOrganizationMode='modal'
            organizationProfileMode='modal'
            hidePersonal={false}
          />
        </div>

        {/* Center Search / Command Center */}
        <div className='relative mx-2 max-w-sm flex-1' ref={commandCenterRef}>
          {/* Search Input - Always rendered for positioning */}
          <div
            className='relative cursor-pointer'
            onClick={() => setIsCommandCenterOpen(true)}
          >
            <Search className='absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 transform text-white/70' />
            <Input
              placeholder='Search Plera'
              className='h-7 cursor-pointer rounded-none border-white/10 bg-white/5 pr-8 pl-6 text-sm text-white placeholder:text-white/60 focus:border-white/20 focus:bg-white/10'
              readOnly
            />
            <div className='absolute top-1/2 right-2 -translate-y-1/2 transform'>
              <span className='rounded-none border border-white/10 bg-white/5 px-1 py-0.5 text-xs text-white/60'>
                ⌘K
              </span>
            </div>
          </div>

          {/* Command Center Panel - Overlay positioned above header */}
          {isCommandCenterOpen && (
            <div className='absolute top-0 left-1/2 z-[60] w-screen max-w-3xl -translate-x-1/2 transform border border-[#404040] bg-[#2a2a2a] shadow-2xl'>
              {/* Header */}
              <div className='flex items-center gap-3 border-b border-[#404040] px-6 py-4'>
                <div className='relative flex-1'>
                  <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-white/50' />
                  <Input
                    placeholder='Search for team APIs you want to explore'
                    className='h-9 border-none bg-transparent pr-4 pl-10 text-sm text-white placeholder:text-white/50 focus:ring-0 focus:outline-none'
                    autoFocus
                  />
                </div>

                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsCommandCenterOpen(false)}
                  className='h-6 w-6 text-white/70 hover:bg-white/10 hover:text-white'
                >
                  <span className='text-sm text-white/70'>×</span>
                </Button>
              </div>

              {/* Filter Tabs */}
              <div className='flex items-center gap-1 border-b border-[#404040] px-6 py-3'>
                <span className='mr-3 text-sm text-white/70'>Search for:</span>
                {[
                  { id: 'workspaces', label: 'Workspaces', icon: Grid },
                  { id: 'campaigns', label: 'Campaigns', icon: Folder },
                  { id: 'prospects', label: 'Prospects', icon: Users },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  { id: 'automations', label: 'Automations', icon: Zap },
                  { id: 'teams', label: 'Teams', icon: Users }
                ].map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <button
                      key={filter.id}
                      className='flex items-center gap-2 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/5 hover:text-white'
                    >
                      <Icon className='h-3 w-3' />
                      {filter.label}
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className='px-6 py-4'>
                {/* Recently viewed section */}
                <div className='mb-5'>
                  <h3 className='mb-2 px-3 text-xs text-white/70'>
                    Recently viewed
                  </h3>
                  <div className='space-y-0'>
                    {[
                      {
                        name: 'Campaign Analytics',
                        workspace: 'My Workspace',
                        icon: BarChart3
                      },
                      {
                        name: 'My Workspace',
                        workspace: 'Personal',
                        icon: Grid
                      },
                      {
                        name: 'Lead Generation Campaign',
                        workspace: 'My Workspace',
                        icon: Folder
                      }
                    ].map((item, index) => (
                      <div
                        key={index}
                        className='group flex cursor-pointer items-center justify-between px-3 py-1.5 transition-colors hover:bg-white/5'
                        onClick={() => setIsCommandCenterOpen(false)}
                      >
                        <div className='flex items-center gap-2.5'>
                          <item.icon className='h-3.5 w-3.5 text-white/50' />
                          <span className='text-xs text-white'>
                            {item.name}
                          </span>
                        </div>
                        <span className='text-xs text-white/40'>
                          {item.workspace}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className='flex items-center gap-1'>
          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7 rounded-none text-white/80 hover:bg-white/5 hover:text-white'
              >
                <Settings className='h-3.5 w-3.5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='min-w-48 rounded-none border-[#404040] bg-[#2a2a2a] p-2 text-white'
            >
              <DropdownMenuItem
                className='mx-0 cursor-pointer rounded-none px-3 py-2 text-sm text-white hover:bg-white/5 focus:bg-white/5'
                onClick={() => setIsSettingsOpen(true)}
              >
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator className='bg-[#404040]' />

              <DropdownMenuItem
                className='mx-0 cursor-pointer rounded-none px-3 py-2 text-sm text-white hover:bg-white/5 focus:bg-white/5'
                asChild
              >
                <Link href='/privacy'>Privacy Policy</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='mx-0 cursor-pointer rounded-none px-3 py-2 text-sm text-white hover:bg-white/5 focus:bg-white/5'
                asChild
              >
                <Link href='/dashboard/support'>Support Center</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='mx-0 cursor-pointer rounded-none px-3 py-2 text-sm text-white hover:bg-white/5 focus:bg-white/5'
                asChild
              >
                <Link href='/security'>Trust and Security</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-7 w-7 rounded-none text-white/80 hover:bg-white/5 hover:text-white'
              >
                <Bell className='h-3.5 w-3.5' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='min-w-80 rounded-none border-[#404040] bg-[#2a2a2a] p-0 text-white'
            >
              {/* Header */}
              <div className='flex items-center justify-between border-b border-[#404040] p-4'>
                <h3 className='text-base font-medium'>Notifications</h3>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-6 rounded-none px-2 text-xs text-white/70 hover:bg-white/10 hover:text-white'
                >
                  <SettingsIcon className='mr-1 h-3 w-3' />
                  Notification settings
                </Button>
              </div>

              {/* Tabs */}
              <div className='flex border-b border-[#404040] px-4'>
                {[
                  { id: 'direct', label: 'Direct (0)' },
                  { id: 'watching', label: 'Watching (0)' },
                  { id: 'all', label: 'All (0)' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedNotificationTab(tab.id)}
                    className={`mr-4 border-b-2 px-2 py-3 text-xs font-medium transition-colors ${
                      selectedNotificationTab === tab.id
                        ? 'border-orange-500 text-white'
                        : 'border-transparent text-white/70 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Empty State */}
              <div className='p-8 text-center'>
                <div className='mb-4 flex justify-center'>
                  <Coffee className='h-12 w-12 text-white/30' />
                </div>
                <h4 className='mb-2 text-base font-medium text-white'>
                  You&apos;re all caught up
                </h4>
                <p className='text-xs text-white/70'>
                  Time to grab a coffee, or stretch a little.
                </p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-6 w-6',
                userButtonPopoverCard: 'shadow-lg border z-50',
                userButtonPopoverActionButton: 'hover:bg-accent'
              }
            }}
            showName={false}
          />
          <div className='ml-2 hidden sm:flex'>
            {/* Main Upgrade Button - Links to Pricing */}
            <Link href='/pricing'>
              <Button
                size='sm'
                className='h-7 rounded-none border-r border-orange-600 bg-orange-500 px-3 text-xs text-white hover:bg-orange-600'
              >
                Upgrade
              </Button>
            </Link>

            {/* Dropdown Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size='sm'
                  className='h-7 rounded-none bg-orange-500 px-1.5 text-xs text-white hover:bg-orange-600'
                >
                  <ChevronDown className='h-3 w-3' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='min-w-64 rounded-none border-[#404040] bg-[#2a2a2a] p-0 text-white'
              >
                {/* Usage Metrics Section */}
                <div className='space-y-4 p-4'>
                  {/* Cloud Agent Usage */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-white/70'>
                          Cloud Agent Usage
                        </span>
                        <Info className='h-3 w-3 text-white/50' />
                      </div>
                      <span className='text-sm text-white/70'>3/1000</span>
                    </div>
                    <Progress value={0.3} className='h-1 bg-white/10' />
                  </div>

                  {/* Manual Collection Runner Runs */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-white/70'>
                          Manual Collection Runner Runs
                        </span>
                        <Info className='h-3 w-3 text-white/50' />
                      </div>
                      <span className='text-sm text-white/70'>0/25</span>
                    </div>
                    <Progress value={0} className='h-1 bg-white/10' />
                  </div>

                  {/* Storage Usage */}
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-white/70'>
                          Storage Usage
                        </span>
                        <Info className='h-3 w-3 text-white/50' />
                      </div>
                      <span className='text-sm text-white/70'>0/20 MB</span>
                    </div>
                    <Progress value={0} className='h-1 bg-white/10' />
                  </div>
                </div>

                <DropdownMenuSeparator className='bg-[#404040]' />

                {/* Menu Items */}
                <div className='p-2'>
                  <DropdownMenuItem
                    className='mx-0 cursor-pointer rounded-none px-3 py-2 text-sm text-white hover:bg-white/5 focus:bg-white/5'
                    asChild
                  >
                    <Link href='/billing'>Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className='mx-0 cursor-pointer rounded-none px-3 py-2 text-sm text-white hover:bg-white/5 focus:bg-white/5'
                    asChild
                  >
                    <Link href='/billing?tab=resource-usage'>
                      Resource Usage
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className='h-[80vh] max-w-4xl rounded-none border-[#404040] bg-[#2a2a2a] p-0 text-white'>
          <div className='flex h-full'>
            {/* Left Sidebar */}
            <div className='w-56 border-r border-[#404040] bg-[#1a1a1a] p-4'>
              <nav className='space-y-0.5'>
                {[
                  { id: 'general', label: 'General', icon: Settings },
                  { id: 'themes', label: 'Themes' },
                  { id: 'shortcuts', label: 'Shortcuts' },
                  { id: 'data', label: 'Data' },
                  { id: 'add-ons', label: 'Add-ons' },
                  { id: 'certificates', label: 'Certificates' },
                  { id: 'proxy', label: 'Proxy' },
                  { id: 'feature-previews', label: 'Feature previews' },
                  { id: 'about', label: 'About' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSettingsTab(item.id)}
                    className={`flex w-full items-center gap-2 rounded-none px-2 py-1.5 text-left text-xs transition-colors ${
                      selectedSettingsTab === item.id
                        ? 'bg-[#333333] text-white'
                        : 'text-white/70 hover:bg-[#333333]/50 hover:text-white'
                    }`}
                  >
                    {item.icon && <item.icon className='h-3 w-3' />}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className='flex-1 overflow-y-auto p-4'>
              <div className='mb-4'>
                <h2 className='text-base font-medium capitalize'>
                  {selectedSettingsTab}
                </h2>
              </div>

              {selectedSettingsTab === 'general' && (
                <div className='space-y-4'>
                  <div>
                    <h3 className='mb-3 text-sm font-medium'>Request</h3>
                    <div className='space-y-3'>
                      <div>
                        <label className='mb-1 block text-xs font-medium'>
                          HTTP version
                        </label>
                        <select className='w-28 rounded-none border border-[#555555] bg-[#404040] px-2 py-1.5 text-xs text-white'>
                          <option>HTTP/1.x</option>
                          <option>HTTP/2</option>
                        </select>
                      </div>
                      <div>
                        <label className='mb-1 block text-xs font-medium'>
                          Request timeout
                        </label>
                        <div className='flex items-center gap-2'>
                          <input
                            type='number'
                            defaultValue='0'
                            className='w-16 rounded-none border border-[#555555] bg-[#404040] px-2 py-1.5 text-xs text-white'
                          />
                          <span className='text-xs text-white/70'>ms</span>
                        </div>
                        <p className='mt-1 text-xs text-white/50'>
                          Set how long a request should wait for a response
                          before timing out. To never time out, set to 0.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedSettingsTab === 'themes' && (
                <div className='space-y-4'>
                  <div>
                    <h3 className='mb-3 text-sm font-medium'>
                      Theme Selection
                    </h3>
                    <div className='space-y-3'>
                      <div>
                        <label className='mb-2 block text-xs font-medium'>
                          Choose your preferred theme
                        </label>
                        <div className='flex items-center gap-2'>
                          <ModeToggle />
                        </div>
                        <p className='mt-1 text-xs text-white/50'>
                          Toggle between light and dark themes for your
                          workspace.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedSettingsTab !== 'general' &&
                selectedSettingsTab !== 'themes' && (
                  <div className='py-12 text-center'>
                    <h3 className='mb-2 text-sm font-medium'>Coming Soon</h3>
                    <p className='text-xs text-white/70'>
                      This settings section is under development.
                    </p>
                  </div>
                )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
