import {
  TargetSegment,
  TargetingFilters,
  COMPANY_SIZES,
  INDUSTRIES,
  JOB_TITLES
} from '@/types/targeting';

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

/**
 * Generates target segments based on business analysis from Step 1
 */
export function generateTargetSegments(
  analysis: BusinessAnalysis,
  campaignGoal: string
): TargetSegment[] {
  const segments: TargetSegment[] = [];

  // Generate only 1 focused segment with descriptive name
  const primarySegment = generatePrimarySegment(analysis, campaignGoal);
  segments.push(primarySegment);

  return segments;
}

function generatePrimarySegment(
  analysis: BusinessAnalysis,
  campaignGoal: string
): TargetSegment {
  const filters: TargetingFilters = {
    industries: extractIndustries(analysis.targetIndustries),
    companySizes: extractCompanySizes(analysis.targetCustomer),
    revenueRanges: [], // Will be populated based on company sizes
    companyTypes: [],
    fundingStages: [],
    targetLocations: [], // Will need separate logic for locations
    jobTitles: extractPrimaryRoles(analysis.decisionMakers, campaignGoal),
    seniorities: extractSeniorities(analysis.decisionMakers, campaignGoal),
    departments: [],
    functions: [],
    technologies: [],
    techCategories: [],
    searchKeywords: extractKeywords(analysis),
    companyTraits: extractCompanyTraits(analysis),
    excludeKeywords: [],
    recentFunding: false,
    hiring: false,
    newsActivity: false,
    jobChanges: false,
    verifiedEmail: true
  };

  // Generate a descriptive name based on the business analysis
  const segmentName = generateSegmentName(analysis, 'primary');

  return {
    id: `primary-${Date.now()}`,
    name: segmentName,
    description:
      analysis.targetCustomer.length > 100
        ? `${analysis.targetCustomer.substring(0, 100)}...`
        : analysis.targetCustomer,
    filters,
    isAIGenerated: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Generate descriptive segment names based on business analysis
function generateSegmentName(
  analysis: BusinessAnalysis,
  type: 'primary' | 'pain' | 'outcome' | 'competitive'
): string {
  const industries = analysis.targetIndustries.slice(0, 2);
  const roles = analysis.decisionMakers.slice(0, 2);

  // Clean and extract key terms
  const industryTerm = industries[0]
    ? cleanIndustryTerm(industries[0])
    : 'Technology';
  const roleTerm = roles[0] ? cleanRoleTerm(roles[0]) : 'Decision Makers';

  // Generate more descriptive and specific names
  switch (type) {
    case 'primary':
      if (industries.length > 0 && roles.length > 0) {
        // Create more specific segment names based on company size and role
        const sizeContext = extractSizeContext(analysis.targetCustomer);
        return `${sizeContext} ${industryTerm} ${roleTerm}`;
      } else if (industries.length > 0) {
        const sizeContext = extractSizeContext(analysis.targetCustomer);
        return `${sizeContext} ${industryTerm} Decision Makers`;
      } else {
        return `Target Decision Makers`;
      }

    case 'pain':
      if (analysis.painPoints.length > 0) {
        const painKeyword = extractMainKeyword(analysis.painPoints[0]);
        return `${industryTerm} Leaders Facing ${painKeyword} Issues`;
      }
      return `${industryTerm} Companies with Operational Challenges`;

    case 'outcome':
      if (analysis.clientOutcomes.length > 0) {
        const outcomeKeyword = extractMainKeyword(analysis.clientOutcomes[0]);
        return `${industryTerm} Companies Seeking ${outcomeKeyword} Solutions`;
      }
      return `${industryTerm} Companies Focused on Growth`;

    case 'competitive':
      if (analysis.competitiveEdges.length > 0) {
        const competitiveKeyword = extractMainKeyword(
          analysis.competitiveEdges[0]
        );
        return `${industryTerm} Companies Requiring ${competitiveKeyword} Improvements`;
      }
      return `${industryTerm} Companies Ready for Change`;

    default:
      return `${industryTerm} Target Prospects`;
  }
}

// Extract size context for more descriptive naming
function extractSizeContext(targetCustomer: string): string {
  const text = targetCustomer.toLowerCase();

  if (text.includes('startup') || text.includes('early-stage')) {
    return 'Early-Stage';
  }
  if (text.includes('small business') || text.includes('smb')) {
    return 'Small Business';
  }
  if (text.includes('enterprise') || text.includes('large corp')) {
    return 'Enterprise';
  }
  if (
    text.includes('medium') ||
    text.includes('mid-market') ||
    text.includes('growing')
  ) {
    return 'Mid-Market';
  }
  if (text.includes('scale-up') || text.includes('scaling')) {
    return 'Scaling';
  }

  return 'Growth-Stage';
}

function cleanIndustryTerm(industry: string): string {
  // Clean up industry names for segment naming
  const cleanedIndustry = industry
    .replace(/\b(and|&|or|the|companies|industry|sector)\b/gi, '')
    .replace(/[^\w\s]/g, '')
    .trim()
    .split(' ')
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return cleanedIndustry || 'Technology';
}

function cleanRoleTerm(role: string): string {
  // Extract the most relevant role term
  const roleKeywords = [
    'CEO',
    'CTO',
    'VP',
    'Director',
    'Manager',
    'Head',
    'Chief',
    'President'
  ];
  const words = role.split(' ');

  for (const keyword of roleKeywords) {
    if (role.toLowerCase().includes(keyword.toLowerCase())) {
      return keyword + 's';
    }
  }

  // If no specific role found, return cleaned first word
  const firstWord = words[0]?.replace(/[^\w]/g, '');
  return firstWord
    ? firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase() + 's'
    : 'Leaders';
}

function extractMainKeyword(text: string): string {
  if (!text) return 'Growth';

  // Extract meaningful keywords from text
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 3 &&
        ![
          'with',
          'that',
          'they',
          'have',
          'need',
          'want',
          'will',
          'would',
          'could',
          'should'
        ].includes(word)
    );

  // Return the first meaningful word, capitalized
  const keyword = words[0] || 'efficiency';
  return keyword.charAt(0).toUpperCase() + keyword.slice(1);
}

// Helper functions for extracting data
function extractIndustries(targetIndustries: string[]): string[] {
  const normalizedIndustries = targetIndustries.map((industry) =>
    normalizeIndustryName(industry.trim())
  );

  return INDUSTRIES.filter((industry) =>
    normalizedIndustries.some(
      (target) =>
        industry.toLowerCase().includes(target.toLowerCase()) ||
        target.toLowerCase().includes(industry.toLowerCase())
    )
  ).slice(0, 3); // Limit to 3 industries
}

function extractCompanySizes(targetCustomer: string): any[] {
  const text = targetCustomer.toLowerCase();
  const sizes = [];

  // Look for size indicators
  if (
    text.includes('startup') ||
    text.includes('small business') ||
    text.includes('entrepreneur')
  ) {
    sizes.push(COMPANY_SIZES.find((s) => s.id === 'startup'));
    sizes.push(COMPANY_SIZES.find((s) => s.id === 'small'));
  }

  if (
    text.includes('medium') ||
    text.includes('mid-size') ||
    text.includes('growing')
  ) {
    sizes.push(COMPANY_SIZES.find((s) => s.id === 'medium'));
  }

  if (
    text.includes('enterprise') ||
    text.includes('large') ||
    text.includes('corporation')
  ) {
    sizes.push(COMPANY_SIZES.find((s) => s.id === 'large'));
    sizes.push(COMPANY_SIZES.find((s) => s.id === 'enterprise'));
  }

  // Default to small and medium if no specific size mentioned
  if (sizes.length === 0) {
    sizes.push(COMPANY_SIZES.find((s) => s.id === 'small'));
    sizes.push(COMPANY_SIZES.find((s) => s.id === 'medium'));
  }

  return sizes.filter(Boolean);
}

function extractCompanyTraits(analysis: BusinessAnalysis): string[] {
  const traits: string[] = [];

  // Extract traits from key capabilities
  analysis.keyCapabilities.forEach((capability) => {
    if (
      capability.toLowerCase().includes('certified') ||
      capability.toLowerCase().includes('certification')
    ) {
      traits.push('certified');
    }
    if (
      capability.toLowerCase().includes('award') ||
      capability.toLowerCase().includes('recognized')
    ) {
      traits.push('award-winning');
    }
    if (
      capability.toLowerCase().includes('international') ||
      capability.toLowerCase().includes('global')
    ) {
      traits.push('international');
    }
  });

  return Array.from(new Set(traits)); // Remove duplicates
}

function extractPrimaryRoles(
  decisionMakers: string[],
  campaignGoal: string
): string[] {
  const roles: string[] = [];

  // Extract roles from decision makers list
  decisionMakers.forEach((maker) => {
    const normalizedMaker = maker.toLowerCase();

    // Find matching job titles
    const matchingTitles = JOB_TITLES.filter(
      (title) =>
        normalizedMaker.includes(title.toLowerCase()) ||
        title.toLowerCase().includes(normalizedMaker.split(' ')[0]) // Match first word
    );

    roles.push(...matchingTitles);
  });

  // Add campaign-specific roles
  if (campaignGoal === 'Sales Calls') {
    roles.push('VP Sales', 'Sales Director', 'Sales Manager');
  } else if (campaignGoal === 'Partnerships') {
    roles.push(
      'VP Business Development',
      'Partnership Manager',
      'Director of Partnerships'
    );
  } else if (campaignGoal === 'Demo Calls') {
    roles.push('Product Manager', 'Engineering Manager', 'CTO');
  }

  return Array.from(new Set(roles)).slice(0, 5); // Remove duplicates and limit
}

function extractSeniorities(
  decisionMakers: string[],
  campaignGoal: string
): string[] {
  const seniorities: string[] = [];

  // Extract seniorities based on decision maker titles
  decisionMakers.forEach((maker) => {
    const normalizedMaker = maker.toLowerCase();

    if (
      normalizedMaker.includes('ceo') ||
      normalizedMaker.includes('cto') ||
      normalizedMaker.includes('cfo') ||
      normalizedMaker.includes('coo') ||
      normalizedMaker.includes('cmo') ||
      normalizedMaker.includes('chief')
    ) {
      seniorities.push('c_suite');
    }
    if (
      normalizedMaker.includes('founder') ||
      normalizedMaker.includes('co-founder')
    ) {
      seniorities.push('founder');
    }
    if (
      normalizedMaker.includes('vp') ||
      normalizedMaker.includes('vice president')
    ) {
      seniorities.push('vp');
    }
    if (normalizedMaker.includes('director')) {
      seniorities.push('director');
    }
    if (normalizedMaker.includes('manager')) {
      seniorities.push('manager');
    }
    if (
      normalizedMaker.includes('owner') ||
      normalizedMaker.includes('proprietor')
    ) {
      seniorities.push('owner');
    }
  });

  // Add campaign-specific seniorities
  if (campaignGoal === 'Sales Calls') {
    seniorities.push('director', 'vp');
  } else if (campaignGoal === 'Partnerships') {
    seniorities.push('c_suite', 'vp');
  } else if (campaignGoal === 'Demo Calls') {
    seniorities.push('director', 'manager');
  }

  return Array.from(new Set(seniorities)).slice(0, 4); // Remove duplicates and limit
}

function extractKeywords(analysis: BusinessAnalysis): string[] {
  const keywords: string[] = [];

  // Extract from value proposition
  keywords.push(...extractKeywordsFromText(analysis.coreValueProposition));

  // Extract from differentiators
  keywords.push(...extractKeywordsFromText(analysis.keyDifferentiator));

  // Extract from capabilities
  analysis.keyCapabilities.forEach((capability) => {
    keywords.push(...extractKeywordsFromText(capability));
  });

  return Array.from(new Set(keywords)).slice(0, 8); // Remove duplicates and limit
}

function extractKeywordsFromText(text: string): string[] {
  if (!text) return [];

  // Remove common words and extract meaningful terms
  const commonWords = [
    'the',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'a',
    'an',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should'
  ];

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/)
    .filter((word) => word.length > 2 && !commonWords.includes(word))
    .slice(0, 3); // Limit per text
}

function normalizeIndustryName(industry: string): string {
  // Handle common industry name variations
  const mappings: Record<string, string> = {
    tech: 'technology',
    fintech: 'financial services',
    healthtech: 'healthcare',
    'e-commerce': 'retail',
    saas: 'software',
    b2b: 'business services',
    'food service': 'food & beverage'
  };

  const normalized = industry.toLowerCase();
  return mappings[normalized] || normalized;
}
