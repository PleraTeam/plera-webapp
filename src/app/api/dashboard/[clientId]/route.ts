import { NextRequest, NextResponse } from 'next/server';

// Types for Airtable responses
interface AirtableRecord<T = any> {
  id: string;
  fields: T;
  createdTime: string;
}

interface AirtableResponse<T = any> {
  records: AirtableRecord<T>[];
  offset?: string;
}

// Client Metrics fields from Airtable
interface ClientMetricsFields {
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

// Activity Feed fields from Airtable
interface ActivityFeedFields {
  Client_ID: string;
  Activity_Message: string;
  Activity_Type: string;
  Timestamp: string;
}

// Response structure
interface ClientDashboardData {
  clientMetrics: ClientMetricsFields | null;
  activityFeed: ActivityFeedFields[];
  success: boolean;
  error?: string;
}

// Airtable API configuration
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

// Helper function to make Airtable API requests
async function fetchFromAirtable<T>(
  tableName: string,
  filterFormula?: string
): Promise<AirtableResponse<T>> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable configuration missing');
  }

  const url = new URL(`${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${tableName}`);

  if (filterFormula) {
    url.searchParams.append('filterByFormula', filterFormula);
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Airtable API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export async function GET(
  request: NextRequest,
  { params }: { params: { clientId: string } }
) {
  try {
    const { clientId } = params;

    if (!clientId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client ID is required'
        },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Airtable configuration missing. Please check your environment variables.'
        },
        { status: 500 }
      );
    }

    // Create filter formula for Client_ID
    const filterFormula = `{Client_ID} = '${clientId}'`;

    // Fetch client metrics and activity feed in parallel
    const [clientMetricsResponse, activityFeedResponse] = await Promise.all([
      fetchFromAirtable<ClientMetricsFields>('Client_Metrics', filterFormula),
      fetchFromAirtable<ActivityFeedFields>('Activity_Feed', filterFormula)
    ]);

    // Extract client metrics (should be only one record per client)
    const clientMetrics =
      clientMetricsResponse.records.length > 0
        ? clientMetricsResponse.records[0].fields
        : null;

    // Extract activity feed (multiple records, sorted by timestamp)
    const activityFeed = activityFeedResponse.records
      .map((record) => record.fields)
      .sort(
        (a, b) =>
          new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime()
      );

    // Return structured response
    const responseData: ClientDashboardData = {
      clientMetrics,
      activityFeed,
      success: true
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Dashboard API Error:', error);

    // Handle different types of errors
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;

      // Handle specific Airtable errors
      if (error.message.includes('Airtable API error')) {
        statusCode = 502; // Bad Gateway for external API errors
      } else if (error.message.includes('configuration missing')) {
        statusCode = 500; // Internal Server Error for config issues
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        clientMetrics: null,
        activityFeed: []
      },
      { status: statusCode }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
