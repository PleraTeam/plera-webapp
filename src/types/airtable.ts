// Airtable Client Metrics types
export interface ClientMetrics {
  Client_ID: string;
  Client_Name: string;
  Agent_Status: string;
  Contacts_Today: number;
  Next_Outreach: string;
  Appointments_This_Month: number;
  Total_Contacts_This_Month: number;
  Active_Leads: number;
  Hot_Prospects: number;
}

// Airtable Activity Feed types
export interface ActivityFeed {
  Client_ID: string;
  Activity_Message: string;
  Activity_Type: string;
  Timestamp: string;
}

// API Response types
export interface ClientDashboardResponse {
  clientMetrics: ClientMetrics | null;
  activityFeed: ActivityFeed[];
  success: boolean;
  error?: string;
}

// Loading and error states for components
export interface DashboardDataState {
  data: ClientDashboardResponse | null;
  loading: boolean;
  error: string | null;
}

// Agent status options (for type safety)
export type AgentStatus = 'Active' | 'Inactive' | 'Paused' | 'Scheduled';

// Activity type options (for type safety)
export type ActivityType =
  | 'Contact'
  | 'Meeting'
  | 'Follow-up'
  | 'Lead'
  | 'Appointment'
  | 'Note'
  | 'Status Update';
