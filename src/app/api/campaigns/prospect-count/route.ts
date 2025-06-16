import { NextRequest, NextResponse } from 'next/server';

interface ProspectCountRequest {
  filters: {
    person_titles?: string[];
    person_seniorities?: string[];
    organization_num_employees_ranges?: string[];
    organization_locations?: string[];
    q_organization_keyword_tags?: string[];
    email_status?: string[];
  };
}

// Get prospect count from Apollo API (lightweight call)
async function getProspectCount(
  filters: ProspectCountRequest['filters']
): Promise<number> {
  const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

  if (!APOLLO_API_KEY) {
    throw new Error('APOLLO_API_KEY environment variable is required');
  }

  // Build search params for count only
  const searchParams = {
    ...filters,
    page: 1,
    per_page: 1 // Minimal data - we only need the count
  };

  try {
    const response = await fetch('https://api.apollo.io/api/v1/people/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': APOLLO_API_KEY
      },
      body: JSON.stringify(searchParams)
    });

    if (!response.ok) {
      return 0;
    }

    const data = await response.json();
    return data.pagination?.total_entries || 0;
  } catch (error) {
    return 0;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ProspectCountRequest = await request.json();

    if (!body.filters) {
      return NextResponse.json(
        { error: 'Filters are required' },
        { status: 400 }
      );
    }

    const count = await getProspectCount(body.filters);

    return NextResponse.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('❌ Prospect count error:', error);

    return NextResponse.json(
      {
        error: 'Failed to get prospect count',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
