// Lead Magic Integration Service
// Replicates the n8n workflow for LinkedIn profile enrichment

export interface LeadMagicProfile {
  profileUrl: string;
  firstName: string;
  lastName: string;
  fullName: string;
  publicIdentifier: string;
  headline: string;
  company_name: string;
  company_size: string;
  company_industry: string;
  company_linkedin_url: string;
  company_website: string;
  connections: string;
  followers: string;
  country: string;
  location: string;
  about: string;
  profilePicture?: string;
  skills?: string[];
}

export interface PersonalizedComponents {
  subject: string;
  body: string;
}

export interface PersonalizationContext {
  campaignIntent:
    | 'Demo Calls'
    | 'Sales Calls'
    | 'Partnerships'
    | 'Investor Calls'
    | 'Potential Hires';
  businessAnalysis: {
    coreValueProposition: string;
    targetCustomer: string;
    keyDifferentiator: string;
    painPoints: string[];
    keyCapabilities: string[];
    competitiveEdges: string[];
  };
  targetSegment: {
    industries: string[];
    roles: string[];
    companySize: string[];
    location: string[];
  };
  regenerationSettings: {
    tone: 'professional' | 'friendly' | 'casual' | 'direct';
    playType:
      | 'value-based'
      | 'question-based'
      | 'pain-agitate-solve'
      | 'customer-story'
      | 'custom';
    ctaStyle: 'soft-ask' | 'hard-ask' | 'no-ask' | 'custom';
    ctaAction: string;
    customInstructions: string;
  };
  linkedInData?: LeadMagicProfile;
}

export interface Prospect {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: string;
  location: string;
  email: string;
}

export interface EnrichedProspect {
  // Original prospect data
  id: string;
  email: string;
  linkedinUrl: string;

  // Lead Magic enriched data
  leadMagicProfile: LeadMagicProfile;

  // AI-generated personalization
  personalizedComponents: PersonalizedComponents;

  // Research metadata
  enrichmentDate: string;
  enrichmentSuccess: boolean;
  error?: string;
}

// Intent-driven message strategies
const intentStrategies = {
  'Demo Calls': {
    focus: 'product demonstration value',
    urgency: 'medium',
    approach: 'show practical benefits',
    cta: 'schedule demo to see results'
  },
  'Sales Calls': {
    focus: 'business impact and ROI',
    urgency: 'high',
    approach: 'quantify business value',
    cta: 'discuss implementation timeline'
  },
  Partnerships: {
    focus: 'mutual benefit and collaboration',
    urgency: 'low',
    approach: 'explore synergies',
    cta: 'explore partnership opportunities'
  },
  'Investor Calls': {
    focus: 'growth potential and market opportunity',
    urgency: 'medium',
    approach: 'present vision and traction',
    cta: 'share investment opportunity'
  },
  'Potential Hires': {
    focus: 'career opportunity and company culture',
    urgency: 'low',
    approach: 'highlight role and growth',
    cta: 'discuss career opportunity'
  }
};

// Helper functions for instruction generation
function getToneInstructions(tone: string): string {
  const instructions = {
    professional:
      'Use formal business language, proper titles, and respectful address. Maintain corporate etiquette.',
    friendly:
      'Be warm and approachable while remaining professional. Use conversational language and show genuine interest.',
    casual:
      "Write like you're talking to a colleague. Use contractions, natural language, and a relaxed approach.",
    direct:
      'Get straight to the point. No fluff, clear value proposition, immediate relevance.'
  };
  return (
    instructions[tone as keyof typeof instructions] || instructions.professional
  );
}

function getPlayTypeInstructions(playType: string): string {
  const instructions = {
    'value-based':
      'Lead with the tangible business value and outcomes you deliver. Focus on ROI, efficiency gains, cost savings.',
    'question-based':
      'Start with thought-provoking questions about their challenges. Use questions to uncover pain points.',
    'pain-agitate-solve':
      'Identify their pain point, agitate it by showing consequences, then present your solution.',
    'customer-story':
      'Share a relevant success story from a similar company or role. Use social proof and case studies.',
    custom: 'Follow the custom instructions provided for messaging approach.'
  };
  return (
    instructions[playType as keyof typeof instructions] ||
    instructions['value-based']
  );
}

function getCtaStyleInstructions(ctaStyle: string): string {
  const instructions = {
    'soft-ask':
      'Use gentle, low-pressure language. Suggest rather than demand. Make it easy to say yes or no.',
    'hard-ask':
      'Be direct and confident in your request. Create urgency and clearly state what you want.',
    'no-ask':
      'End with value or insight. No direct call-to-action, just open the door for future conversation.',
    custom: 'Follow the custom instructions provided for call-to-action style.'
  };
  return (
    instructions[ctaStyle as keyof typeof instructions] ||
    instructions['soft-ask']
  );
}

function getCtaActionInstructions(ctaAction: string): string {
  const actionMap: { [key: string]: string } = {
    'schedule-meeting':
      'Request a meeting to discuss their specific needs and how you can help',
    'request-demo':
      'Invite them to see a demonstration of your solution in action',
    'schedule-call':
      'Suggest a phone call to explore how you can work together',
    'ask-question':
      'Ask a thoughtful question related to their business challenges',
    'ask-response': 'Request their thoughts or feedback on your proposition',
    'request-feedback': 'Ask for their input or perspective on industry trends',
    'offer-resources':
      'Provide valuable resources or insights related to their work'
  };
  return (
    actionMap[ctaAction] ||
    'Request a conversation to explore mutual opportunities'
  );
}

class LeadMagicService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.leadmagic.io';
  private readonly rateLimitDelay = 3000; // 3 seconds like in n8n workflow

  constructor() {
    this.apiKey = process.env.LEAD_MAGIC_API_KEY || '';
  }

  private checkApiKey(): boolean {
    if (!this.apiKey) {
      console.warn(
        '⚠️ LEAD_MAGIC_API_KEY not configured - Lead Magic enrichment disabled'
      );
      return false;
    }
    return true;
  }

  /**
   * Enriches a prospect's LinkedIn profile using Lead Magic API
   * Replicates the "Request LinkedIn Profile" node from n8n workflow
   */
  async enrichLinkedInProfile(
    linkedinUrl: string
  ): Promise<LeadMagicProfile | null> {
    if (!this.checkApiKey()) {
      return null;
    }

    try {
      // console.log(`🔍 Enriching LinkedIn profile: ${linkedinUrl}`);

      const response = await fetch(`${this.baseUrl}/profile-search`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile_url: linkedinUrl
        })
      });

      if (!response.ok) {
        console.error(
          `❌ Lead Magic API error: ${response.status} ${response.statusText}`
        );
        return null;
      }

      const profileData = await response.json();
      // console.log(
      //   `✅ Successfully enriched profile for: ${profileData.fullName}`
      // );

      return {
        profileUrl: profileData.profileUrl || linkedinUrl,
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        fullName: profileData.fullName || '',
        publicIdentifier: profileData.publicIdentifier || '',
        headline: profileData.headline || '',
        company_name: profileData.company_name || '',
        company_size: profileData.company_size || '',
        company_industry: profileData.company_industry || '',
        company_linkedin_url: profileData.company_linkedin_url || '',
        company_website: profileData.company_website || '',
        connections: profileData.connections || '',
        followers: profileData.followers || '',
        country: profileData.country || '',
        location: profileData.location || '',
        about: profileData.about || '',
        profilePicture: profileData.profilePicture,
        skills: profileData.skills || []
      };
    } catch (error) {
      console.error(
        `❌ Error enriching LinkedIn profile ${linkedinUrl}:`,
        error
      );
      return null;
    }
  }

  /**
   * Generates hyper-personalized email using dynamic context-aware prompts
   * Replaces the rigid 5-column template system with intelligent personalization
   */
  async generateHyperPersonalizedMessage(
    prospect: Prospect,
    context: PersonalizationContext
  ): Promise<PersonalizedComponents | null> {
    if (!process.env.OPENAI_API_KEY) {
      console.warn(
        '⚠️ OPENAI_API_KEY not configured - personalization disabled'
      );
      return null;
    }

    try {
      // console.log(
      //   `🤖 Generating hyper-personalized message for: ${prospect.name}`
      // );

      const prompt = this.buildPersonalizationPrompt(prospect, context);

      const openaiResponse = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content:
                  "You are an expert email personalization specialist who understands business context, industry dynamics, and human psychology. You create emails that feel personally crafted and highly relevant to the recipient's specific situation and challenges."
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.8, // Higher for more creative personalization
            max_tokens: 600, // More room for sophisticated messages
            response_format: { type: 'json_object' }
          })
        }
      );

      if (!openaiResponse.ok) {
        console.error(`❌ OpenAI API error: ${openaiResponse.status}`);
        return null;
      }

      const result = await openaiResponse.json();
      const personalizedContent = JSON.parse(result.choices[0].message.content);

      // Enforce character limits
      let subject = personalizedContent.subject || '';
      let body = personalizedContent.body || '';

      // Truncate if exceeded limits
      if (subject.length > 100) {
        subject = subject.substring(0, 97) + '...';
        console.warn(
          `⚠️ Subject truncated for ${prospect.name}: ${subject.length} -> 100 chars`
        );
      }

      if (body.length > 1000) {
        body = body.substring(0, 997) + '...';
        console.warn(
          `⚠️ Body truncated for ${prospect.name}: ${body.length} -> 1000 chars`
        );
      }

      // console.log(
      //   `✅ Generated hyper-personalized message for: ${prospect.name} (Subject: ${subject.length}/100, Body: ${body.length}/1000)`
      // );

      return {
        subject,
        body
      };
    } catch (error) {
      console.error(`❌ Error generating hyper-personalized message:`, error);
      return null;
    }
  }

  /**
   * Builds dynamic personalization prompt based on full campaign context
   */
  private buildPersonalizationPrompt(
    prospect: Prospect,
    context: PersonalizationContext
  ): string {
    const strategy = intentStrategies[context.campaignIntent];

    return `# Email Personalization Task

## Campaign Context
**Intent**: ${context.campaignIntent}
**Strategy Focus**: ${strategy.focus}
**Approach**: ${strategy.approach}

## Your Company Profile
**Value Proposition**: ${context.businessAnalysis.coreValueProposition}
**Key Differentiator**: ${context.businessAnalysis.keyDifferentiator}
**Target Customer**: ${context.businessAnalysis.targetCustomer}
**Pain Points You Solve**: ${context.businessAnalysis.painPoints.join(', ')}
**Key Capabilities**: ${context.businessAnalysis.keyCapabilities.join(', ')}
**Competitive Edges**: ${context.businessAnalysis.competitiveEdges.join(', ')}

## Target Segment
**Industries**: ${context.targetSegment.industries.join(', ')}
**Roles**: ${context.targetSegment.roles.join(', ')}
**Company Sizes**: ${context.targetSegment.companySize.join(', ')}

## Prospect Profile
**Name**: ${prospect.name}
**Title**: ${prospect.title}
**Company**: ${prospect.company}
**Industry**: ${prospect.industry}
**Location**: ${prospect.location}

${
  context.linkedInData
    ? `
## LinkedIn Intelligence
**About**: ${context.linkedInData.about || 'Not available'}
**Recent Experience**: ${context.linkedInData.headline || 'Not available'}
**Company Details**: ${context.linkedInData.company_industry || prospect.industry}, ${context.linkedInData.company_size || 'Unknown size'}
**Connections**: ${context.linkedInData.connections || 'Not available'}
**Location**: ${context.linkedInData.location || prospect.location}
`
    : ''
}

## Message Instructions
**Tone**: ${getToneInstructions(context.regenerationSettings.tone)}
**Play Type**: ${getPlayTypeInstructions(context.regenerationSettings.playType)}
**CTA Style**: ${getCtaStyleInstructions(context.regenerationSettings.ctaStyle)}
**CTA Action**: ${getCtaActionInstructions(context.regenerationSettings.ctaAction)}

${
  context.regenerationSettings.customInstructions
    ? `
**Additional Instructions**: ${context.regenerationSettings.customInstructions}
`
    : ''
}

## Task
Create a highly personalized email that:
1. Connects your ${context.campaignIntent.toLowerCase()} goal with their specific role and industry
2. References relevant pain points they likely face in ${prospect.industry}
3. Shows understanding of their company context (${prospect.company})
4. Demonstrates how your capabilities solve their specific challenges
5. Uses a ${context.regenerationSettings.tone} tone throughout
6. Follows a ${context.regenerationSettings.playType} approach
7. Includes a ${context.regenerationSettings.ctaStyle} call-to-action for ${context.regenerationSettings.ctaAction}
${context.linkedInData ? '8. Incorporates relevant LinkedIn insights naturally into the message' : ''}

## Character Limits (CRITICAL)
**Subject Line**: Maximum 100 characters (keep under 80 for best deliverability)
**Email Body**: Maximum 1000 characters (aim for 600-800 for optimal engagement)

**Important**: Make this feel like it was written specifically for ${prospect.name} at ${prospect.company}. Reference their industry (${prospect.industry}) context and role (${prospect.title}) naturally.

Return JSON: {"subject": "...", "body": "..."}`;
  }

  /**
   * Enriches multiple prospects in batches with rate limiting and hyper-personalization
   * Now includes full campaign context for intelligent message generation
   */
  async enrichProspectsBatch(
    prospects: Array<{ id: string; email: string; linkedinUrl: string }>,
    context: PersonalizationContext,
    batchSize: number = 10
  ): Promise<EnrichedProspect[]> {
    const enrichedProspects: EnrichedProspect[] = [];

    // console.log(
    //   `🚀 Starting batch enrichment for ${prospects.length} prospects`
    // );

    // Process in batches of 10 (like n8n workflow)
    for (let i = 0; i < prospects.length; i += batchSize) {
      const batch = prospects.slice(i, i + batchSize);
      // console.log(
      //   `📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(prospects.length / batchSize)}`
      // );

      for (const prospect of batch) {
        // Skip if no email (like the "If" node in n8n)
        if (!prospect.email) {
          // console.log(`⏭️ Skipping prospect without email: ${prospect.id}`);
          continue;
        }

        // Skip if no LinkedIn URL
        if (!prospect.linkedinUrl) {
          // console.log(
          //   `⏭️ Skipping prospect without LinkedIn URL: ${prospect.id}`
          // );
          continue;
        }

        try {
          // Step 1: Enrich LinkedIn profile
          const leadMagicProfile = await this.enrichLinkedInProfile(
            prospect.linkedinUrl
          );

          if (!leadMagicProfile) {
            enrichedProspects.push({
              ...prospect,
              leadMagicProfile: {} as LeadMagicProfile,
              personalizedComponents: {} as PersonalizedComponents,
              enrichmentDate: new Date().toISOString(),
              enrichmentSuccess: false,
              error: 'Failed to enrich LinkedIn profile'
            });
            continue;
          }

          // Step 2: Generate hyper-personalized message with full context
          const prospectData: Prospect = {
            id: prospect.id,
            name: leadMagicProfile.fullName || 'Unknown',
            title: leadMagicProfile.headline || 'Unknown',
            company: leadMagicProfile.company_name || 'Unknown',
            industry: leadMagicProfile.company_industry || 'Unknown',
            location: leadMagicProfile.location || 'Unknown',
            email: prospect.email
          };

          const contextWithLinkedIn = {
            ...context,
            linkedInData: leadMagicProfile
          };

          const personalizedComponents =
            await this.generateHyperPersonalizedMessage(
              prospectData,
              contextWithLinkedIn
            );

          if (!personalizedComponents) {
            enrichedProspects.push({
              ...prospect,
              leadMagicProfile,
              personalizedComponents: {} as PersonalizedComponents,
              enrichmentDate: new Date().toISOString(),
              enrichmentSuccess: false,
              error: 'Failed to generate personalized components'
            });
            continue;
          }

          // Step 3: Success case
          enrichedProspects.push({
            ...prospect,
            leadMagicProfile,
            personalizedComponents,
            enrichmentDate: new Date().toISOString(),
            enrichmentSuccess: true
          });

          // console.log(
          //   `✅ Successfully enriched prospect: ${leadMagicProfile.fullName}`
          // );
        } catch (error) {
          console.error(`❌ Error processing prospect ${prospect.id}:`, error);
          enrichedProspects.push({
            ...prospect,
            leadMagicProfile: {} as LeadMagicProfile,
            personalizedComponents: {} as PersonalizedComponents,
            enrichmentDate: new Date().toISOString(),
            enrichmentSuccess: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }

        // Rate limiting delay (like "Wait" node in n8n)
        if (prospects.indexOf(prospect) < prospects.length - 1) {
          // console.log(`⏱️ Rate limiting delay: ${this.rateLimitDelay}ms`);
          await new Promise((resolve) =>
            setTimeout(resolve, this.rateLimitDelay)
          );
        }
      }

      // console.log(`✅ Completed batch ${Math.floor(i / batchSize) + 1}`);
    }

    // console.log(
    //   `🎉 Batch enrichment completed: ${enrichedProspects.length} prospects processed`
    // );
    return enrichedProspects;
  }

  /**
   * Get enrichment statistics
   */
  getEnrichmentStats(enrichedProspects: EnrichedProspect[]) {
    const total = enrichedProspects.length;
    const successful = enrichedProspects.filter(
      (p) => p.enrichmentSuccess
    ).length;
    const failed = total - successful;

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0
    };
  }
}

export const leadMagicService = new LeadMagicService();
