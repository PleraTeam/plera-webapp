import { NextRequest, NextResponse } from 'next/server';

interface SearchLeadsRequest {
  targetSegments: Array<{
    filters: {
      industries: string[];
      companySizes: Array<{
        id: string;
        label: string;
        min?: number;
        max?: number;
      }>;
      companyTraits: string[];
      jobTitles: string[];
      departments: string[];
      functions: string[];
      technologies: string[];
      seniorities: string[];
      searchKeywords: string[];
      targetLocations?: Array<{ label: string; apolloValue: string }>;
      verifiedEmail?: boolean;
    };
  }>;
}

interface ApolloApiResponse {
  people: Array<{
    id: string;
    first_name: string;
    last_name: string;
    name: string;
    title: string;
    email: string | null;
    email_status: string;
    linkedin_url: string;
    city: string;
    state: string;
    country: string;
    phone_numbers: Array<{
      raw_number: string;
      sanitized_number: string;
    }>;
    organization: {
      id: string;
      name: string;
      website_url: string;
      blog_url: string;
      angellist_url: string;
      linkedin_url: string;
      twitter_url: string;
      facebook_url: string;
      industry: string;
      keywords: string[];
      estimated_num_employees: number;
      publicly_traded_symbol: string;
      publicly_traded_exchange: string;
      logo_url: string;
      crunchbase_url: string;
      primary_domain: string;
      sanitized_phone: string;
    };
    employment_history: Array<{
      organization_id: string;
      organization_name: string;
      title: string;
      start_date: string;
      end_date: string;
      current: boolean;
    }>;
  }>;
  pagination: {
    page: number;
    per_page: number;
    total_entries: number;
    total_pages: number;
  };
}

interface ProcessedProspect {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  email?: string | null;
  linkedinUrl: string;
  companySize?: string;
  phoneNumber?: string;
  companyWebsite?: string;
}

// Transform targeting filters into Apollo People Search parameters
function buildApolloSearchParams(
  targetSegments: SearchLeadsRequest['targetSegments']
) {
  // Combine all segments into a single search
  const allIndustries = Array.from(
    new Set(targetSegments.flatMap((s) => s.filters.industries))
  );
  const allRoles = Array.from(
    new Set(
      targetSegments.flatMap((s) => [
        ...s.filters.jobTitles,
        ...s.filters.departments,
        ...s.filters.functions
      ])
    )
  );
  const allSeniorities = Array.from(
    new Set(targetSegments.flatMap((s) => s.filters.seniorities || []))
  );
  const allKeywords = Array.from(
    new Set(targetSegments.flatMap((s) => s.filters.searchKeywords))
  );
  const allCompanyTraits = Array.from(
    new Set(targetSegments.flatMap((s) => s.filters.companyTraits))
  );
  const allTechnologies = Array.from(
    new Set(targetSegments.flatMap((s) => s.filters.technologies || []))
  );
  const allCompanySizes = Array.from(
    new Set(targetSegments.flatMap((s) => s.filters.companySizes))
  );
  const allLocations = Array.from(
    new Set(targetSegments.flatMap((s) => s.filters.targetLocations || []))
  );
  const hasVerifiedEmailFilter = targetSegments.some(
    (s) => s.filters.verifiedEmail
  );

  // Convert company sizes to Apollo employee ranges
  const employeeRanges: string[] = [];
  allCompanySizes.forEach((size) => {
    if (size.min !== undefined && size.max !== undefined) {
      employeeRanges.push(`${size.min}-${size.max}`);
    } else if (size.label.includes('1-10')) {
      employeeRanges.push('1-10');
    } else if (size.label.includes('11-50')) {
      employeeRanges.push('11-50');
    } else if (size.label.includes('51-200')) {
      employeeRanges.push('51-200');
    } else if (size.label.includes('201-1000')) {
      employeeRanges.push('201-1000');
    } else if (size.label.includes('1001+')) {
      employeeRanges.push('1001-10000');
    }
  });

  // Build Apollo search payload for people search
  const searchParams = {
    // Person filters
    person_titles: allRoles.length > 0 ? allRoles : undefined,
    person_seniorities: allSeniorities.length > 0 ? allSeniorities : undefined,
    email_status: hasVerifiedEmailFilter ? ['verified'] : undefined,

    // Organization filters
    organization_num_employees_ranges:
      employeeRanges.length > 0 ? employeeRanges : undefined,
    organization_locations:
      allLocations.length > 0
        ? allLocations.map((loc) => loc.apolloValue)
        : undefined,
    q_organization_keyword_tags: [
      ...allIndustries.map((industry) => industry.toLowerCase()),
      ...allKeywords,
      ...allCompanyTraits,
      ...allTechnologies
    ].filter(Boolean),

    // Results configuration
    page: 1,
    per_page: 100 // Apollo's max per page
  };

  return searchParams;
}

// Call Apollo.io People Search API
async function searchApolloApi(searchParams: any): Promise<ApolloApiResponse> {
  const APOLLO_API_KEY = process.env.APOLLO_API_KEY;

  if (!APOLLO_API_KEY) {
    throw new Error('APOLLO_API_KEY environment variable is required');
  }

  const response = await fetch('https://api.apollo.io/api/v1/people/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': APOLLO_API_KEY
    },
    body: JSON.stringify(searchParams)
  });

  if (!response.ok) {
    const _errorText = await response.text();
    throw new Error(`Apollo API error: ${response.status} ${_errorText}`);
  }

  const data = await response.json();
  return data;
}

// Transform Apollo API data to our prospect format
function transformApolloData(
  apolloResponse: ApolloApiResponse
): ProcessedProspect[] {
  return apolloResponse.people
    .filter((person) => person.first_name && person.last_name) // Filter out incomplete records
    .map((person) => {
      // Build location string from Apollo location data
      const locationParts = [];
      if (person.city) locationParts.push(person.city);
      if (person.state) locationParts.push(person.state);
      if (person.country) locationParts.push(person.country);
      const location =
        locationParts.length > 0
          ? locationParts.join(', ')
          : 'Location not available';

      // Handle email - show if available, indicate if locked
      let email = person.email;
      if (!email && person.email_status) {
        // Show email status instead of null when email is locked
        email = `${person.email_status}@${person.organization?.primary_domain || 'domain.com'}`;
      }

      return {
        id: person.id,
        name: person.name || `${person.first_name} ${person.last_name}`,
        firstName: person.first_name,
        lastName: person.last_name,
        title: person.title || 'Unknown Title',
        company: person.organization?.name || 'Unknown Company',
        industry: person.organization?.industry || 'Unknown Industry',
        location: location,
        email: email,
        linkedinUrl: person.linkedin_url || '',
        companySize: person.organization?.estimated_num_employees
          ? `${person.organization.estimated_num_employees} employees`
          : undefined,
        phoneNumber: person.phone_numbers?.[0]?.sanitized_number,
        companyWebsite: person.organization?.website_url
      };
    });
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchLeadsRequest = await request.json();

    if (!body.targetSegments || body.targetSegments.length === 0) {
      return NextResponse.json(
        { error: 'Target segments are required' },
        { status: 400 }
      );
    }

    // Note: buildApolloOrgSearchParams and extractTargetRoles functions removed as they were unused

    // Call Apollo People Search API directly (now working!)
    const searchParams = buildApolloSearchParams(body.targetSegments);
    const apolloResponse = await searchApolloApi(searchParams);

    // Transform data
    const prospects = transformApolloData(apolloResponse);

    // Calculate stats
    const totalFound = apolloResponse.pagination.total_entries;
    const withEmail = prospects.filter((p) => p.email).length;
    const emailRate =
      prospects.length > 0
        ? Math.round((withEmail / prospects.length) * 100)
        : 0;

    // Apply tier limits (for now, everyone gets free tier)
    const userTier = 'free';
    const tierLimits = {
      free: 20,
      bronze: 100,
      silver: 500,
      gold: Infinity
    };

    const shownCount = Math.min(prospects.length, tierLimits[userTier]);
    const displayProspects = prospects.slice(0, shownCount);

    // Development mode: If no prospects found, return mock data
    if (process.env.NODE_ENV === 'development' && prospects.length === 0) {
      const mockProspects = [
        {
          id: 'mock-1',
          name: 'Sarah Johnson',
          firstName: 'Sarah',
          lastName: 'Johnson',
          title: 'VP of Sales',
          company: 'TechCorp Solutions',
          industry: 'Software & Technology',
          location: 'San Francisco, CA',
          email: 'sarah.johnson@techcorp.com',
          linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
          companySize: '250-500 employees',
          phoneNumber: '+1 (555) 123-4567',
          companyWebsite: 'https://techcorp.com'
        },
        {
          id: 'mock-2',
          name: 'Michael Chen',
          firstName: 'Michael',
          lastName: 'Chen',
          title: 'Director of Sales',
          company: 'DataFlow Inc',
          industry: 'Software & Technology',
          location: 'New York, NY',
          email: 'michael.chen@dataflow.com',
          linkedinUrl: 'https://linkedin.com/in/michaelchen',
          companySize: '101-250 employees',
          phoneNumber: '+1 (555) 234-5678',
          companyWebsite: 'https://dataflow.com'
        },
        {
          id: 'mock-3',
          name: 'Emily Rodriguez',
          firstName: 'Emily',
          lastName: 'Rodriguez',
          title: 'Head of Sales',
          company: 'CloudScale Systems',
          industry: 'SaaS',
          location: 'Austin, TX',
          email: 'emily.rodriguez@cloudscale.com',
          linkedinUrl: 'https://linkedin.com/in/emilyrodriguez',
          companySize: '51-100 employees',
          phoneNumber: '+1 (555) 345-6789',
          companyWebsite: 'https://cloudscale.com'
        },
        {
          id: 'mock-4',
          name: 'David Kim',
          firstName: 'David',
          lastName: 'Kim',
          title: 'Sales Development Representative',
          company: 'StartupForge',
          industry: 'Technology',
          location: 'Seattle, WA',
          email: 'david.kim@startupforge.com',
          linkedinUrl: 'https://linkedin.com/in/davidkim',
          companySize: '11-50 employees',
          phoneNumber: '+1 (555) 456-7890',
          companyWebsite: 'https://startupforge.com'
        },
        {
          id: 'mock-5',
          name: 'Lisa Thompson',
          firstName: 'Lisa',
          lastName: 'Thompson',
          title: 'Business Development Representative',
          company: 'InnovateLabs',
          industry: 'Software',
          location: 'Boston, MA',
          email: 'lisa.thompson@innovatelabs.com',
          linkedinUrl: 'https://linkedin.com/in/lisathompson',
          companySize: '26-50 employees',
          phoneNumber: '+1 (555) 567-8901',
          companyWebsite: 'https://innovatelabs.com'
        }
      ];

      return NextResponse.json({
        success: true,
        data: {
          prospects: mockProspects,
          searchStats: {
            totalFound: mockProspects.length,
            withEmail: mockProspects.length,
            shownCount: mockProspects.length,
            userTier,
            emailRate: 100,
            searchedCount: mockProspects.length
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        prospects: displayProspects,
        searchStats: {
          totalFound,
          withEmail,
          shownCount,
          userTier,
          emailRate,
          searchedCount: prospects.length // How many we actually retrieved
        }
      }
    });
  } catch (error) {
    console.error('❌ Hybrid search error:', error);

    return NextResponse.json(
      {
        error: 'Failed to search for leads using Hybrid approach',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
