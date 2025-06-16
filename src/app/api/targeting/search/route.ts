import { NextRequest, NextResponse } from 'next/server';
import { ApolloSearchFilters } from '@/types/targeting';

interface SearchRequest {
  filters: ApolloSearchFilters;
  page?: number;
  per_page?: number;
}

interface ApifyPersonResult {
  name: string;
  first_name: string;
  last_name: string;
  title: string;
  company_name: string;
  company_website: string;
  company_industry: string;
  company_size: string;
  location: string;
  linkedin_url: string;
  work_email?: string;
  personal_email?: string;
  phone?: string;
  photo_url?: string;
}

interface ApifyRunResponse {
  data: {
    id: string;
    actorId: string;
    userId: string;
    startedAt: string;
    finishedAt: string | null;
    status: 'READY' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'ABORTED';
    statusMessage: string;
    isStatusMessageTerminal: boolean;
    defaultDatasetId: string;
    stats?: {
      durationMillis: number;
    };
  };
}

// Helper function to convert our filters to Apollo.io search URL
function buildApolloSearchUrl(filters: ApolloSearchFilters): string {
  const baseUrl = 'https://app.apollo.io/#/people';
  const params = new URLSearchParams();

  // Convert filters to Apollo URL parameters
  if (filters.person_titles?.length) {
    params.append('personTitles', JSON.stringify(filters.person_titles));
  }

  if (filters.person_seniorities?.length) {
    params.append(
      'personSeniorities',
      JSON.stringify(filters.person_seniorities)
    );
  }

  if (filters.organization_industries?.length) {
    params.append(
      'organizationIndustryTagIds',
      JSON.stringify(filters.organization_industries)
    );
  }

  if (filters.organization_num_employees_ranges?.length) {
    params.append(
      'organizationNumEmployeesRanges',
      JSON.stringify(filters.organization_num_employees_ranges)
    );
  }

  if (filters.person_locations?.length) {
    params.append('personLocations', JSON.stringify(filters.person_locations));
  }

  if (filters.organization_locations?.length) {
    params.append(
      'organizationLocations',
      JSON.stringify(filters.organization_locations)
    );
  }

  if (filters.q_keywords) {
    params.append('qKeywords', filters.q_keywords);
  }

  return `${baseUrl}?${params.toString()}`;
}

// Helper function to wait for run completion with timeout
async function waitForApifyRun(
  runId: string,
  maxWaitTime = 300000
): Promise<ApifyPersonResult[]> {
  const startTime = Date.now();
  const pollInterval = 5000; // 5 seconds

  while (Date.now() - startTime < maxWaitTime) {
    // Check run status
    const statusResponse = await fetch(
      `https://api.apify.com/v2/acts/${process.env.APIFY_APOLLO_ACTOR_ID}/runs/${runId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.APIFY_API_KEY}`
        }
      }
    );

    if (!statusResponse.ok) {
      throw new Error('Failed to check Apify run status');
    }

    const statusData: ApifyRunResponse = await statusResponse.json();

    if (statusData.data.status === 'SUCCEEDED') {
      // Get the results from the dataset
      const resultsResponse = await fetch(
        `https://api.apify.com/v2/datasets/${statusData.data.defaultDatasetId}/items`,
        {
          headers: {
            Authorization: `Bearer ${process.env.APIFY_API_KEY}`
          }
        }
      );

      if (!resultsResponse.ok) {
        throw new Error('Failed to fetch Apify results');
      }

      const results: ApifyPersonResult[] = await resultsResponse.json();
      return results;
    }

    if (
      statusData.data.status === 'FAILED' ||
      statusData.data.status === 'ABORTED'
    ) {
      throw new Error(
        `Apify run failed with status: ${statusData.data.status} - ${statusData.data.statusMessage}`
      );
    }

    // Wait before polling again
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error('Apify run timed out');
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json();

    // Validate Apify API key
    if (!process.env.APIFY_API_KEY) {
      console.error('❌ APIFY_API_KEY not set');
      return NextResponse.json(
        { error: 'Apify API key not configured' },
        { status: 500 }
      );
    }

    // Validate Apify Actor ID
    if (!process.env.APIFY_APOLLO_ACTOR_ID) {
      console.error('❌ APIFY_APOLLO_ACTOR_ID not set');
      return NextResponse.json(
        { error: 'Apify Apollo Actor ID not configured' },
        { status: 500 }
      );
    }

    // Validate request
    if (!body.filters || Object.keys(body.filters).length === 0) {
      return NextResponse.json(
        { error: 'Search filters are required' },
        { status: 400 }
      );
    }

    // Convert filters to Apollo search URL
    const apolloUrl = buildApolloSearchUrl(body.filters);

    // Prepare Apify actor input
    const apifyInput = {
      url: apolloUrl,
      maxResults: Math.min(body.per_page || 25, 100), // Limit results
      includeEmails: true,
      includePhones: false,
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ['RESIDENTIAL']
      }
    };

    // Start the Apify actor run
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/${process.env.APIFY_APOLLO_ACTOR_ID}/runs`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.APIFY_API_KEY}`
        },
        body: JSON.stringify(apifyInput)
      }
    );

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      console.error(
        '❌ Apify run start failed:',
        runResponse.status,
        errorText
      );

      if (runResponse.status === 401) {
        return NextResponse.json(
          { error: 'Invalid Apify API key' },
          { status: 401 }
        );
      }

      if (runResponse.status === 402) {
        return NextResponse.json(
          { error: 'Apify credits exhausted. Please upgrade your plan.' },
          { status: 402 }
        );
      }

      return NextResponse.json(
        { error: 'Apify run start failed' },
        { status: runResponse.status }
      );
    }

    const runData: ApifyRunResponse = await runResponse.json();
    const runId = runData.data.id;

    // Wait for the run to complete and get results
    const apifyResults = await waitForApifyRun(runId);

    // Transform Apify response for our frontend
    const transformedResponse = {
      success: true,
      data: {
        people: apifyResults.map((person, index) => ({
          id: `apify-${index}`,
          name:
            person.name || `${person.first_name} ${person.last_name}`.trim(),
          firstName: person.first_name || '',
          lastName: person.last_name || '',
          title: person.title || '',
          emailStatus: person.work_email ? 'verified' : 'unknown',
          photoUrl: person.photo_url || null,
          linkedinUrl: person.linkedin_url || '',
          company: {
            id: `company-${index}`,
            name: person.company_name || '',
            website: person.company_website || '',
            industry: person.company_industry || '',
            employeeCount: null, // Apify doesn't return employee count
            logoUrl: null
          }
        })),
        filters: [], // Apify doesn't return breadcrumbs like Apollo
        pagination: {
          page: body.page || 1,
          perPage: apifyResults.length,
          totalEntries: apifyResults.length, // Apify doesn't return total count
          totalPages: 1
        },
        isPartialResults: apifyResults.length >= (body.per_page || 25),
        partialResultsLimit: body.per_page || 25
      }
    };

    return NextResponse.json(transformedResponse);
  } catch (error) {
    console.error('💥 Apify search error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// GET endpoint for testing filters without consuming credits
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const testMode = searchParams.get('test');

  if (testMode === 'true') {
    // Return mock data for testing UI
    return NextResponse.json({
      success: true,
      data: {
        people: [
          {
            id: 'test-1',
            name: 'John Smith',
            firstName: 'John',
            lastName: 'Smith',
            title: 'VP of Sales',
            emailStatus: 'verified',
            photoUrl: null,
            linkedinUrl: 'https://linkedin.com/in/johnsmith',
            company: {
              id: 'company-1',
              name: 'TechCorp Inc',
              website: 'https://techcorp.com',
              industry: 'Software',
              employeeCount: 250,
              logoUrl: null
            }
          },
          {
            id: 'test-2',
            name: 'Sarah Johnson',
            firstName: 'Sarah',
            lastName: 'Johnson',
            title: 'Marketing Director',
            emailStatus: 'verified',
            photoUrl: null,
            linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
            company: {
              id: 'company-2',
              name: 'Growth Solutions',
              website: 'https://growthsolutions.com',
              industry: 'Marketing',
              employeeCount: 150,
              logoUrl: null
            }
          }
        ],
        filters: [],
        pagination: {
          page: 1,
          perPage: 25,
          totalEntries: 2,
          totalPages: 1
        },
        isPartialResults: false,
        partialResultsLimit: 50000
      }
    });
  }

  return NextResponse.json(
    { error: 'Use POST method for people search' },
    { status: 405 }
  );
}
