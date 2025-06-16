'use client';
import { Fragment, useEffect, useState } from 'react';
import { useTaskStore, Task, Prospect } from '../utils/store';
import type { Column } from './board-column';
import { BoardColumn, BoardContainer } from './board-column';
import { ProspectDetailDialog } from './prospect-detail-dialog';

const defaultCols = [
  {
    id: 'INTERESTED' as const,
    title: 'Interested'
  },
  {
    id: 'MEETING_BOOKED' as const,
    title: 'Meeting Booked'
  },
  {
    id: 'COMPLETED' as const,
    title: 'Completed'
  }
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]['id'];

export function JourneyBoard() {
  const columns = useTaskStore((state) => state.columns);
  const tasks = useTaskStore((state) => state.tasks);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    useTaskStore.persist.rehydrate();
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedProspect(task as Prospect);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedProspect(null);
  };

  if (!isMounted) return null;

  return (
    <>
      <BoardContainer>
        {columns?.map((col) => (
          <Fragment key={col.id}>
            <BoardColumn
              column={col}
              tasks={tasks.filter((task) => task.status === col.id)}
              onTaskClick={handleTaskClick}
            />
          </Fragment>
        ))}
      </BoardContainer>

      <ProspectDetailDialog
        prospect={selectedProspect}
        open={dialogOpen}
        onOpenChange={handleDialogClose}
      />
    </>
  );
}
