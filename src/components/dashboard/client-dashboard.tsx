'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { useActivityFeed } from '@/hooks/use-activity-feed';
import {
  RefreshCw,
  Calendar,
  TrendingUp,
  AlertCircle,
  Activity,
  Users,
  Phone,
  Clock,
  Play,
  Pause,
  MessageSquare,
  Mail,
  CheckCircle2
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface ClientDashboardProps {
  clientId: string;
}

export function ClientDashboard({ clientId }: ClientDashboardProps) {
  const [agentPaused, setAgentPaused] = useState(false);

  const {
    clientMetrics,
    loading: metricsLoading,
    error: metricsError,
    refresh: refreshMetrics,
    isRefreshing: metricsRefreshing
  } = useDashboardData(clientId);

  const {
    activities,
    loading: activitiesLoading,
    error: activitiesError,
    refresh: refreshActivities
  } = useActivityFeed(clientId, { limit: 10 });

  // Error state
  if (metricsError && !clientMetrics) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription className='flex items-center justify-between'>
          <span>{metricsError}</span>
          <Button variant='outline' size='sm' onClick={refreshMetrics}>
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Loading state for initial load
  if (metricsLoading && !clientMetrics) {
    return <DashboardSkeleton />;
  }

  // No data state
  if (!clientMetrics) {
    return (
      <Alert>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>
          No client data found for ID: {clientId}
        </AlertDescription>
      </Alert>
    );
  }

  const isAgentActive = clientMetrics.Agent_Status === 'Active' && !agentPaused;

  const handleToggleAgent = () => {
    setAgentPaused(!agentPaused);
    // Here you would typically make an API call to update the agent status
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType.toLowerCase()) {
      case 'contact':
      case 'call':
        return <Phone className='h-4 w-4' />;
      case 'meeting':
      case 'appointment':
        return <Calendar className='h-4 w-4' />;
      case 'email':
        return <Mail className='h-4 w-4' />;
      case 'follow-up':
        return <Clock className='h-4 w-4' />;
      case 'lead':
        return <Users className='h-4 w-4' />;
      case 'status update':
        return <CheckCircle2 className='h-4 w-4' />;
      default:
        return <MessageSquare className='h-4 w-4' />;
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header with refresh button */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>{clientMetrics.Client_Name}</h1>
          <p className='text-muted-foreground'>Dashboard Overview</p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => {
            refreshMetrics();
            refreshActivities();
          }}
          disabled={metricsRefreshing}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${metricsRefreshing ? 'animate-spin' : ''}`}
          />
          Refresh
        </Button>
      </div>

      {/* 3 Metric Cards Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {/* Card 1: AI Agent Status */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              AI Agent Status
            </CardTitle>
            <div className='flex items-center space-x-2'>
              <div
                className={`h-2 w-2 rounded-full ${isAgentActive ? 'bg-green-500' : 'bg-red-500'}`}
              />
              <Badge variant={isAgentActive ? 'default' : 'secondary'}>
                {isAgentActive ? 'Active' : 'Paused'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <p className='text-lg font-semibold'>
                Contacted {clientMetrics.Contacts_Today} prospects today
              </p>
              <p className='text-muted-foreground text-sm'>
                Next outreach: {clientMetrics.Next_Outreach || 'Not scheduled'}
              </p>
            </div>
            <div className='flex items-center space-x-3'>
              <Switch
                checked={!agentPaused}
                onCheckedChange={handleToggleAgent}
                disabled={clientMetrics.Agent_Status !== 'Active'}
              />
              <div className='flex items-center space-x-2'>
                {isAgentActive ? (
                  <>
                    <Play className='h-4 w-4 text-green-600' />
                    <span className='text-sm'>Running</span>
                  </>
                ) : (
                  <>
                    <Pause className='h-4 w-4 text-red-600' />
                    <span className='text-sm'>Paused</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Monthly Results */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Monthly Results
            </CardTitle>
            <Calendar className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              <div className='text-4xl font-bold text-[#F65F3E]'>
                {clientMetrics.Appointments_This_Month}
              </div>
              <p className='text-muted-foreground text-sm'>
                Appointments booked
              </p>
              <p className='text-muted-foreground text-xs'>
                From {clientMetrics.Total_Contacts_This_Month} contacts
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Pipeline */}
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Pipeline</CardTitle>
            <TrendingUp className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <Users className='h-4 w-4 text-blue-600' />
                  <span className='text-sm'>Active Leads</span>
                </div>
                <span className='text-2xl font-bold'>
                  {clientMetrics.Active_Leads}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                  <TrendingUp className='h-4 w-4 text-red-600' />
                  <span className='text-sm'>Hot Prospects</span>
                </div>
                <span className='text-2xl font-bold text-red-600'>
                  {clientMetrics.Hot_Prospects}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed Section */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Activity className='h-5 w-5' />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activitiesLoading && activities.length === 0 ? (
            <div className='space-y-3'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='flex items-start gap-3'>
                  <Skeleton className='mt-1 h-4 w-4 rounded-full' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-4 w-3/4' />
                    <Skeleton className='h-3 w-1/2' />
                  </div>
                </div>
              ))}
            </div>
          ) : activitiesError ? (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{activitiesError}</AlertDescription>
            </Alert>
          ) : activities.length > 0 ? (
            <div className='space-y-4'>
              {activities.map((activity, index) => (
                <div
                  key={index}
                  className='flex items-start gap-3 border-b pb-3 last:border-b-0'
                >
                  <div className='text-muted-foreground mt-1'>
                    {getActivityIcon(activity.Activity_Type)}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='mb-1 flex items-center gap-2'>
                      <Badge variant='outline' className='text-xs'>
                        {activity.Activity_Type}
                      </Badge>
                      <span className='text-muted-foreground text-xs'>
                        {(() => {
                          try {
                            const date = new Date(activity.Timestamp);
                            return isNaN(date.getTime())
                              ? 'Invalid date'
                              : format(date, 'MMM d, HH:mm');
                          } catch {
                            return 'Invalid date';
                          }
                        })()}
                      </span>
                    </div>
                    <p className='text-sm leading-relaxed'>
                      {activity.Activity_Message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='py-8 text-center'>
              <Activity className='text-muted-foreground mx-auto mb-4 h-12 w-12' />
              <p className='text-muted-foreground'>No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Loading skeleton component
function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Header skeleton */}
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-32' />
        </div>
        <Skeleton className='h-9 w-20' />
      </div>

      {/* 3 cards skeleton */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className='h-4 w-24' />
            </CardHeader>
            <CardContent className='space-y-4'>
              <Skeleton className='h-8 w-full' />
              <Skeleton className='h-4 w-3/4' />
              <Skeleton className='h-6 w-1/2' />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity feed skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-32' />
        </CardHeader>
        <CardContent className='space-y-4'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-start gap-3'>
              <Skeleton className='mt-1 h-4 w-4 rounded-full' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-3 w-1/2' />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
