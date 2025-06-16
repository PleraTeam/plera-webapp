import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

type CampaignGoal =
  | 'Sales Calls'
  | 'Partnerships'
  | 'Demo Calls'
  | 'Investor Calls'
  | 'Potential Hires';

interface AnalysisRequest {
  website_url: string;
  campaign_goal: CampaignGoal;
  additional_content?: string;
}

interface BusinessAnalysis {
  coreValueProposition: string;
  targetCustomer: string;
  keyDifferentiator: string;
  implementation: string;
  painPoints: string[];
  keyCapabilities: string[];
  targetIndustries: string[];
  decisionMakers: string[];
  clientOutcomes: string[];
  competitiveEdges: string[];
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json();

    // Validate required fields
    if (!body.campaign_goal) {
      console.error('❌ Missing campaign goal');
      return NextResponse.json(
        { error: 'Missing required field: campaign_goal' },
        { status: 400 }
      );
    }

    if (!body.website_url && !body.additional_content) {
      console.error('❌ Missing content to analyze');
      return NextResponse.json(
        { error: 'Either website_url or additional_content is required' },
        { status: 400 }
      );
    }

    // Validate URL format if website URL is provided
    if (body.website_url) {
      try {
        new URL(body.website_url);
      } catch {
        console.error('❌ Invalid URL format');
        return NextResponse.json(
          { error: 'Invalid website URL format' },
          { status: 400 }
        );
      }
    }

    // Validate campaign goal
    const validGoals: CampaignGoal[] = [
      'Sales Calls',
      'Partnerships',
      'Demo Calls',
      'Investor Calls',
      'Potential Hires'
    ];
    if (!validGoals.includes(body.campaign_goal)) {
      console.error('❌ Invalid campaign goal');
      return NextResponse.json(
        { error: 'Invalid campaign goal' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (body.website_url && !process.env.SCRAPER_API_KEY) {
      console.error('❌ SCRAPER_API_KEY not set');
      return NextResponse.json(
        { error: 'ScraperAPI configuration error' },
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

    let cleanedContent = '';

    if (body.website_url) {
      // Step 1: Scrape website content
      const scraperUrl = `https://api.scraperapi.com?api_key=${process.env.SCRAPER_API_KEY}&url=${encodeURIComponent(body.website_url)}`;
      const scraperResponse = await fetch(scraperUrl, {
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!scraperResponse.ok) {
        console.error(
          '❌ ScraperAPI failed:',
          scraperResponse.status,
          scraperResponse.statusText
        );
        return NextResponse.json(
          { error: 'Failed to scrape website content' },
          { status: 503 }
        );
      }

      const htmlContent = await scraperResponse.text();

      // Step 2: Clean and prepare content
      cleanedContent = cleanHtmlContent(htmlContent);

      if (!cleanedContent || cleanedContent.length < 100) {
        console.error('❌ Insufficient content after cleaning');
        return NextResponse.json(
          { error: 'Unable to extract meaningful content from website' },
          { status: 400 }
        );
      }
    } else {
      cleanedContent = '';
    }

    // Validate that we have some content to analyze
    if (!cleanedContent && !body.additional_content) {
      console.error('❌ No content available for analysis');
      return NextResponse.json(
        {
          error:
            'No analyzable content found. Please provide a valid website URL or additional business content.'
        },
        { status: 400 }
      );
    }

    // Step 3: Get system prompt based on campaign goal
    const systemPrompt = getSystemPrompt(body.campaign_goal);

    // Step 4: Call OpenAI for analysis

    const userPrompt = `You are conducting a deep business intelligence analysis for campaign targeting purposes. Your client needs rich, actionable insights to make informed targeting decisions.

CRITICAL: Extract EVERY relevant detail from the website content${body.additional_content ? ' and additional business content' : ''}. This analysis will guide million-dollar campaign decisions.

Analyze the following ${body.additional_content ? 'website content and additional business details' : 'website content'} and provide a comprehensive business analysis in this EXACT format:

**Core Value Proposition**
[Write a compelling 2-3 sentence summary that captures the unique value, impact, and differentiation. Include specific benefits and outcomes. Example: "Kupisa delivers authentic South African peri-peri sauces using locally-sourced organic herbs, creating distinctive flavors while empowering local farming communities through direct partnerships and profit-sharing programs."]

**Target Customer**
[Identify specific customer segments with demographic and psychographic details. Include business types, customer profiles, and market segments. Example: "Food enthusiasts seeking authentic flavors, conscious consumers supporting local agriculture, restaurant owners wanting premium condiments, retail buyers looking for differentiated products, and international distributors expanding African cuisine offerings."]

**Key Differentiator**
[Identify what makes this business unique in the market. Include proprietary advantages, unique processes, or exclusive partnerships. Example: "Unique blend of locally-sourced organic herbs not found in competing products, combined with community-first sourcing model that ensures 80%+ local ingredient procurement."]

**Implementation**
[Describe how customers access and use the product/service. Include distribution channels, onboarding process, and ease of adoption. Example: "Direct online sales, retail partnerships with major chains, multiple packaging formats (250ml bottles for consumers, 2-liter for commercial use), and streamlined international shipping for export markets."]

**Pain Points**
- [Market problems this business solves - be specific about customer frustrations]
- [Industry gaps being filled - mention competitive landscape issues]
- [Customer challenges addressed - operational or experiential problems solved]
[Find 3-5 specific pain points from the content. Example: "Limited authentic African condiment options in international markets", "Need for premium sauces supporting ethical sourcing", "Gap in kosher/halaal certified specialty condiments"]

**Key Capabilities**
- [Specific operational strengths - facilities, certifications, production capacity]
- [Product variants and specifications - sizes, flavors, formats]
- [Supply chain advantages - sourcing, partnerships, logistics]
- [Quality assurance and compliance - certifications, standards, testing]
[Extract 4-6 concrete capabilities with specific details. Example: "State-of-the-art production facility with Kosher and Halaal certification", "Two variants (Mild/Hot) in 250ml consumer and 2L commercial formats"]

**Target Industries**
- [Primary industries - main market sectors this business serves]
- [Secondary markets - adjacent opportunities]
- [Related sectors - potential expansion areas]
[Be specific about industry verticals. Example: "Primary: Food and Beverage Retail", "Secondary: Hospitality and Catering", "Related: Food Service Distribution and Export"]

**Decision Makers**
- [Specific job titles who have purchasing authority]
- [Roles involved in evaluation and buying process]
- [Key stakeholders and influencers in decisions]
[List actual titles and roles. Example: "Purchasing Managers at retail chains", "Food & Beverage Directors in hospitality", "Import/Distribution Managers for international markets"]

**Client Outcomes**
- [Quantifiable results and metrics - include specific numbers when available]
- [Success stories and testimonials - concrete examples]
- [Business impact and value delivered - measurable improvements]
[Find specific metrics and outcomes. Example: "95%+ customer approval rating", "Successful international expansion to 12 countries", "Featured in major food media publications"]

**Competitive Edges**
- [Market positioning advantages - brand strength and recognition]
- [Operational or strategic advantages - unique capabilities]
- [Brand heritage and authenticity - story and credibility factors]
[Identify 3-5 specific competitive advantages. Example: "Authentic South African heritage with international recognition", "Community-first business model creating supplier loyalty", "Premium positioning in growing African cuisine market"]

EXTRACTION REQUIREMENTS:
1. Find and include ALL numerical data (percentages, quantities, years, ratings, prices)
2. Extract ALL product specifications (variants, sizes, certifications)
3. Identify ALL geographic information (locations, markets, origins)
4. Capture ALL partnerships, certifications, and credentials mentioned
5. Include ALL customer feedback, testimonials, or social proof
6. Note ALL competitive advantages and market positioning claims
7. Extract ALL operational details (facilities, processes, capabilities)

If specific information is not available in the content, write "Information not available in source content" rather than making assumptions.

${
  cleanedContent
    ? `Website content to analyze:

${cleanedContent}`
    : ''
}${
      body.additional_content
        ? `${cleanedContent ? '\n\n' : ''}===== BUSINESS CONTENT =====

${body.additional_content}`
        : ''
    }`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3, // Lower temperature for more focused, factual analysis
      max_tokens: 3000 // Increased for richer content
    });

    const analysisText = completion.choices[0]?.message?.content || '';

    if (!analysisText) {
      console.error('❌ OpenAI returned empty analysis');
      return NextResponse.json(
        { error: 'OpenAI analysis failed to generate content' },
        { status: 500 }
      );
    }

    // Step 5: Parse the analysis into structured format
    const analysis = parseBusinessAnalysis(analysisText);

    return NextResponse.json({
      success: true,
      data: {
        website_url: body.website_url,
        campaign_goal: body.campaign_goal,
        analysis,
        generated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('💥 Campaign analysis error:', error);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Analysis request timed out' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function cleanHtmlContent(html: string): string {
  if (!html) return '';

  // First pass: Remove unwanted elements but preserve structure
  let cleaned = html
    // Remove script and style tags completely
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')

    // Convert important structural elements to text markers
    .replace(/<h[1-6][^>]*>/gi, '\n=== HEADING: ')
    .replace(/<\/h[1-6]>/gi, ' ===\n')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    .replace(/<br[^>]*>/gi, '\n')

    // Remove remaining HTML tags
    .replace(/<[^>]*>/g, ' ')

    // Clean up navigation and footer content but preserve valuable business info
    .replace(
      /(home|navigation|menu|footer|header|sidebar|breadcrumb)\s*[:\-]?\s*/gi,
      ''
    )
    .replace(
      /(privacy policy|terms of service|cookie policy|gdpr|data protection).*/gi,
      ''
    )
    .replace(
      /(newsletter signup|subscribe|follow us on|social media|share this).*/gi,
      ''
    )
    .replace(/(copyright|all rights reserved|\©|\&copy;).*/gi, '')

    // Preserve and highlight important business keywords
    .replace(
      /\b(about us|our story|our mission|our vision|our values|company history|founded|established|since|experience|years)\b/gi,
      '\n🏢 COMPANY INFO: $1'
    )
    .replace(
      /\b(products|services|solutions|offerings|portfolio|catalog|range)\b/gi,
      '\n📦 OFFERINGS: $1'
    )
    .replace(
      /\b(features|benefits|advantages|capabilities|specifications|tech specs)\b/gi,
      '\n⭐ FEATURES: $1'
    )
    .replace(
      /\b(pricing|prices|cost|rates|packages|plans|subscription)\b/gi,
      '\n💰 PRICING: $1'
    )
    .replace(
      /\b(customers|clients|testimonials|reviews|case studies|success stories)\b/gi,
      '\n👥 CUSTOMERS: $1'
    )
    .replace(
      /\b(industries|sectors|markets|verticals|segments)\b/gi,
      '\n🏭 MARKETS: $1'
    )
    .replace(
      /\b(certifications|certified|accredited|compliance|standards|iso|kosher|halaal|organic)\b/gi,
      '\n🏆 CERTIFICATIONS: $1'
    )
    .replace(
      /\b(awards|recognition|featured|press|media|news)\b/gi,
      '\n🏅 RECOGNITION: $1'
    )
    .replace(
      /\b(contact|location|address|headquarters|office|facility|factory)\b/gi,
      '\n📍 LOCATION: $1'
    )
    .replace(
      /\b(team|staff|employees|founders|management|leadership)\b/gi,
      '\n👨‍💼 TEAM: $1'
    )

    // Highlight numerical data and metrics
    .replace(/(\d+%|\d+\.\d+%)/g, '\n📊 METRIC: $1')
    .replace(
      /(\d+\+|\d+,\d+|\d+ years?|\d+ countries?|\d+ customers?)/gi,
      '\n📈 STAT: $1'
    )

    // Clean excessive whitespace while preserving structure
    .replace(/\s{3,}/g, ' ')
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/^\s+|\s+$/gm, '') // Trim lines
    .trim();

  // Enhanced content prioritization - keep the most valuable sections
  const lines = cleaned.split('\n');
  const prioritizedLines: string[] = [];
  let currentSection = '';

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines and low-value content
    if (
      !trimmedLine ||
      trimmedLine.length < 3 ||
      /^(skip to|jump to|click here|read more|learn more|back to top)$/i.test(
        trimmedLine
      )
    ) {
      continue;
    }

    // Prioritize lines with business intelligence markers
    if (
      trimmedLine.includes('🏢') ||
      trimmedLine.includes('📦') ||
      trimmedLine.includes('⭐') ||
      trimmedLine.includes('💰') ||
      trimmedLine.includes('👥') ||
      trimmedLine.includes('🏭') ||
      trimmedLine.includes('🏆') ||
      trimmedLine.includes('📊') ||
      trimmedLine.includes('📈') ||
      trimmedLine.includes('🏅')
    ) {
      prioritizedLines.push(line);
      currentSection = trimmedLine;
    } else if (currentSection) {
      // Include content following important sections
      prioritizedLines.push(line);
      if (prioritizedLines.length > 300) break; // Limit to most important content
    } else if (trimmedLine.length > 20) {
      // Include substantial content even without markers
      prioritizedLines.push(line);
    }
  }

  const finalContent = prioritizedLines.join('\n');

  // Keep more content for comprehensive analysis (up to 12000 chars for GPT-4)
  return finalContent.length > 12000
    ? finalContent.substring(0, 12000) +
        '\n\n[Content truncated - analysis based on most relevant sections]'
    : finalContent;
}

function getSystemPrompt(campaignGoal: CampaignGoal): string {
  const systemPrompts = {
    'Sales Calls':
      'You are a senior sales analyst specializing in direct sales opportunities. Focus on identifying direct buyers, decision makers with purchasing authority, and sales-ready prospects. Emphasize immediate revenue opportunities and purchasing decision processes.',

    Partnerships:
      'You are a business development analyst specializing in strategic partnerships and distribution channels. Focus on identifying potential distributors, channel partners, and collaborative opportunities. Emphasize relationship-building and mutual value creation.',

    'Demo Calls':
      'You are a technical sales analyst specializing in product demonstrations and proof-of-concept scenarios. Focus on identifying prospects who need to see the product in action, technical decision makers, and evaluation processes.',

    'Investor Calls':
      'You are an investment analyst specializing in market opportunities and growth potential. Focus on market size, scalability, competitive positioning, and investment-worthy metrics. Emphasize growth trajectory and market opportunity.',

    'Potential Hires':
      'You are a talent acquisition analyst specializing in company culture and hiring opportunities. Focus on company growth stage, technical requirements, team structure, and employment value proposition. Emphasize career opportunities and company culture.'
  };

  return systemPrompts[campaignGoal] || systemPrompts['Sales Calls'];
}

function parseBusinessAnalysis(text: string): BusinessAnalysis {
  // If text is too short or doesn't contain expected headers, provide fallback
  if (!text || text.length < 50) {
    return {
      coreValueProposition: 'Analysis content not available',
      targetCustomer: 'To be determined',
      keyDifferentiator: 'To be determined',
      implementation: 'To be determined',
      painPoints: ['Analysis incomplete'],
      keyCapabilities: ['Analysis incomplete'],
      targetIndustries: ['Analysis incomplete'],
      decisionMakers: ['Analysis incomplete'],
      clientOutcomes: ['Analysis incomplete'],
      competitiveEdges: ['Analysis incomplete']
    };
  }

  const sections = {
    coreValueProposition: extractSection(text, 'Core Value Proposition'),
    targetCustomer: extractSection(text, 'Target Customer'),
    keyDifferentiator: extractSection(text, 'Key Differentiator'),
    implementation: extractSection(text, 'Implementation'),
    painPoints: extractListSection(text, 'Pain Points'),
    keyCapabilities: extractListSection(text, 'Key Capabilities'),
    targetIndustries: extractListSection(text, 'Target Industries'),
    decisionMakers: extractListSection(text, 'Decision Makers'),
    clientOutcomes: extractListSection(text, 'Client Outcomes'),
    competitiveEdges: extractListSection(text, 'Competitive Edges')
  };

  return sections;
}

function extractSection(text: string, sectionName: string): string {
  // Try multiple patterns to be more robust - enhanced for richer content
  const patterns = [
    // **Section Name** (markdown bold) - capture until next section or end
    new RegExp(
      `\\*\\*${sectionName}\\*\\*\\s*[:\\n]?\\s*([\\s\\S]*?)(?=\\n\\*\\*[^*]|$)`,
      'si'
    ),
    // ## Section Name (markdown header) - capture until next section or end
    new RegExp(
      `#{1,6}\\s*${sectionName}\\s*[:\\n]?\\s*([\\s\\S]*?)(?=\\n#{1,6}|\\n\\*\\*|$)`,
      'si'
    ),
    // Section Name: (colon format) - capture until next section or end
    new RegExp(
      `${sectionName}\\s*:\\s*([\\s\\S]*?)(?=\\n[A-Z][^:\\n]*:|\\n\\*\\*|\\n#{1,6}|$)`,
      'si'
    ),
    // Section Name followed by content
    new RegExp(
      `${sectionName}[\\s\\n]*[:-]?[\\s\\n]*([\\s\\S]*?)(?=\\n[A-Z][^:\\n]*:|\\n\\*\\*|\\n#{1,6}|$)`,
      'si'
    )
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]?.trim()) {
      let content = match[1].trim();

      // Clean up the extracted content
      content = content
        // Remove example indicators
        .replace(/\[(Example:|e\.g\.|for example)[^\]]*\]/gi, '')
        // Remove placeholder indicators
        .replace(/\[[^\]]*\]/g, '')
        // Remove surrounding quotes
        .replace(/^["']|["']$/g, '')
        // Clean up multiple whitespace
        .replace(/\s{2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      // Only return substantial content (not just examples or placeholders)
      if (
        content.length > 10 &&
        !content.startsWith('[') &&
        !content.includes('Information not available')
      ) {
        return content;
      }
    }
  }

  return '';
}

function extractListSection(text: string, sectionName: string): string[] {
  // Try multiple patterns to be more robust
  const patterns = [
    // **Section Name** followed by list
    new RegExp(
      `\\*\\*${sectionName}\\*\\*\\s*[:\\n]?\\s*([^*]+?)(?=\\n\\*\\*|\\n#{1,6}|$)`,
      'si'
    ),
    // ## Section Name followed by list
    new RegExp(
      `#{1,6}\\s*${sectionName}\\s*[:\\n]?\\s*([^#]+?)(?=\\n#{1,6}|\\n\\*\\*|$)`,
      'si'
    ),
    // Section Name: followed by list
    new RegExp(
      `${sectionName}\\s*:\\s*([\\s\\S]*?)(?=\\n[A-Z][^:\\n]*:|\\n\\*\\*|\\n#{1,6}|$)`,
      'si'
    ),
    // Just find the section name followed by content
    new RegExp(
      `${sectionName}[\\s\\n]*[:-]?[\\s\\n]*([\\s\\S]*?)(?=\\n[A-Z][^:\\n]*:|\\n\\*\\*|\\n#{1,6}|$)`,
      'si'
    )
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const content = match[1].trim();

      // Try different list formats
      let items: string[] = [];

      // Try bullet points with -
      items = content
        .split('\n')
        .filter((line) => line.trim().startsWith('-'))
        .map((line) => line.replace(/^-\s*/, '').trim())
        .map((line) => line.replace(/^["']|["']$/g, '')) // Remove quotes
        .filter((line) => line.length > 0);

      if (items.length > 0) return items;

      // Try bullet points with *
      items = content
        .split('\n')
        .filter((line) => line.trim().startsWith('*'))
        .map((line) => line.replace(/^\*\s*/, '').trim())
        .map((line) => line.replace(/^["']|["']$/g, '')) // Remove quotes
        .filter((line) => line.length > 0);

      if (items.length > 0) return items;

      // Try numbered lists
      items = content
        .split('\n')
        .filter((line) => /^\d+\.\s/.test(line.trim()))
        .map((line) => line.replace(/^\d+\.\s*/, '').trim())
        .map((line) => line.replace(/^["']|["']$/g, '')) // Remove quotes
        .filter((line) => line.length > 0);

      if (items.length > 0) return items;

      // Try comma-separated values
      if (content.includes(',')) {
        items = content
          .split(',')
          .map((item) => item.trim())
          .map((item) => item.replace(/^["']|["']$/g, '')) // Remove quotes
          .filter((item) => item.length > 0);
        if (items.length > 1) return items;
      }

      // If no list format detected, return as single item if not empty
      if (content.length > 0) {
        return [content.replace(/^["']|["']$/g, '')]; // Remove quotes from single item
      }
    }
  }

  return [];
}
