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

// Prospect Journey fields from Airtable
interface ProspectJourneyFields {
  Client_ID: string;
  Contact_Name: string;
  Company_Name: string;
  Journey_Status: string;
  Time_In_Stage: string;
  Next_Action?: string;
  Meeting_Date?: string;
  Lead_Source: string;
  Contact_Methods: string[];
  Is_Active: boolean;
}

// Response structure for prospects
interface ProspectJourneyData {
  prospects: any[];
  success: boolean;
  error?: string;
}

// Airtable API configuration (reusing existing setup)
const AIRTABLE_API_URL = 'https://api.airtable.com/v0';
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

// Helper function to make Airtable API requests (same as dashboard API)
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

  // Sort by Journey_Status to maintain column order (Interested, Meeting Booked, Completed)
  url.searchParams.append('sort[0][field]', 'Journey_Status');
  url.searchParams.append('sort[0][direction]', 'asc');

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

// Transform Airtable data to our Prospect format
function transformProspectData(record: AirtableRecord<ProspectJourneyFields>) {
  const fields = record.fields;

  // Map Journey_Status to our internal status format
  let status = 'INTERESTED';
  if (fields.Journey_Status === 'Meeting Booked') status = 'MEETING_BOOKED';
  if (fields.Journey_Status === 'Completed') status = 'COMPLETED';

  return {
    id: record.id,
    contactName: fields.Contact_Name,
    companyName: fields.Company_Name,
    status: status,
    timeInStage: fields.Time_In_Stage
      ? new Date(fields.Time_In_Stage)
      : new Date(),
    nextAction: fields.Next_Action,
    meetingDate: fields.Meeting_Date
      ? new Date(fields.Meeting_Date)
      : undefined,
    source: fields.Lead_Source || 'Email',
    contactMethods: fields.Contact_Methods || [],
    isActive: fields.Is_Active !== false
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;

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

    // Create filter formula for Client_ID (same pattern as dashboard API)
    const filterFormula = `{Client_ID} = '${clientId}'`;

    // Fetch prospects for this specific client
    const prospectsResponse = await fetchFromAirtable<ProspectJourneyFields>(
      'Prospects_Journey',
      filterFormula
    );

    // Transform the data to our prospect format
    const prospects = prospectsResponse.records.map(transformProspectData);

    // Return structured response
    const responseData: ProspectJourneyData = {
      prospects,
      success: true
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    // Prospects API Error (following same pattern as dashboard API)

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
        prospects: []
      },
      { status: statusCode }
    );
  }
}

// PATCH - Update prospect status when dragged between columns
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId: _clientId } = await params;
    const body = await request.json();
    const { prospectId, newStatus } = body;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      return NextResponse.json(
        { success: false, error: 'Airtable configuration missing' },
        { status: 500 }
      );
    }

    // Map our internal status back to Airtable format
    let journeyStatus = 'Interested';
    if (newStatus === 'MEETING_BOOKED') journeyStatus = 'Meeting Booked';
    if (newStatus === 'COMPLETED') journeyStatus = 'Completed';

    const airtableData = {
      fields: {
        Journey_Status: journeyStatus,
        Time_In_Stage: new Date().toISOString().split('T')[0] // Update time when status changes
      }
    };

    const response = await fetch(
      `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/Prospects_Journey/${prospectId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(airtableData)
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update prospect: ${response.status}`);
    }

    const updatedRecord = await response.json();
    const prospect = transformProspectData(updatedRecord);

    return NextResponse.json({
      success: true,
      prospect
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update prospect status' },
      { status: 500 }
    );
  }
}
