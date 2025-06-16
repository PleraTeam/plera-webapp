'use client';
import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { JourneyBoard } from './journey-board';
// import NewTaskDialog from './new-task-dialog';
import { useTaskStore } from '../utils/store';
import { Badge } from '@/components/ui/badge';
import { IconUsers, IconClock } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useUser, useOrganization } from '@clerk/nextjs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

export default function JourneyViewPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();

  const tasks = useTaskStore((state) => state.tasks);
  const isLoading = useTaskStore((state) => state.isLoading);
  const error = useTaskStore((state) => state.error);
  const fetchProspects = useTaskStore((state) => state.fetchProspects);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Get client ID using same pattern as dashboard
  const clientId =
    organization?.id || (user?.publicMetadata?.clientId as string) || null;

  useEffect(() => {
    // Fetch prospects when component mounts or clientId changes
    if (clientId) {
      fetchProspects(clientId);
    }

    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [fetchProspects, clientId]);

  // Loading state while Clerk loads user and organization data
  if (!userLoaded || !orgLoaded) {
    return <JourneyLoadingSkeleton />;
  }

  if (!user) {
    return (
      <PageContainer>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            Unable to load user information. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  // Handle users without client ID
  if (!clientId) {
    return (
      <PageContainer>
        <Alert>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            You need to join or create an organization to view your prospect
            journey. Please contact your administrator or create an organization
            to get started.
          </AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  // Show error state
  if (error) {
    return (
      <PageContainer>
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PageContainer>
    );
  }

  const totalActiveProspects = tasks.filter(
    (task) => (task as any).isActive !== false
  ).length;
  const timeAgo = formatDistanceToNow(lastUpdated, { addSuffix: true });

  return (
    <div className='flex h-full flex-col'>
      {/* Header section with padding */}
      <div className='space-y-6 px-4 py-4 md:px-6'>
        <div className='flex items-start justify-between'>
          <div className='space-y-2'>
            <Heading
              title={`Prospect Journey`}
              description='Track and manage your business prospects'
            />
            <div className='text-muted-foreground flex items-center gap-4 text-sm'>
              <div className='flex items-center gap-1'>
                <IconUsers className='h-4 w-4' />
                <span>Total Active Prospects:</span>
                <Badge variant='outline' className='ml-1'>
                  {isLoading ? '...' : totalActiveProspects}
                </Badge>
              </div>
              <div className='flex items-center gap-1'>
                <IconClock className='h-4 w-4' />
                <span>Last updated {timeAgo}</span>
              </div>
            </div>
          </div>
          {/* <NewTaskDialog /> */}
        </div>
      </div>

      {/* Board section with full width */}
      <div className='w-full flex-1'>
        {isLoading ? <JourneyLoadingSkeleton /> : <JourneyBoard />}
      </div>
    </div>
  );
}

// Loading skeleton for the journey page
function JourneyLoadingSkeleton() {
  return (
    <div className='flex h-full flex-col'>
      {/* Header skeleton */}
      <div className='space-y-6 px-4 py-4 md:px-6'>
        <div className='flex items-start justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-64' />
            <Skeleton className='h-5 w-96' />
            <div className='flex items-center gap-4'>
              <Skeleton className='h-5 w-40' />
              <Skeleton className='h-5 w-32' />
            </div>
          </div>
        </div>
      </div>

      {/* Board skeleton with full width */}
      <div className='w-full flex-1'>
        <div className='h-full w-full'>
          <div className='flex justify-start px-4 pb-4 md:px-6'>
            <div className='flex w-full flex-row items-start gap-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className='bg-secondary flex h-[75vh] min-w-[350px] flex-1 flex-col rounded-lg border'
                >
                  {/* Column header skeleton */}
                  <div className='flex flex-row items-center justify-center border-b-2 p-4'>
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-6 w-24' />
                      <Skeleton className='h-5 w-8 rounded-full' />
                    </div>
                  </div>

                  {/* Column content skeleton */}
                  <div className='flex grow flex-col gap-4 overflow-x-hidden p-2'>
                    <div className='space-y-1'>
                      {Array.from({ length: 3 }).map((_, cardIndex) => (
                        <div
                          key={cardIndex}
                          className='bg-card mb-3 rounded-lg border p-4 shadow-xs'
                        >
                          {/* Card header */}
                          <div className='mb-4 space-y-3'>
                            <div className='flex items-center gap-2'>
                              <Skeleton className='h-3 w-3 rounded-full' />
                              <Skeleton className='h-3 w-16' />
                              <div className='ml-auto'>
                                <Skeleton className='h-2 w-2 rounded-full' />
                              </div>
                            </div>
                            <div className='space-y-1'>
                              <Skeleton className='h-4 w-32' />
                              <div className='flex items-center gap-1'>
                                <Skeleton className='h-3 w-3' />
                                <Skeleton className='h-3 w-24' />
                              </div>
                            </div>
                            <div className='flex justify-end'>
                              <Skeleton className='h-5 w-16 rounded-full' />
                            </div>
                          </div>

                          {/* Card footer */}
                          <div className='space-y-2'>
                            <div className='flex gap-1'>
                              <Skeleton className='h-3 w-8' />
                              <Skeleton className='h-3 w-20' />
                            </div>
                            <div className='flex items-center gap-2'>
                              <Skeleton className='h-3 w-3' />
                              <Skeleton className='h-3 w-3' />
                              <Skeleton className='h-3 w-3' />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
