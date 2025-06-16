import { Task } from '../utils/store';
import { type UniqueIdentifier } from '@dnd-kit/core';
import { cva } from 'class-variance-authority';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskCard } from './task-card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { IconTrendingUp, IconUsers, IconClock } from '@tabler/icons-react';

export interface Column {
  id: UniqueIdentifier;
  title: string;
}

export interface ColumnDragData {
  type: 'Column';
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
  onTaskClick?: (task: Task) => void;
}

export function BoardColumn({
  column,
  tasks,
  isOverlay,
  onTaskClick
}: BoardColumnProps) {
  const variants = cva(
    '*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card h-[75vh] max-h-[75vh] flex-1 min-w-[350px] max-w-full flex flex-col snap-center @container/column transition-all duration-200 hover:shadow-md',
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

  // Calculate progress and metrics
  const activeProspects = tasks.filter(
    (task) => (task as any).isActive !== false
  ).length;
  const completionRate =
    tasks.length > 0 ? Math.round((activeProspects / tasks.length) * 100) : 0;

  // Get column-specific icon and description
  const getColumnInfo = (columnId: string) => {
    switch (columnId) {
      case 'INTERESTED':
        return {
          icon: IconUsers,
          description: 'New prospects showing interest',
          color: 'text-blue-600'
        };
      case 'MEETING_BOOKED':
        return {
          icon: IconClock,
          description: 'Scheduled meetings and calls',
          color: 'text-amber-600'
        };
      case 'COMPLETED':
        return {
          icon: IconTrendingUp,
          description: 'Closed deals and conversions',
          color: 'text-green-600'
        };
      default:
        return {
          icon: IconUsers,
          description: 'Prospect pipeline stage',
          color: 'text-gray-600'
        };
    }
  };

  const columnInfo = getColumnInfo(column.id as string);
  const IconComponent = columnInfo.icon;

  return (
    <Card className={variants({ overlay: isOverlay })}>
      <CardHeader className='space-y-3'>
        <div className='flex items-center gap-2'>
          <IconComponent className={`h-4 w-4 ${columnInfo.color}`} />
          <CardTitle className='text-lg leading-tight font-semibold tabular-nums @[300px]/column:text-xl'>
            {column.title}
          </CardTitle>
          <div className='ml-auto flex items-center gap-2'>
            <Badge
              variant='outline'
              className={`text-xs font-medium ${columnInfo.color} border-current`}
            >
              {tasks.length}
            </Badge>
          </div>
        </div>

        <CardDescription className='text-muted-foreground text-xs leading-relaxed'>
          {columnInfo.description}
        </CardDescription>

        {tasks.length > 0 && (
          <div className='flex items-center gap-2 text-xs'>
            <div className='flex items-center gap-1'>
              <div className={`h-2 w-2 rounded-full bg-green-500`} />
              <span className='text-muted-foreground'>Active:</span>
              <span className='font-medium'>{activeProspects}</span>
            </div>
            {activeProspects !== tasks.length && (
              <div className='text-muted-foreground flex items-center gap-1'>
                <span>•</span>
                <span>{tasks.length - activeProspects} inactive</span>
              </div>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className='flex grow flex-col gap-4 overflow-x-hidden p-2 pt-0'>
        <ScrollArea className='h-full'>
          <div className='space-y-1'>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  return (
    <ScrollArea className='h-full w-full'>
      <div className='flex justify-start px-4 pb-4 md:px-6'>
        <div className='flex w-full flex-row items-start gap-4'>{children}</div>
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
