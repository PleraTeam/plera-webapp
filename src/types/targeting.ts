// Targeting types for Apollo.io integration

export interface TargetingFilters {
  // Company Profile
  industries: string[];
  companySizes: CompanySize[]; // Renamed from employeeHeadcount to avoid duplication
  revenueRanges: RevenueRange[];
  companyTypes: string[]; // Public, Private, Non-profit, etc.
  fundingStages: string[]; // Seed, Series A, IPO, etc.
  targetLocations: Location[];

  // People Targeting
  jobTitles: string[]; // Combined primary + secondary roles
  seniorities: string[];
  departments: string[]; // Sales, Engineering, Marketing, etc.
  functions: string[]; // Business Development, Product Management, etc.

  // Technology & Tools
  technologies: string[]; // CRM, Marketing automation, etc.
  techCategories: string[]; // SaaS, Cloud, Analytics, etc.

  // Advanced Targeting
  searchKeywords: string[]; // Free-form keywords
  companyTraits: string[]; // Custom company characteristics
  excludeKeywords: string[]; // Negative keywords to exclude

  // Growth & Activity
  recentFunding: boolean; // Companies with recent funding
  hiring: boolean; // Companies actively hiring
  newsActivity: boolean; // Companies in the news
  jobChanges: boolean; // People who recently changed jobs

  // Email Quality
  verifiedEmail: boolean; // Only prospects with verified email addresses
}

export interface CompanySize {
  id: string;
  label: string;
  min: number;
  max: number | null; // null for "500+" type ranges
  apolloValue: string[]; // Apollo.io API format: ["1", "10"]
}

export interface RevenueRange {
  id: string;
  label: string;
  min: number;
  max: number | null; // null for "100M+" type ranges
  apolloValue: string[]; // Apollo.io API format
}

// Removed EmployeeRange interface - using CompanySize for employee headcount to avoid duplication

export interface Location {
  id: string;
  label: string;
  country: string;
  state?: string;
  city?: string;
  apolloValue: string; // Apollo.io API format: "California, US"
}

export interface TargetSegment {
  id: string;
  name: string;
  description?: string;
  filters: TargetingFilters;
  isAIGenerated: boolean;
  estimatedSize?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Apollo.io API mapping interfaces
export interface ApolloSearchFilters {
  // Organization filters
  organization_num_employees_ranges?: string[];
  organization_revenue_ranges?: string[][];
  organization_locations?: string[];
  organization_industries?: string[];

  // Person filters
  person_titles?: string[];
  person_seniorities?: string[];
  person_locations?: string[];
  email_status?: string[]; // For verified email filtering

  // Keywords and traits
  q_organization_keyword_tags?: string[];
  q_keywords?: string;
}

// Predefined options for dropdowns
export const COMPANY_SIZES: CompanySize[] = [
  {
    id: 'startup',
    label: '1-10 employees',
    min: 1,
    max: 10,
    apolloValue: ['1', '10']
  },
  {
    id: 'small',
    label: '11-50 employees',
    min: 11,
    max: 50,
    apolloValue: ['11', '50']
  },
  {
    id: 'medium',
    label: '51-200 employees',
    min: 51,
    max: 200,
    apolloValue: ['51', '200']
  },
  {
    id: 'large',
    label: '201-1000 employees',
    min: 201,
    max: 1000,
    apolloValue: ['201', '1000']
  },
  {
    id: 'enterprise',
    label: '1000+ employees',
    min: 1000,
    max: null,
    apolloValue: ['1000', '']
  }
];

export const REVENUE_RANGES: RevenueRange[] = [
  {
    id: 'startup',
    label: 'Under $1M',
    min: 0,
    max: 1000000,
    apolloValue: ['0', '1000000']
  },
  {
    id: 'small',
    label: '$1M - $10M',
    min: 1000000,
    max: 10000000,
    apolloValue: ['1000000', '10000000']
  },
  {
    id: 'medium',
    label: '$10M - $50M',
    min: 10000000,
    max: 50000000,
    apolloValue: ['10000000', '50000000']
  },
  {
    id: 'large',
    label: '$50M - $100M',
    min: 50000000,
    max: 100000000,
    apolloValue: ['50000000', '100000000']
  },
  {
    id: 'enterprise',
    label: '$100M+',
    min: 100000000,
    max: null,
    apolloValue: ['100000000', '']
  }
];

export const INDUSTRIES = [
  'Technology',
  'Software',
  'Healthcare',
  'Financial Services',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Marketing',
  'Consulting',
  'Education',
  'Non-profit',
  'Government',
  'Media',
  'Transportation',
  'Energy',
  'Food & Beverage',
  'Hospitality',
  'Construction',
  'Automotive',
  'Telecommunications'
];

export const JOB_TITLES = [
  // C-Level
  'CEO',
  'CTO',
  'CFO',
  'COO',
  'CMO',
  'CPO',
  'CHRO',

  // VP Level
  'VP Sales',
  'VP Marketing',
  'VP Engineering',
  'VP Operations',
  'VP Product',

  // Director Level
  'Director of Sales',
  'Sales Director',
  'Marketing Director',
  'Engineering Director',
  'Product Director',
  'Operations Director',

  // Manager Level
  'Sales Manager',
  'Marketing Manager',
  'Product Manager',
  'Engineering Manager',
  'Operations Manager',
  'Project Manager',
  'Account Manager',

  // Specialist/Lead
  'Sales Representative',
  'Account Executive',
  'Business Development',
  'Marketing Specialist',
  'Software Engineer',
  'Product Owner',
  'Data Analyst',
  'UX Designer',
  'DevOps Engineer'
];

export const SENIORITY_LEVELS = [
  'c_suite',
  'founder',
  'owner',
  'partner',
  'vp',
  'director',
  'manager',
  'senior',
  'entry'
];

export const LOCATIONS: Location[] = [
  // Major English-speaking markets
  {
    id: 'us',
    label: 'United States',
    country: 'US',
    apolloValue: 'United States'
  },
  { id: 'canada', label: 'Canada', country: 'CA', apolloValue: 'Canada' },
  {
    id: 'uk',
    label: 'United Kingdom',
    country: 'GB',
    apolloValue: 'United Kingdom'
  },
  {
    id: 'australia',
    label: 'Australia',
    country: 'AU',
    apolloValue: 'Australia'
  },

  // Major European markets
  { id: 'germany', label: 'Germany', country: 'DE', apolloValue: 'Germany' },
  { id: 'france', label: 'France', country: 'FR', apolloValue: 'France' },
  {
    id: 'netherlands',
    label: 'Netherlands',
    country: 'NL',
    apolloValue: 'Netherlands'
  },
  {
    id: 'switzerland',
    label: 'Switzerland',
    country: 'CH',
    apolloValue: 'Switzerland'
  },

  // South Africa (for Kupisa)
  {
    id: 'south_africa',
    label: 'South Africa',
    country: 'ZA',
    apolloValue: 'South Africa'
  },

  // Popular US states
  {
    id: 'california',
    label: 'California, US',
    country: 'US',
    state: 'CA',
    apolloValue: 'California, US'
  },
  {
    id: 'new_york',
    label: 'New York, US',
    country: 'US',
    state: 'NY',
    apolloValue: 'New York, US'
  },
  {
    id: 'texas',
    label: 'Texas, US',
    country: 'US',
    state: 'TX',
    apolloValue: 'Texas, US'
  },
  {
    id: 'florida',
    label: 'Florida, US',
    country: 'US',
    state: 'FL',
    apolloValue: 'Florida, US'
  }
];

// Additional filter constants to match Apollo's comprehensive capabilities
export const DEPARTMENTS = [
  'Sales',
  'Marketing',
  'Engineering',
  'Product',
  'Operations',
  'Finance',
  'Human Resources',
  'Customer Success',
  'Support',
  'Legal',
  'Compliance',
  'Data & Analytics',
  'Business Development',
  'Strategy',
  'Research & Development',
  'Quality Assurance',
  'IT',
  'Security',
  'Design',
  'Content',
  'Partnerships'
];

export const FUNCTIONS = [
  'Business Development',
  'Product Management',
  'Software Development',
  'Data Analysis',
  'Digital Marketing',
  'Sales Management',
  'Customer Success',
  'Project Management',
  'Strategic Planning',
  'Financial Analysis',
  'Human Resources',
  'Operations Management',
  'Quality Assurance',
  'Research & Development',
  'Business Intelligence',
  'Compliance',
  'Cybersecurity',
  'UX/UI Design',
  'Technical Writing',
  'Partnerships'
];

export const COMPANY_TYPES = [
  'Public Company',
  'Private Company',
  'Startup',
  'Non-profit',
  'Government Agency',
  'Educational Institution',
  'Healthcare Organization',
  'Professional Services',
  'Consulting Firm',
  'Technology Company',
  'Manufacturing Company',
  'Retail Company',
  'Financial Institution'
];

export const FUNDING_STAGES = [
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Series D+',
  'Growth Stage',
  'IPO',
  'Public Company',
  'Acquired',
  'Private Equity',
  'Venture Capital',
  'Angel Funded',
  'Bootstrapped',
  'Debt Financing'
];

export const TECHNOLOGIES = [
  // CRM & Sales
  'Salesforce',
  'HubSpot',
  'Pipedrive',
  'Zoho CRM',
  'Monday.com',
  'Outreach',
  'SalesLoft',
  'Apollo',
  'ZoomInfo',
  'LinkedIn Sales Navigator',

  // Marketing
  'Marketo',
  'Pardot',
  'MailChimp',
  'Constant Contact',
  'SendGrid',
  'Google Analytics',
  'Adobe Analytics',
  'Mixpanel',
  'Amplitude',
  'Facebook Ads',
  'Google Ads',
  'LinkedIn Ads',

  // E-commerce
  'Shopify',
  'WooCommerce',
  'Magento',
  'BigCommerce',
  'Stripe',
  'PayPal',
  'Square',
  'Klarna',
  'Afterpay',

  // Cloud & Infrastructure
  'AWS',
  'Microsoft Azure',
  'Google Cloud',
  'Docker',
  'Kubernetes',
  'Terraform',
  'Jenkins',
  'GitHub',
  'GitLab',
  'Bitbucket',

  // Development
  'React',
  'Angular',
  'Vue.js',
  'Node.js',
  'Python',
  'Java',
  'C#',
  '.NET',
  'Ruby on Rails',
  'PHP',
  'Laravel',
  'Django',

  // Communication & Collaboration
  'Slack',
  'Microsoft Teams',
  'Zoom',
  'Calendly',
  'Intercom',
  'Zendesk',
  'Freshdesk',
  'Help Scout',
  'Notion',
  'Asana',
  'Trello'
];

export const TECH_CATEGORIES = [
  'SaaS',
  'Cloud Computing',
  'Analytics & BI',
  'CRM',
  'Marketing Automation',
  'E-commerce',
  'Cybersecurity',
  'AI & Machine Learning',
  'Developer Tools',
  'Communication',
  'Project Management',
  'HR Tech',
  'Fintech',
  'Edtech',
  'Healthtech',
  'Real Estate Tech',
  'Supply Chain',
  'IoT',
  'Blockchain'
];

// Helper functions
export function convertToApolloFilters(
  filters: TargetingFilters
): ApolloSearchFilters {
  const apolloFilters: ApolloSearchFilters = {};

  if (filters.industries.length > 0) {
    apolloFilters.q_organization_keyword_tags = filters.industries;
  }

  if (filters.companySizes.length > 0) {
    apolloFilters.organization_num_employees_ranges = filters.companySizes.map(
      (size) => {
        if (Array.isArray(size.apolloValue)) {
          return `${size.apolloValue[0]}-${size.apolloValue[1]}`;
        }
        return size.apolloValue;
      }
    );
  }

  if (filters.revenueRanges.length > 0) {
    apolloFilters.organization_revenue_ranges = filters.revenueRanges.map(
      (range) => range.apolloValue
    );
  }

  if (filters.targetLocations.length > 0) {
    apolloFilters.organization_locations = filters.targetLocations.map(
      (loc) => loc.apolloValue
    );
  }

  if (filters.jobTitles.length > 0) {
    apolloFilters.person_titles = filters.jobTitles;
  }

  if (filters.seniorities.length > 0) {
    apolloFilters.person_seniorities = filters.seniorities;
  }

  if (filters.searchKeywords.length > 0) {
    // Combine with existing keyword tags if any
    const existingTags = apolloFilters.q_organization_keyword_tags || [];
    apolloFilters.q_organization_keyword_tags = [
      ...existingTags,
      ...filters.searchKeywords
    ];
  }

  if (filters.companyTraits.length > 0) {
    // Combine with existing keyword tags if any
    const existingTags = apolloFilters.q_organization_keyword_tags || [];
    apolloFilters.q_organization_keyword_tags = [
      ...existingTags,
      ...filters.companyTraits
    ];
  }

  if (filters.technologies && filters.technologies.length > 0) {
    // Add technologies to keyword tags
    const existingTags = apolloFilters.q_organization_keyword_tags || [];
    apolloFilters.q_organization_keyword_tags = [
      ...existingTags,
      ...filters.technologies
    ];
  }

  if (filters.departments && filters.departments.length > 0) {
    // Add departments to job title search
    const existingTitles = apolloFilters.person_titles || [];
    apolloFilters.person_titles = [...existingTitles, ...filters.departments];
  }

  if (filters.verifiedEmail) {
    // Filter for verified email addresses only
    // Apollo uses 'verified' and 'guessed' as the main statuses
    apolloFilters.email_status = ['verified'];
  }

  return apolloFilters;
}
