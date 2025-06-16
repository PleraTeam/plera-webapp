import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { airtableService, type CampaignRecord } from '@/services/airtable';

interface SaveCampaignRequest {
  records: CampaignRecord[];
  campaignId?: string;
  campaignName?: string;
}

interface SaveCampaignResponse {
  success: boolean;
  recordsSaved: number;
  recordIds?: string[];
  error?: string;
  metadata?: {
    organizationId: string;
    campaignId?: string;
    timestamp: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get Clerk authentication
    const { userId, orgId } = await auth();

    if (!userId) {
      console.error('❌ No authenticated user');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (!orgId) {
      console.error('❌ No organization context');
      return NextResponse.json(
        { error: 'Organization context required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body: SaveCampaignRequest = await request.json();

    // Validate required fields
    if (!body.records || !Array.isArray(body.records)) {
      console.error('❌ Missing or invalid records field');
      return NextResponse.json(
        { error: 'Missing required field: records (must be array)' },
        { status: 400 }
      );
    }

    if (body.records.length === 0) {
      console.error('❌ Empty records array');
      return NextResponse.json(
        { error: 'Records array cannot be empty' },
        { status: 400 }
      );
    }

    if (body.records.length > 1000) {
      console.error('❌ Too many records');
      return NextResponse.json(
        { error: 'Maximum 1000 records allowed per request' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.AIRTABLE_API_KEY) {
      console.error('❌ AIRTABLE_API_KEY not set');
      return NextResponse.json(
        { error: 'Airtable configuration error' },
        { status: 500 }
      );
    }

    if (!process.env.AIRTABLE_BASE_ID) {
      console.error('❌ AIRTABLE_BASE_ID not set');
      return NextResponse.json(
        { error: 'Airtable configuration error' },
        { status: 500 }
      );
    }

    // Validate each record
    for (let i = 0; i < body.records.length; i++) {
      const record = body.records[i];
      const recordIndex = i + 1;

      // Check required fields
      if (!record.email) {
        console.error(`❌ Record ${recordIndex}: Missing email`);
        return NextResponse.json(
          { error: `Record ${recordIndex}: Missing required field 'email'` },
          { status: 400 }
        );
      }

      if (!record.first_name) {
        console.error(`❌ Record ${recordIndex}: Missing first_name`);
        return NextResponse.json(
          {
            error: `Record ${recordIndex}: Missing required field 'first_name'`
          },
          { status: 400 }
        );
      }

      if (!record.last_name) {
        console.error(`❌ Record ${recordIndex}: Missing last_name`);
        return NextResponse.json(
          {
            error: `Record ${recordIndex}: Missing required field 'last_name'`
          },
          { status: 400 }
        );
      }

      if (!record.subject_line) {
        console.error(`❌ Record ${recordIndex}: Missing subject_line`);
        return NextResponse.json(
          {
            error: `Record ${recordIndex}: Missing required field 'subject_line'`
          },
          { status: 400 }
        );
      }

      if (!record.email_body) {
        console.error(`❌ Record ${recordIndex}: Missing email_body`);
        return NextResponse.json(
          {
            error: `Record ${recordIndex}: Missing required field 'email_body'`
          },
          { status: 400 }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(record.email)) {
        console.error(
          `❌ Record ${recordIndex}: Invalid email format: ${record.email}`
        );
        return NextResponse.json(
          {
            error: `Record ${recordIndex}: Invalid email format '${record.email}'`
          },
          { status: 400 }
        );
      }

      // Set defaults for optional fields
      record.email_sent = record.email_sent ?? false;
      record.content_approved = record.content_approved ?? false;
      record.created_date = record.created_date || new Date().toISOString();
      record.user_organization = orgId;
      record.full_name =
        record.full_name || `${record.first_name} ${record.last_name}`;
    }

    // Save to Airtable

    let result;
    if (body.records.length === 1) {
      result = await airtableService.saveCampaignRecord(orgId, body.records[0]);
    } else {
      result = await airtableService.saveBulkRecords(orgId, body.records);
    }

    if (!result.success) {
      console.error('❌ Airtable save failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to save to Airtable' },
        { status: 500 }
      );
    }

    // Prepare response
    const response: SaveCampaignResponse = {
      success: true,
      recordsSaved: result.recordsSaved || 0,
      recordIds: result.recordIds || (result.recordId ? [result.recordId] : []),
      metadata: {
        organizationId: orgId,
        campaignId: body.campaignId,
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('💥 Airtable campaign save error:', error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json(
        { error: 'Request timed out while saving to Airtable' },
        { status: 408 }
      );
    }

    if (error instanceof Error && error.message.includes('Rate limit')) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : 'Unknown error'
            : undefined
      },
      { status: 500 }
    );
  }
}

// GET endpoint for testing connection
export async function GET(_request: NextRequest) {
  try {
    // Get Clerk authentication for GET requests too
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const result = await airtableService.testConnection();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Airtable connection successful',
        recordId: result.recordId,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        {
          error: 'Airtable connection failed',
          details: result.error
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('💥 Airtable connection test error:', error);
    return NextResponse.json(
      { error: 'Connection test failed' },
      { status: 500 }
    );
  }
}
