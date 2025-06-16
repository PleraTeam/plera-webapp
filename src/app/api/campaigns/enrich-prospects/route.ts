import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { leadMagicService, type EnrichedProspect } from '@/services/lead-magic';

interface ProspectEnrichmentRequest {
  prospects: Array<{
    id: string;
    email: string;
    linkedinUrl: string;
    name: string;
    title: string;
    company: string;
    industry: string;
    location: string;
  }>;
  businessAnalysis: {
    companyName?: string;
    industry?: string;
    valueProposition?: string;
    competitiveEdges?: string[];
    painPoints?: string[];
    keyCapabilities?: string[];
    targetCustomer?: string;
    keyDifferentiator?: string;
  };
  enrichmentSettings: {
    batchSize?: number;
    includePersonalization?: boolean;
    priorityProspects?: string[]; // IDs of high-priority prospects to process first
  };
}

interface ProspectEnrichmentResponse {
  success: boolean;
  data: {
    enrichedProspects: EnrichedProspect[];
    statistics: {
      total: number;
      successful: number;
      failed: number;
      successRate: number;
      processingTime: number;
    };
    insights: {
      topCompanies: Array<{ company: string; count: number }>;
      topIndustries: Array<{ industry: string; count: number }>;
      avgConnections: number;
      profileCompleteness: number;
    };
  };
  error?: string;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Get Clerk authentication
    const { userId, orgId } = await auth();
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!userId && !isDevelopment) {
      console.error('❌ No authenticated user');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: ProspectEnrichmentRequest = await request.json();

    // Validate required fields
    if (!body.prospects || !Array.isArray(body.prospects)) {
      console.error('❌ Missing or invalid prospects field');
      return NextResponse.json(
        { error: 'Missing required field: prospects (must be array)' },
        { status: 400 }
      );
    }

    if (body.prospects.length === 0) {
      console.error('❌ Empty prospects array');
      return NextResponse.json(
        { error: 'Prospects array cannot be empty' },
        { status: 400 }
      );
    }

    if (body.prospects.length > 100) {
      console.error('❌ Too many prospects');
      return NextResponse.json(
        { error: 'Maximum 100 prospects allowed per enrichment request' },
        { status: 400 }
      );
    }

    if (!body.businessAnalysis) {
      console.error('❌ Missing business analysis');
      return NextResponse.json(
        { error: 'Missing required field: businessAnalysis' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.LEAD_MAGIC_API_KEY) {
      console.error('❌ LEAD_MAGIC_API_KEY not set');
      return NextResponse.json(
        { error: 'Lead Magic API configuration error' },
        { status: 500 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not set');
      return NextResponse.json(
        { error: 'OpenAI configuration error' },
        { status: 500 }
      );
    }

    // Filter prospects that have LinkedIn URLs
    const prospectsWithLinkedIn = body.prospects.filter(
      (p) => p.linkedinUrl && p.linkedinUrl.trim()
    );
    const prospectsWithoutLinkedIn = body.prospects.filter(
      (p) => !p.linkedinUrl || !p.linkedinUrl.trim()
    );

    if (prospectsWithLinkedIn.length === 0) {
      console.error('❌ No prospects with LinkedIn URLs found');
      return NextResponse.json(
        { error: 'No prospects with LinkedIn URLs found for enrichment' },
        { status: 400 }
      );
    }

    // Prioritize prospects if specified
    let orderedProspects = prospectsWithLinkedIn;
    if (body.enrichmentSettings?.priorityProspects?.length) {
      const priorityIds = new Set(body.enrichmentSettings.priorityProspects);
      const priorityProspects = prospectsWithLinkedIn.filter((p) =>
        priorityIds.has(p.id)
      );
      const regularProspects = prospectsWithLinkedIn.filter(
        (p) => !priorityIds.has(p.id)
      );
      orderedProspects = [...priorityProspects, ...regularProspects];
    }

    // Create a minimal PersonalizationContext from available data
    const context = {
      campaignIntent: 'Sales Calls' as const,
      businessAnalysis: {
        coreValueProposition: body.businessAnalysis?.valueProposition || '',
        targetCustomer: body.businessAnalysis?.targetCustomer || '',
        keyDifferentiator: body.businessAnalysis?.keyDifferentiator || '',
        painPoints: body.businessAnalysis?.painPoints || [],
        keyCapabilities: body.businessAnalysis?.keyCapabilities || [],
        competitiveEdges: body.businessAnalysis?.competitiveEdges || []
      },
      targetSegment: {
        industries: body.businessAnalysis?.industry
          ? [body.businessAnalysis.industry]
          : [],
        roles: [],
        companySize: [],
        location: []
      },
      regenerationSettings: {
        tone: 'professional' as const,
        playType: 'value-based' as const,
        ctaStyle: 'soft-ask' as const,
        ctaAction: 'Schedule a quick call to discuss how we can help',
        customInstructions: ''
      }
    };

    // Enrich prospects using Lead Magic service
    const enrichedProspects = await leadMagicService.enrichProspectsBatch(
      orderedProspects,
      context,
      body.enrichmentSettings?.batchSize || 10
    );

    // Calculate statistics
    const stats = leadMagicService.getEnrichmentStats(enrichedProspects);
    const processingTime = Date.now() - startTime;

    // Generate insights from enriched data
    const insights = generateEnrichmentInsights(enrichedProspects);

    const response: ProspectEnrichmentResponse = {
      success: true,
      data: {
        enrichedProspects,
        statistics: {
          ...stats,
          processingTime
        },
        insights
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('💥 Prospect enrichment error:', error);

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

// Helper function to generate insights from enriched prospect data
function generateEnrichmentInsights(enrichedProspects: EnrichedProspect[]) {
  const successfulProspects = enrichedProspects.filter(
    (p) => p.enrichmentSuccess
  );

  if (successfulProspects.length === 0) {
    return {
      topCompanies: [],
      topIndustries: [],
      avgConnections: 0,
      profileCompleteness: 0
    };
  }

  // Top companies analysis
  const companyCount = new Map<string, number>();
  successfulProspects.forEach((p) => {
    const company = p.leadMagicProfile?.company_name;
    if (company) {
      companyCount.set(company, (companyCount.get(company) || 0) + 1);
    }
  });

  const topCompanies = Array.from(companyCount.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([company, count]) => ({ company, count }));

  // Top industries analysis
  const industryCount = new Map<string, number>();
  successfulProspects.forEach((p) => {
    const industry = p.leadMagicProfile?.company_industry;
    if (industry) {
      industryCount.set(industry, (industryCount.get(industry) || 0) + 1);
    }
  });

  const topIndustries = Array.from(industryCount.entries())
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([industry, count]) => ({ industry, count }));

  // Average connections
  const connections = successfulProspects
    .map((p) =>
      parseInt(p.leadMagicProfile?.connections?.replace(/[^0-9]/g, '') || '0')
    )
    .filter((n) => n > 0);

  const avgConnections =
    connections.length > 0
      ? Math.round(connections.reduce((a, b) => a + b, 0) / connections.length)
      : 0;

  // Profile completeness score
  const completenessScores = successfulProspects.map((p) => {
    const profile = p.leadMagicProfile;
    let score = 0;
    const fields = [
      profile?.fullName,
      profile?.headline,
      profile?.about,
      profile?.company_name,
      profile?.company_industry,
      profile?.location
    ];

    fields.forEach((field) => {
      if (field && field.trim()) score += 1;
    });

    return (score / fields.length) * 100;
  });

  const profileCompleteness =
    completenessScores.length > 0
      ? Math.round(
          completenessScores.reduce((a, b) => a + b, 0) /
            completenessScores.length
        )
      : 0;

  return {
    topCompanies,
    topIndustries,
    avgConnections,
    profileCompleteness
  };
}
