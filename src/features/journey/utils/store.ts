import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { persist } from 'zustand/middleware';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Column } from '../components/board-column';

export type Status = 'INTERESTED' | 'MEETING_BOOKED' | 'COMPLETED';

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

export type Prospect = {
  id: string;
  contactName: string;
  companyName: string;
  status: Status;
  timeInStage: Date;
  nextAction?: string;
  meetingDate?: Date;
  source: 'LinkedIn' | 'Email' | 'Phone' | 'Referral' | 'Website';
  contactMethods: ('email' | 'phone' | 'linkedin')[];
  isActive: boolean;
  // Extended prospect details
  fullname?: string;
  headline?: string;
  company_name?: string;
  company_size?: string;
  company_industry?: string;
  company_website?: string;
  country?: string;
  location?: string;
  about?: string;
  emailaddress?: string;
};

export type Task = Prospect;

export type State = {
  tasks: Task[];
  columns: Column[];
  draggedTask: string | null;
  isLoading: boolean;
  error: string | null;
};

// No hardcoded data - will fetch from Airtable API
const initialTasks: Task[] = [];

export type Actions = {
  fetchProspects: (clientId: string) => Promise<void>;
  updateProspectStatus: (
    prospectId: string,
    newStatus: Status,
    clientId: string
  ) => Promise<void>;
  addProspect: (prospect: Omit<Prospect, 'id'>) => void;
  dragTask: (id: string | null) => void;
  removeTask: (title: string) => void;
  setTasks: (updatedTask: Task[]) => void;
  setCols: (cols: Column[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateCol: (id: string, title: string) => void;
  removeCol: (id: string) => void;
  addCol: (column: Column) => void;
};

export const useTaskStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,
      columns: defaultCols,
      draggedTask: null,
      isLoading: false,
      error: null,

      // Fetch prospects from Airtable API
      fetchProspects: async (clientId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/prospects/${clientId}`);
          const data = await response.json();

          if (data.success) {
            set({ tasks: data.prospects, isLoading: false });
          } else {
            set({
              error: data.error || 'Failed to fetch prospects',
              isLoading: false
            });
          }
        } catch (error) {
          set({ error: 'Failed to fetch prospects', isLoading: false });
        }
      },

      // Update prospect status when dragged between columns
      updateProspectStatus: async (
        prospectId: string,
        newStatus: Status,
        clientId: string
      ) => {
        try {
          const response = await fetch(`/api/prospects/${clientId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prospectId, newStatus })
          });

          const data = await response.json();
          if (data.success) {
            // Update the local state with the updated prospect
            const currentTasks = get().tasks;
            const updatedTasks = currentTasks.map((task) =>
              task.id === prospectId
                ? { ...task, status: newStatus, timeInStage: new Date() }
                : task
            );
            set({ tasks: updatedTasks });
          }
        } catch (error) {
          console.error('Failed to update prospect status:', error);
        }
      },

      addProspect: (prospectData: Omit<Prospect, 'id'>) =>
        set((state) => ({
          tasks: [...state.tasks, { id: uuid(), ...prospectData }]
        })),
      dragTask: (id: string | null) => set({ draggedTask: id }),
      removeTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        })),
      setTasks: (newTasks: Task[]) => set({ tasks: newTasks }),
      setCols: (newCols: Column[]) => set({ columns: newCols }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      updateCol: (id: string, title: string) =>
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, title } : col
          )
        })),

      removeCol: (id: string) =>
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id)
        })),

      addCol: (column: Column) =>
        set((state) => ({
          columns: [...state.columns, column]
        }))
    }),
    {
      name: 'journey-store',
      skipHydration: true,
      // Only persist columns, not tasks (we'll fetch fresh data)
      partialize: (state) => ({
        columns: state.columns
      })
    }
  )
);
