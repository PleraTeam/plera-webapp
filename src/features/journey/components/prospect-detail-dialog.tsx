import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Prospect } from '../utils/store';
import {
  IconUser,
  IconBuilding,
  IconMail,
  IconPhone,
  IconBrandLinkedin,
  IconCalendar,
  IconMapPin,
  IconWorld,
  IconUsers,
  IconBriefcase,
  IconInfoCircle
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';

interface ProspectDetailDialogProps {
  prospect: Prospect | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getContactMethodIcon = (method: string) => {
  switch (method) {
    case 'email':
      return <IconMail className='h-4 w-4' />;
    case 'phone':
      return <IconPhone className='h-4 w-4' />;
    case 'linkedin':
      return <IconBrandLinkedin className='h-4 w-4' />;
    default:
      return null;
  }
};

const getSourceColor = (source: string) => {
  switch (source) {
    case 'LinkedIn':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Email':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'Phone':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'Referral':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'Website':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'INTERESTED':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'MEETING_BOOKED':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border-green-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const formatStatus = (status: string) => {
  switch (status) {
    case 'INTERESTED':
      return 'Interested';
    case 'MEETING_BOOKED':
      return 'Meeting Booked';
    case 'COMPLETED':
      return 'Completed';
    default:
      return status;
  }
};

export function ProspectDetailDialog({
  prospect,
  open,
  onOpenChange
}: ProspectDetailDialogProps) {
  if (!prospect) return null;

  const timeInStage =
    prospect.timeInStage && !isNaN(new Date(prospect.timeInStage).getTime())
      ? formatDistanceToNow(new Date(prospect.timeInStage), { addSuffix: true })
      : 'Recently added';

  const nextMeeting =
    prospect.meetingDate && !isNaN(new Date(prospect.meetingDate).getTime())
      ? formatDistanceToNow(new Date(prospect.meetingDate), { addSuffix: true })
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] max-w-4xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-3'>
            <IconUser className='text-muted-foreground h-5 w-5' />
            {prospect.fullname || prospect.contactName}
          </DialogTitle>
        </DialogHeader>

        <div className='grid gap-6 md:grid-cols-2'>
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <IconUser className='h-4 w-4' />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <div className='text-muted-foreground text-sm font-medium'>
                  Full Name
                </div>
                <div>{prospect.fullname || prospect.contactName}</div>
              </div>

              {prospect.headline && (
                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>
                    Professional Headline
                  </div>
                  <div className='text-sm'>{prospect.headline}</div>
                </div>
              )}

              {prospect.emailaddress && (
                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>
                    Email Address
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconMail className='text-muted-foreground h-4 w-4' />
                    <a
                      href={`mailto:${prospect.emailaddress}`}
                      className='text-blue-600 hover:underline'
                    >
                      {prospect.emailaddress}
                    </a>
                  </div>
                </div>
              )}

              {(prospect.country || prospect.location) && (
                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>
                    Location
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconMapPin className='text-muted-foreground h-4 w-4' />
                    <span>{prospect.location || prospect.country}</span>
                  </div>
                </div>
              )}

              {prospect.about && (
                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>
                    About
                  </div>
                  <div className='text-muted-foreground text-sm leading-relaxed'>
                    {prospect.about}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <IconBuilding className='h-4 w-4' />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <div className='text-muted-foreground text-sm font-medium'>
                  Company Name
                </div>
                <div>{prospect.company_name || prospect.companyName}</div>
              </div>

              {prospect.company_industry && (
                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>
                    Industry
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconBriefcase className='text-muted-foreground h-4 w-4' />
                    <span>{prospect.company_industry}</span>
                  </div>
                </div>
              )}

              {prospect.company_size && (
                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>
                    Company Size
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconUsers className='text-muted-foreground h-4 w-4' />
                    <span>{prospect.company_size}</span>
                  </div>
                </div>
              )}

              {prospect.company_website && (
                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>
                    Website
                  </div>
                  <div className='flex items-center gap-2'>
                    <IconWorld className='text-muted-foreground h-4 w-4' />
                    <a
                      href={
                        prospect.company_website.startsWith('http')
                          ? prospect.company_website
                          : `https://${prospect.company_website}`
                      }
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      {prospect.company_website}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Journey Status */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <IconInfoCircle className='h-4 w-4' />
                Journey Status
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center gap-3'>
                <Badge
                  variant='outline'
                  className={`${getStatusColor(prospect.status)}`}
                >
                  {formatStatus(prospect.status)}
                </Badge>
                <div
                  className={`h-2 w-2 rounded-full ${prospect.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                />
                <span className='text-muted-foreground text-sm'>
                  {prospect.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className='space-y-2'>
                <div className='text-muted-foreground text-sm font-medium'>
                  Time in Current Stage
                </div>
                <div className='flex items-center gap-2'>
                  <IconCalendar className='text-muted-foreground h-4 w-4' />
                  <span className='text-sm'>{timeInStage}</span>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='text-muted-foreground text-sm font-medium'>
                  Lead Source
                </div>
                <Badge
                  variant='outline'
                  className={`${getSourceColor(prospect.source || 'Email')} w-fit`}
                >
                  {prospect.source || 'Email'}
                </Badge>
              </div>

              {prospect.nextAction && (
                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>
                    Next Action
                  </div>
                  <div className='rounded-md border bg-blue-50 p-3 text-sm'>
                    {prospect.nextAction}
                  </div>
                </div>
              )}

              {prospect.meetingDate && (
                <div className='space-y-2'>
                  <div className='text-muted-foreground text-sm font-medium'>
                    Upcoming Meeting
                  </div>
                  <div className='flex items-center gap-2 font-medium text-green-700'>
                    <IconCalendar className='h-4 w-4' />
                    <span className='text-sm'>Meeting {nextMeeting}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Methods */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-base'>
                <IconMail className='h-4 w-4' />
                Contact Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              {prospect.contactMethods?.length ? (
                <div className='flex flex-wrap gap-2'>
                  {prospect.contactMethods.map((method, index) => (
                    <Badge
                      key={index}
                      variant='outline'
                      className='flex items-center gap-1'
                    >
                      {getContactMethodIcon(method)}
                      <span className='capitalize'>{method}</span>
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className='text-muted-foreground text-sm'>
                  No contact methods specified
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
