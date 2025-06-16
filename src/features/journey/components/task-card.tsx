import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardAction,
  CardFooter
} from '@/components/ui/card';
import { Task, Prospect } from '../utils/store';
import { cva } from 'class-variance-authority';
import {
  IconMail,
  IconPhone,
  IconBrandLinkedin,
  IconCalendar,
  IconBuilding,
  IconUser
} from '@tabler/icons-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export interface TaskDragData {
  type: 'Task';
  task: Task;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  onTaskClick?: (task: Task) => void;
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
      return 'bg-blue-100 text-blue-800';
    case 'Email':
      return 'bg-green-100 text-green-800';
    case 'Phone':
      return 'bg-purple-100 text-purple-800';
    case 'Referral':
      return 'bg-orange-100 text-orange-800';
    case 'Website':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function TaskCard({ task, isOverlay, onTaskClick }: TaskCardProps) {
  const prospect = task as Prospect;

  // Safety check - if prospect data is incomplete, show basic fallback
  if (!prospect.contactName || !prospect.companyName) {
    return (
      <Card className='@container/card mb-3'>
        <CardContent className='p-4'>
          <div className='text-muted-foreground text-sm'>
            Loading prospect data...
          </div>
        </CardContent>
      </Card>
    );
  }

  const timeInStage =
    prospect.timeInStage && !isNaN(new Date(prospect.timeInStage).getTime())
      ? formatDistanceToNow(new Date(prospect.timeInStage), { addSuffix: true })
      : 'Recently added';

  const nextMeeting =
    prospect.meetingDate && !isNaN(new Date(prospect.meetingDate).getTime())
      ? formatDistanceToNow(new Date(prospect.meetingDate), { addSuffix: true })
      : null;

  const variants = cva(
    '*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card mb-3 @container/card transition-all duration-200 hover:shadow-md cursor-pointer',
    {
      variants: {
        overlay: {
          true: 'ring-2 ring-primary shadow-lg',
          false:
            '*:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs'
        }
      }
    }
  );

  const handleClick = () => {
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  return (
    <Card className={variants({ overlay: isOverlay })} onClick={handleClick}>
      <CardHeader>
        <CardDescription className='flex items-center gap-2'>
          <IconUser className='h-3 w-3' />
          <span className='text-xs'>{timeInStage}</span>
          <div className='ml-auto flex items-center gap-2'>
            <div
              className={`h-2 w-2 rounded-full ${prospect.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
            />
          </div>
        </CardDescription>
        <div className='space-y-1'>
          <h4 className='text-sm leading-tight font-semibold tabular-nums @[200px]/card:text-base'>
            {prospect.contactName}
          </h4>
          <div className='text-muted-foreground flex items-center gap-1 text-xs'>
            <IconBuilding className='h-3 w-3' />
            <span>{prospect.companyName}</span>
          </div>
        </div>
        <CardAction>
          <Badge
            variant='outline'
            className={`text-xs ${getSourceColor(prospect.source || 'Email')}`}
          >
            {prospect.source || 'Email'}
          </Badge>
        </CardAction>
      </CardHeader>

      {(prospect.nextAction ||
        prospect.meetingDate ||
        prospect.contactMethods?.length) && (
        <CardFooter className='flex-col items-start gap-2 text-xs'>
          {prospect.nextAction && (
            <div className='line-clamp-1 flex gap-1 font-medium'>
              <span className='text-muted-foreground'>Next:</span>
              <span>{prospect.nextAction}</span>
            </div>
          )}

          {prospect.meetingDate && (
            <div className='flex items-center gap-1 font-medium text-green-700'>
              <IconCalendar className='h-3 w-3' />
              <span>Meeting {nextMeeting}</span>
            </div>
          )}

          {prospect.contactMethods?.length && (
            <div className='text-muted-foreground flex items-center gap-2'>
              {prospect.contactMethods.slice(0, 3).map((method, index) => (
                <div key={index} className='flex items-center'>
                  {getContactMethodIcon(method)}
                </div>
              ))}
              {prospect.contactMethods.length > 3 && (
                <span className='text-xs'>
                  +{prospect.contactMethods.length - 3}
                </span>
              )}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
