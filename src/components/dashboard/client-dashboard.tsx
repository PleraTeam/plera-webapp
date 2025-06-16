'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import {
  RefreshCw,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock,
  Play,
  Pause,
  Mail,
  Reply,
  BarChart3,
  Info,
  ExternalLink,
  Send,
  X
} from 'lucide-react';
import PageContainer from '@/components/layout/page-container';
import { useState } from 'react';

// Mock data for email replies
const mockEmailReplies = [
  {
    id: '1',
    prospectName: 'Sarah Johnson',
    prospectEmail: 'sarah.johnson@techcorp.com',
    prospectCompany: 'TechCorp Solutions',
    prospectTitle: 'VP of Sales',
    subject: 'Re: Partnership Opportunities',
    preview: 'Very interested in your services. When can we schedule a call?',
    fullMessage:
      "Hi there,\n\nThank you for reaching out about your AI agent services. I've been looking for exactly this type of solution for our sales team.\n\nWe currently have 15 sales reps and are struggling with lead qualification and follow-up consistency. Your automated approach sounds perfect for our needs.\n\nWhen would be a good time to schedule a demo? I'm available most afternoons this week.\n\nBest regards,\nSarah Johnson\nVP of Sales, TechCorp Solutions",
    receivedAt: '2 hours ago',
    campaignName: 'Tech Companies Q4 Outreach',
    hasReplied: false
  },
  {
    id: '2',
    prospectName: 'Mike Davis',
    prospectEmail: 'mike.davis@innovatetech.io',
    prospectCompany: 'InnovateTech',
    prospectTitle: 'CEO',
    subject: 'Re: Boost Your Sales Team Performance',
    preview: 'Can you send me more details about pricing and implementation?',
    fullMessage:
      "Hello,\n\nYour email caught my attention. We've been considering automation tools for our sales process.\n\nCould you provide more information about:\n- Pricing structure\n- Implementation timeline\n- Integration with our existing CRM (Salesforce)\n- ROI metrics from similar companies\n\nI'd also like to understand the onboarding process better.\n\nThanks,\nMike Davis\nCEO, InnovateTech",
    receivedAt: '5 hours ago',
    campaignName: 'Startup Founders Campaign',
    hasReplied: true
  },
  {
    id: '3',
    prospectName: 'Lisa Chen',
    prospectEmail: 'l.chen@globalventures.com',
    prospectCompany: 'Global Ventures',
    prospectTitle: 'Sales Director',
    subject: 'Re: Transform Your Sales Process',
    preview: 'Thanks for the quick response. Moving forward with proposal.',
    fullMessage:
      "Hi,\n\nThank you for the detailed information and quick response to my questions.\n\nAfter discussing with our team, we'd like to move forward with getting a formal proposal. We're particularly interested in the enterprise package.\n\nOur team size is 25 sales professionals, and we're looking to implement by Q1 next year.\n\nPlease let me know the next steps.\n\nBest,\nLisa Chen\nSales Director, Global Ventures",
    receivedAt: 'Yesterday',
    campaignName: 'Enterprise Sales Teams',
    hasReplied: false
  }
];

interface ClientDashboardProps {
  clientId: string;
  userName?: string;
  organizationName?: string;
}

export function ClientDashboard({
  clientId,
  userName,
  organizationName
}: ClientDashboardProps) {
  const [agentPaused] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [repliedEmails, setRepliedEmails] = useState<Set<string>>(new Set());
  const [sentReplies, setSentReplies] = useState<Record<string, string>>({});
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [editReplyText, setEditReplyText] = useState('');

  const {
    clientMetrics,
    loading: metricsLoading,
    error: metricsError,
    refresh: refreshMetrics,
    isRefreshing: metricsRefreshing
  } = useDashboardData(clientId);

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

  // Reply functionality handlers
  const handleStartReply = (replyId: string) => {
    setReplyingTo(replyId);
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handleEditReply = (replyId: string, currentReply: string) => {
    setEditingReply(replyId);
    setEditReplyText(currentReply);
  };

  const handleCancelEditReply = () => {
    setEditingReply(null);
    setEditReplyText('');
  };

  const handleUpdateReply = async (reply: (typeof mockEmailReplies)[0]) => {
    if (!editReplyText.trim()) return;

    setIsSubmittingReply(true);

    try {
      // Prepare updated data for Airtable
      const updatedReplyData = {
        prospectEmail: reply.prospectEmail,
        prospectName: reply.prospectName,
        prospectCompany: reply.prospectCompany,
        originalSubject: reply.subject,
        updatedReplyMessage: editReplyText,
        originalMessageId: reply.id,
        campaignName: reply.campaignName,
        updatedAt: new Date().toISOString(),
        updatedBy: userName || 'User'
      };

      // TODO: Update in Airtable via API

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update stored reply content
      setSentReplies((prev) => ({ ...prev, [reply.id]: editReplyText }));

      // Reset edit form
      setEditingReply(null);
      setEditReplyText('');

      // Show success toast
      toast.success('Reply updated successfully!', {
        description: `Your reply to ${reply.prospectName} has been updated.`
      });
    } catch (error) {
      console.error('Failed to update reply:', error);
      toast.error('Failed to update reply', {
        description:
          'Please try again or contact support if the issue persists.'
      });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleSendReply = async (reply: (typeof mockEmailReplies)[0]) => {
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);

    try {
      // Prepare data for Airtable
      const replyData = {
        prospectEmail: reply.prospectEmail,
        prospectName: reply.prospectName,
        prospectCompany: reply.prospectCompany,
        originalSubject: reply.subject,
        replyMessage: replyText,
        originalMessageId: reply.id,
        campaignName: reply.campaignName,
        sentAt: new Date().toISOString(),
        sentBy: userName || 'User'
      };

      // TODO: Send to Airtable via API

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mark email as replied and store the reply content
      setRepliedEmails((prev) => new Set(prev).add(reply.id));
      setSentReplies((prev) => ({ ...prev, [reply.id]: replyText }));

      // Reset form
      setReplyingTo(null);
      setReplyText('');

      // Show success toast
      toast.success('Reply sent successfully!', {
        description: `Your reply to ${reply.prospectName} has been sent.`
      });
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error('Failed to send reply', {
        description:
          'Please try again or contact support if the issue persists.'
      });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        {/* Header with refresh button */}
        <div className='flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Hi, {userName ? `${userName}` : 'Welcome'} 👋
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s what&apos;s happening with{' '}
              {organizationName
                ? `${organizationName}'s`
                : clientMetrics.Client_Name
                  ? `${clientMetrics.Client_Name}'s`
                  : 'your'}{' '}
              AI agent today.
            </p>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              refreshMetrics();
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
        <div className='*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-3'>
          {/* Card 1: AI Agent Status */}
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>AI Agent Status</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {clientMetrics.Contacts_Today} contacts
              </CardTitle>
              <CardAction>
                <Badge variant={isAgentActive ? 'outline' : 'secondary'}>
                  {isAgentActive ? (
                    <>
                      <TrendingUp className='h-3 w-3' />
                      Active
                    </>
                  ) : (
                    <>
                      <TrendingDown className='h-3 w-3' />
                      Paused
                    </>
                  )}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                {isAgentActive ? 'Agent running today' : 'Agent paused'}
                {isAgentActive ? (
                  <Play className='size-4' />
                ) : (
                  <Pause className='size-4' />
                )}
              </div>
              <div className='text-muted-foreground'>
                Next outreach: {clientMetrics.Next_Outreach || 'Not scheduled'}
              </div>
            </CardFooter>
          </Card>

          {/* Card 2: Monthly Results */}
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Monthly Results</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {clientMetrics.Appointments_This_Month}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <Calendar className='h-3 w-3' />
                  This Month
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                Appointments booked <Calendar className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                From {clientMetrics.Total_Contacts_This_Month} total contacts
              </div>
            </CardFooter>
          </Card>

          {/* Card 3: Pipeline */}
          <Card className='@container/card'>
            <CardHeader>
              <CardDescription>Pipeline</CardDescription>
              <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
                {clientMetrics.Hot_Prospects}
              </CardTitle>
              <CardAction>
                <Badge variant='outline'>
                  <TrendingUp className='h-3 w-3' />
                  Hot Prospects
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className='flex-col items-start gap-1.5 text-sm'>
              <div className='line-clamp-1 flex gap-2 font-medium'>
                High-quality leads identified <TrendingUp className='size-4' />
              </div>
              <div className='text-muted-foreground'>
                {clientMetrics.Active_Leads} total active leads in pipeline
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Usage Limits Section */}
        <Card className='border-muted/50'>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <BarChart3 className='h-5 w-5' />
              Usage Limits
            </CardTitle>
            <div className='flex items-center gap-2'>
              <Info className='h-4 w-4 text-amber-500' />
              <span className='text-muted-foreground text-sm'>
                Free trial limits
              </span>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Descriptive text */}
            <div className='space-y-2'>
              <p className='text-muted-foreground text-sm leading-relaxed'>
                Your free trial includes 100 AI-powered outreach messages, 50
                prospect research queries, and 10 automated follow-ups per
                month. Track your usage below to optimize your campaigns.
              </p>
            </div>

            {/* Usage Statistics */}
            <div className='grid gap-4 md:grid-cols-3'>
              {/* Outreach Messages */}
              <div className='bg-muted/30 border-muted/50 space-y-3 rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Outreach Messages</span>
                  <span className='text-muted-foreground text-xs'>
                    78/100 used
                  </span>
                </div>
                <Progress value={78} className='h-2' />
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-xs'>
                    78% utilized
                  </span>
                  <Badge
                    variant={
                      78 > 80
                        ? 'destructive'
                        : 78 > 60
                          ? 'secondary'
                          : 'outline'
                    }
                    className='text-xs'
                  >
                    {78 > 80
                      ? 'High Usage'
                      : 78 > 60
                        ? 'Moderate'
                        : 'Low Usage'}
                  </Badge>
                </div>
              </div>

              {/* Prospect Research */}
              <div className='bg-muted/30 border-muted/50 space-y-3 rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Prospect Research</span>
                  <span className='text-muted-foreground text-xs'>
                    32/50 used
                  </span>
                </div>
                <Progress value={64} className='h-2' />
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-xs'>
                    64% utilized
                  </span>
                  <Badge
                    variant={
                      64 > 80
                        ? 'destructive'
                        : 64 > 60
                          ? 'secondary'
                          : 'outline'
                    }
                    className='text-xs'
                  >
                    {64 > 80
                      ? 'High Usage'
                      : 64 > 60
                        ? 'Moderate'
                        : 'Low Usage'}
                  </Badge>
                </div>
              </div>

              {/* Automated Follow-ups */}
              <div className='bg-muted/30 border-muted/50 space-y-3 rounded-lg border p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>
                    Automated Follow-ups
                  </span>
                  <span className='text-muted-foreground text-xs'>
                    6/10 used
                  </span>
                </div>
                <Progress value={60} className='h-2' />
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-xs'>
                    60% utilized
                  </span>
                  <Badge
                    variant={
                      60 > 80
                        ? 'destructive'
                        : 60 > 60
                          ? 'secondary'
                          : 'outline'
                    }
                    className='text-xs'
                  >
                    {60 > 80
                      ? 'High Usage'
                      : 60 > 60
                        ? 'Moderate'
                        : 'Low Usage'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className='border-muted/50 border-t pt-4'>
            <Button
              variant='link'
              className='text-primary hover:text-primary/80 h-auto p-0 text-sm font-medium'
            >
              Need more? Upgrade your plan
              <ExternalLink className='ml-1 h-3 w-3' />
            </Button>
          </CardFooter>
        </Card>

        {/* Two Column Layout for Pending Tasks and Recent Replies */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          {/* Pending Tasks Section */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Clock className='h-5 w-5' />
                Pending Tasks
              </CardTitle>
              <CardDescription>Tasks requiring your attention</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Task 1: Connect Email - Critical for agent activation */}
              <div className='space-y-3 rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950/20'>
                <div className='flex items-start justify-between'>
                  <Badge variant='destructive' className='text-xs'>
                    Important
                  </Badge>
                </div>
                <div className='space-y-2'>
                  <h4 className='text-base font-medium'>
                    Connect your email account
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    Add your email account to start sending campaigns
                  </p>
                </div>
                <Button className='w-full' variant='outline'>
                  Connect Email
                </Button>
              </div>

              {/* Task 2: Create Campaign - Critical for agent activation */}
              <div className='space-y-3 rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-950/20'>
                <div className='flex items-start justify-between'>
                  <Badge variant='destructive' className='text-xs'>
                    Important
                  </Badge>
                </div>
                <div className='space-y-2'>
                  <h4 className='text-base font-medium'>
                    Create your first campaign
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    Start reaching out to prospects with an automated campaign
                  </p>
                </div>
                <Button className='w-full' variant='outline'>
                  Create Campaign
                </Button>
              </div>

              {/* Task 3: Profile Setup - Medium priority */}
              <div className='space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20'>
                <div className='flex items-start justify-between'>
                  <Badge
                    variant='secondary'
                    className='bg-amber-100 text-xs text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                  >
                    Medium
                  </Badge>
                </div>
                <div className='space-y-2'>
                  <h4 className='text-base font-medium'>
                    Profile details incomplete
                  </h4>
                  <p className='text-muted-foreground text-sm'>
                    Add your name, your job title and your company name
                  </p>
                </div>
                <Button className='w-full' variant='outline'>
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Replies Section */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Reply className='h-5 w-5' />
                Recent Replies
              </CardTitle>
              <CardDescription>Email responses from prospects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {mockEmailReplies.map((reply) => (
                  <Dialog key={reply.id}>
                    <DialogTrigger asChild>
                      <div className='border-muted/50 hover:bg-muted/30 flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors'>
                        <div className='text-muted-foreground mt-1'>
                          <Mail className='h-4 w-4' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <div className='mb-1 flex items-center gap-2'>
                            {(reply.hasReplied ||
                              repliedEmails.has(reply.id)) && (
                              <Badge
                                variant='default'
                                className='border-green-200 bg-green-50 text-xs text-green-700'
                              >
                                Replied
                              </Badge>
                            )}
                            <span className='text-muted-foreground text-xs'>
                              {reply.receivedAt}
                            </span>
                          </div>
                          <p className='mb-1 text-sm font-medium'>
                            {reply.prospectName}
                          </p>
                          <p className='text-muted-foreground text-xs leading-relaxed'>
                            {reply.preview}
                          </p>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className='max-h-[85vh] max-w-4xl overflow-y-auto'>
                      <DialogHeader>
                        <DialogTitle className='text-lg font-semibold'>
                          Email Reply Details
                        </DialogTitle>
                      </DialogHeader>
                      <div className='space-y-8'>
                        {/* Prospect Information */}
                        <div className='space-y-4'>
                          <h3 className='text-muted-foreground border-b pb-2 text-sm font-medium tracking-wide uppercase'>
                            Prospect Information
                          </h3>
                          <div className='bg-muted/30 grid grid-cols-1 gap-6 rounded-lg border p-6 md:grid-cols-2'>
                            <div>
                              <label className='text-muted-foreground text-xs font-medium'>
                                Name
                              </label>
                              <p className='text-sm font-medium'>
                                {reply.prospectName}
                              </p>
                            </div>
                            <div>
                              <label className='text-muted-foreground text-xs font-medium'>
                                Email
                              </label>
                              <p className='text-sm'>{reply.prospectEmail}</p>
                            </div>
                            <div>
                              <label className='text-muted-foreground text-xs font-medium'>
                                Company
                              </label>
                              <p className='text-sm'>{reply.prospectCompany}</p>
                            </div>
                            <div>
                              <label className='text-muted-foreground text-xs font-medium'>
                                Title
                              </label>
                              <p className='text-sm'>{reply.prospectTitle}</p>
                            </div>
                          </div>
                        </div>

                        {/* Email Details */}
                        <div className='space-y-4'>
                          <h3 className='text-muted-foreground border-b pb-2 text-sm font-medium tracking-wide uppercase'>
                            Email Details
                          </h3>
                          <div className='space-y-4'>
                            <div>
                              <label className='text-muted-foreground text-xs font-medium'>
                                Subject
                              </label>
                              <p className='text-sm font-medium'>
                                {reply.subject}
                              </p>
                            </div>
                            <div>
                              <label className='text-muted-foreground text-xs font-medium'>
                                Campaign
                              </label>
                              <Badge variant='secondary' className='text-xs'>
                                {reply.campaignName}
                              </Badge>
                            </div>
                            <div>
                              <label className='text-muted-foreground text-xs font-medium'>
                                Received
                              </label>
                              <p className='text-sm'>{reply.receivedAt}</p>
                            </div>
                            {(reply.hasReplied ||
                              repliedEmails.has(reply.id)) && (
                              <div>
                                <label className='text-muted-foreground text-xs font-medium'>
                                  Status
                                </label>
                                <Badge
                                  variant='default'
                                  className='border-green-200 bg-green-50 text-xs text-green-700'
                                >
                                  Replied
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Message Content */}
                        <div className='space-y-4'>
                          <h3 className='text-muted-foreground border-b pb-2 text-sm font-medium tracking-wide uppercase'>
                            Message
                          </h3>
                          <div className='bg-muted/30 border-muted/50 rounded-lg border p-6'>
                            <p className='text-sm leading-relaxed whitespace-pre-line'>
                              {reply.fullMessage}
                            </p>
                          </div>
                        </div>

                        {/* Reply Section */}
                        {(reply.hasReplied || repliedEmails.has(reply.id)) &&
                        !editingReply ? (
                          // Show sent reply with edit option
                          <div className='space-y-6 border-t pt-6'>
                            <h3 className='text-muted-foreground border-b pb-2 text-sm font-medium tracking-wide uppercase'>
                              Your Reply
                            </h3>
                            <div className='rounded-lg border border-green-200 bg-green-50 p-6 shadow-sm dark:border-green-800 dark:bg-green-950/20'>
                              <div className='mb-3 space-y-2'>
                                <div className='text-sm font-medium'>
                                  Re: {reply.subject}
                                </div>
                                <div className='text-muted-foreground text-xs'>
                                  To: {reply.prospectEmail}
                                </div>
                              </div>
                              <p className='text-sm leading-relaxed whitespace-pre-line'>
                                {sentReplies[reply.id] ||
                                  'Reply content stored in Airtable'}
                              </p>
                            </div>
                            <div className='flex justify-center'>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={() =>
                                  handleEditReply(
                                    reply.id,
                                    sentReplies[reply.id] || ''
                                  )
                                }
                                className='min-w-[120px]'
                              >
                                Edit Reply
                              </Button>
                            </div>
                          </div>
                        ) : editingReply === reply.id ? (
                          // Show edit reply form
                          <div className='space-y-6 border-t pt-6'>
                            <h3 className='text-muted-foreground border-b pb-2 text-sm font-medium tracking-wide uppercase'>
                              Edit Reply
                            </h3>

                            {/* Edit Reply Form */}
                            <div className='bg-muted/30 space-y-6 rounded-lg border p-6 shadow-sm'>
                              <div className='space-y-2'>
                                <Label
                                  htmlFor='edit-reply-subject'
                                  className='text-sm font-medium'
                                >
                                  Subject
                                </Label>
                                <div className='bg-background text-muted-foreground rounded border p-2 text-sm'>
                                  Re: {reply.subject}
                                </div>
                              </div>

                              <div className='space-y-2'>
                                <Label
                                  htmlFor='edit-reply-message'
                                  className='text-sm font-medium'
                                >
                                  Message
                                </Label>
                                <Textarea
                                  id='edit-reply-message'
                                  placeholder='Edit your reply...'
                                  value={editReplyText}
                                  onChange={(e) =>
                                    setEditReplyText(e.target.value)
                                  }
                                  rows={6}
                                  className='min-h-[120px] resize-none'
                                />
                              </div>

                              <div className='text-muted-foreground text-xs'>
                                To: {reply.prospectEmail}
                              </div>
                            </div>

                            {/* Edit Reply Action Buttons */}
                            <div className='flex justify-center gap-4'>
                              <Button
                                size='sm'
                                onClick={() => handleUpdateReply(reply)}
                                disabled={
                                  !editReplyText.trim() || isSubmittingReply
                                }
                                className='flex min-w-[140px] items-center gap-2'
                              >
                                {isSubmittingReply ? (
                                  <>
                                    <div className='h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent' />
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <Send className='h-3 w-3' />
                                    Update Reply
                                  </>
                                )}
                              </Button>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={handleCancelEditReply}
                                disabled={isSubmittingReply}
                                className='min-w-[100px]'
                              >
                                <X className='mr-1 h-3 w-3' />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : replyingTo === reply.id ? (
                          <div className='space-y-6 border-t pt-6'>
                            <h3 className='text-muted-foreground border-b pb-2 text-sm font-medium tracking-wide uppercase'>
                              Compose Reply
                            </h3>

                            {/* Reply Form */}
                            <div className='bg-muted/30 space-y-6 rounded-lg border p-6 shadow-sm'>
                              <div className='space-y-3'>
                                <Label
                                  htmlFor='reply-subject'
                                  className='text-sm font-semibold'
                                >
                                  Subject
                                </Label>
                                <div className='bg-background text-muted-foreground rounded-md border p-3 text-sm font-medium'>
                                  Re: {reply.subject}
                                </div>
                              </div>

                              <div className='space-y-3'>
                                <Label
                                  htmlFor='reply-message'
                                  className='text-sm font-semibold'
                                >
                                  Message
                                </Label>
                                <Textarea
                                  id='reply-message'
                                  placeholder='Type your reply here...'
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  rows={8}
                                  className='min-h-[160px] resize-none text-sm leading-relaxed'
                                />
                              </div>

                              <div className='text-muted-foreground text-xs'>
                                To: {reply.prospectEmail}
                              </div>
                            </div>

                            {/* Reply Action Buttons */}
                            <div className='flex justify-center gap-4'>
                              <Button
                                size='sm'
                                onClick={() => handleSendReply(reply)}
                                disabled={
                                  !replyText.trim() || isSubmittingReply
                                }
                                className='flex min-w-[130px] items-center gap-2'
                              >
                                {isSubmittingReply ? (
                                  <>
                                    <div className='h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent' />
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <Send className='h-3 w-3' />
                                    Send Reply
                                  </>
                                )}
                              </Button>
                              <Button
                                size='sm'
                                variant='outline'
                                onClick={handleCancelReply}
                                disabled={isSubmittingReply}
                                className='min-w-[100px]'
                              >
                                <X className='mr-1 h-3 w-3' />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Default Action Buttons - Only show Reply button if not replied yet
                          <div className='flex justify-center border-t pt-6'>
                            {!(
                              reply.hasReplied || repliedEmails.has(reply.id)
                            ) && (
                              <Button
                                size='sm'
                                onClick={() => handleStartReply(reply.id)}
                                className='min-w-[120px]'
                              >
                                <Reply className='mr-1 h-3 w-3' />
                                Reply
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
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

      {/* Usage Limits skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className='h-6 w-32' />
          <Skeleton className='h-4 w-24' />
        </CardHeader>
        <CardContent className='space-y-6'>
          <Skeleton className='h-12 w-full' />
          <div className='grid gap-4 md:grid-cols-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='space-y-3 rounded-lg border p-4'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-2 w-full' />
                <Skeleton className='h-4 w-3/4' />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className='h-4 w-48' />
        </CardFooter>
      </Card>

      {/* Pending Tasks and Recent Replies skeleton */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {/* Pending Tasks skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-32' />
          </CardHeader>
          <CardContent className='space-y-4'>
            {Array.from({ length: 3 }).map((_, i) => (
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

        {/* Recent Replies skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-32' />
          </CardHeader>
          <CardContent className='space-y-4'>
            {Array.from({ length: 3 }).map((_, i) => (
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
    </div>
  );
}
