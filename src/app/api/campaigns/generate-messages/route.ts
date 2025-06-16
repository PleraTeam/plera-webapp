import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import { airtableService, type CampaignRecord } from '@/services/airtable';
import {
  leadMagicService,
  type EnrichedProspect,
  type PersonalizationContext
} from '@/services/lead-magic';

// Types for the API
interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  email: string;
  linkedinUrl?: string;
  companySize?: string;
  phoneNumber?: string;
  companyWebsite?: string;
}

interface BusinessAnalysis {
  companyName?: string;
  industry?: string;
  valueProposition?: string;
  competitiveEdges?: string[];
  painPoints?: string[];
  keyCapabilities?: string[];
  targetCustomer?: string;
  keyDifferentiator?: string;
}

interface MessageSettings {
  tone: 'professional' | 'friendly' | 'casual' | 'direct';
  approach:
    | 'value-based'
    | 'question-based'
    | 'pain-agitate-solve'
    | 'customer-story'
    | 'custom';
  ctaStyle: 'soft-ask' | 'hard-ask' | 'no-ask' | 'custom';
  ctaAction: string;
  customInstructions?: string;
  emailLength?: 'concise' | 'detailed';
}

interface GenerateMessagesRequest {
  campaignId: string;
  campaignName?: string;
  prospects: Prospect[];
  businessAnalysis: BusinessAnalysis;
  messageSettings: MessageSettings;
  campaignGoal?: string;
  targetingCriteria?: {
    industries: string[];
    roles: string[];
    companySize: string[];
    location: string[];
  };
}

interface GeneratedMessage {
  prospectId: string;
  prospectName: string;
  prospectEmail: string;
  subject: string;
  emailBody: string;
  airtableRecordId?: string;
  generationSuccess: boolean;
  error?: string;
}

interface GenerateMessagesResponse {
  success: boolean;
  generatedMessages: GeneratedMessage[];
  airtableStats: {
    recordsSaved: number;
    recordsFailed: number;
    organizationId: string;
  };
  processingStats: {
    totalProspects: number;
    successfulGenerations: number;
    failedGenerations: number;
  };
  error?: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    // Get Clerk authentication (but allow development bypass)
    const { userId, orgId } = await auth();
    const isDevelopment = process.env.NODE_ENV === 'development';

    if (!userId && !isDevelopment) {
      console.error('❌ No authenticated user');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const effectiveOrgId = orgId || 'dev-org';

    if (!orgId && !isDevelopment) {
      console.error('❌ No organization context');
      return NextResponse.json(
        { error: 'Organization context required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body: GenerateMessagesRequest = await request.json();

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
        { error: 'Maximum 100 prospects allowed per request' },
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

    if (!body.messageSettings) {
      console.error('❌ Missing message settings');
      return NextResponse.json(
        { error: 'Missing required field: messageSettings' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not set');
      return NextResponse.json(
        { error: 'OpenAI configuration error' },
        { status: 500 }
      );
    }

    // Initialize tracking variables
    const generatedMessages: GeneratedMessage[] = [];
    const airtableRecords: CampaignRecord[] = [];
    let successfulGenerations = 0;
    let failedGenerations = 0;

    // Step 1: Check if prospects have LinkedIn URLs for enrichment
    const prospectsWithLinkedIn = body.prospects.filter(
      (p) => p.linkedinUrl && p.linkedinUrl.trim()
    );
    const shouldEnrich =
      prospectsWithLinkedIn.length > 0 && process.env.LEAD_MAGIC_API_KEY;

    // Step 2: Build personalization context and enrich prospects with LinkedIn data if available
    const personalizationContext: PersonalizationContext = {
      campaignIntent: (body.campaignGoal as any) || 'Sales Calls',
      businessAnalysis: {
        coreValueProposition: body.businessAnalysis.valueProposition || '',
        targetCustomer: body.businessAnalysis.targetCustomer || '',
        keyDifferentiator: body.businessAnalysis.keyDifferentiator || '',
        painPoints: body.businessAnalysis.painPoints || [],
        keyCapabilities: body.businessAnalysis.keyCapabilities || [],
        competitiveEdges: body.businessAnalysis.competitiveEdges || []
      },
      targetSegment: {
        industries: body.targetingCriteria?.industries || [],
        roles: body.targetingCriteria?.roles || [],
        companySize: body.targetingCriteria?.companySize || [],
        location: body.targetingCriteria?.location || []
      },
      regenerationSettings: {
        tone: body.messageSettings.tone,
        playType: body.messageSettings.approach,
        ctaStyle: body.messageSettings.ctaStyle,
        ctaAction: body.messageSettings.ctaAction,
        customInstructions: body.messageSettings.customInstructions || ''
      }
    };

    let enrichedProspects: EnrichedProspect[] = [];
    if (shouldEnrich) {
      try {
        enrichedProspects = await leadMagicService.enrichProspectsBatch(
          prospectsWithLinkedIn.map((p) => ({
            id: p.id,
            email: p.email,
            linkedinUrl: p.linkedinUrl!
          })),
          personalizationContext,
          3 // Small batch for initial preview
        );
      } catch (error) {
        enrichedProspects = [];
      }
    }

    // Step 3: Process each prospect for message generation
    for (let i = 0; i < body.prospects.length; i++) {
      const prospect = body.prospects[i];

      try {
        // Check if we have enriched data for this prospect
        const enrichedData = enrichedProspects.find(
          (e) => e.id === prospect.id
        );
        const useEnrichedData = enrichedData && enrichedData.enrichmentSuccess;

        let generatedContent: {
          success: boolean;
          subject: string;
          emailBody: string;
          error?: string;
        };

        if (useEnrichedData && enrichedData.personalizedComponents) {
          // Use Lead Magic's new context-aware personalization
          generatedContent = {
            success: true,
            subject: enrichedData.personalizedComponents.subject,
            emailBody: enrichedData.personalizedComponents.body
          };
        } else {
          // Generate personalized message using new context-aware approach
          generatedContent = await generateHyperPersonalizedMessage(
            prospect,
            personalizationContext
          );
        }

        if (generatedContent.success) {
          // Create Airtable record
          const airtableRecord: CampaignRecord = {
            email: prospect.email,
            first_name: prospect.firstName,
            last_name: prospect.lastName,
            full_name: prospect.name,
            subject_line: generatedContent.subject,
            email_body: generatedContent.emailBody,
            campaign_id: body.campaignId,
            campaign_name: body.campaignName || 'Generated Campaign',
            prospect_company: prospect.company,
            prospect_title: prospect.title,
            // prospect_industry: prospect.industry, // Temporarily disabled - field not in Airtable schema
            prospect_location: prospect.location,
            linkedin_url: prospect.linkedinUrl,
            phone_number: prospect.phoneNumber,
            company_website: prospect.companyWebsite,
            email_sent: false,
            content_approved: false,
            created_date: new Date().toISOString(),
            user_organization: effectiveOrgId,
            user_company:
              body.businessAnalysis.companyName || 'Unknown Company',
            generation_settings: JSON.stringify(body.messageSettings)
          };

          airtableRecords.push(airtableRecord);

          // Add to response
          generatedMessages.push({
            prospectId: prospect.id,
            prospectName: prospect.name,
            prospectEmail: prospect.email,
            subject: generatedContent.subject,
            emailBody: generatedContent.emailBody,
            generationSuccess: true
          });

          successfulGenerations++;
        } else {
          generatedMessages.push({
            prospectId: prospect.id,
            prospectName: prospect.name,
            prospectEmail: prospect.email,
            subject: '',
            emailBody: '',
            generationSuccess: false,
            error: generatedContent.error
          });

          failedGenerations++;
        }

        // Small delay to avoid rate limits
        if (i < body.prospects.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (error) {
        generatedMessages.push({
          prospectId: prospect.id,
          prospectName: prospect.name,
          prospectEmail: prospect.email,
          subject: '',
          emailBody: '',
          generationSuccess: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });

        failedGenerations++;
      }
    }

    // Save all records to Airtable
    let airtableStats = {
      recordsSaved: 0,
      recordsFailed: 0,
      organizationId: effectiveOrgId
    };

    if (airtableRecords.length > 0) {
      const airtableResult = await airtableService.saveBulkRecords(
        effectiveOrgId,
        airtableRecords
      );

      if (airtableResult.success) {
        airtableStats.recordsSaved = airtableResult.recordsSaved || 0;

        // Update generated messages with record IDs
        if (airtableResult.recordIds) {
          airtableResult.recordIds.forEach((recordId, index) => {
            if (
              generatedMessages[index] &&
              generatedMessages[index].generationSuccess
            ) {
              generatedMessages[index].airtableRecordId = recordId;
            }
          });
        }
      } else {
        airtableStats.recordsFailed = airtableRecords.length;
      }
    }

    const response: GenerateMessagesResponse = {
      success: true,
      generatedMessages,
      airtableStats,
      processingStats: {
        totalProspects: body.prospects.length,
        successfulGenerations,
        failedGenerations
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('💥 Message generation error:', error);

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

// Helper function to generate hyper-personalized message with full context
async function generateHyperPersonalizedMessage(
  prospect: Prospect,
  context: PersonalizationContext
): Promise<{
  success: boolean;
  subject: string;
  emailBody: string;
  error?: string;
}> {
  try {
    // Use the Lead Magic service method for consistency
    const prospectData = {
      id: prospect.id,
      name: prospect.name,
      title: prospect.title,
      company: prospect.company,
      industry: prospect.industry,
      location: prospect.location,
      email: prospect.email
    };

    const result = await leadMagicService.generateHyperPersonalizedMessage(
      prospectData,
      context
    );

    if (!result) {
      throw new Error('Failed to generate personalized message');
    }

    return {
      success: true,
      subject: result.subject,
      emailBody: result.body
    };
  } catch (error) {
    return {
      success: false,
      subject: '',
      emailBody: '',
      error: error instanceof Error ? error.message : 'Unknown generation error'
    };
  }
}
