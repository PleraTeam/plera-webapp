// Apollo.io search services for dynamic filtering
// This provides comprehensive search capabilities for all Apollo filters

interface SearchResult {
  value: string;
  label: string;
  category?: string;
  description?: string;
}

// Location Search - Support for countries, states, cities
export async function searchLocations(query: string): Promise<SearchResult[]> {
  // Common locations database - this would ideally come from Apollo's API
  const locationDatabase = [
    // Countries
    { value: 'United States', label: 'United States', category: 'Country' },
    { value: 'Canada', label: 'Canada', category: 'Country' },
    { value: 'United Kingdom', label: 'United Kingdom', category: 'Country' },
    { value: 'Australia', label: 'Australia', category: 'Country' },
    { value: 'New Zealand', label: 'New Zealand', category: 'Country' },
    { value: 'Germany', label: 'Germany', category: 'Country' },
    { value: 'France', label: 'France', category: 'Country' },
    { value: 'Netherlands', label: 'Netherlands', category: 'Country' },
    { value: 'Switzerland', label: 'Switzerland', category: 'Country' },
    { value: 'Sweden', label: 'Sweden', category: 'Country' },
    { value: 'Norway', label: 'Norway', category: 'Country' },
    { value: 'Denmark', label: 'Denmark', category: 'Country' },
    { value: 'Finland', label: 'Finland', category: 'Country' },
    { value: 'Ireland', label: 'Ireland', category: 'Country' },
    { value: 'Belgium', label: 'Belgium', category: 'Country' },
    { value: 'Austria', label: 'Austria', category: 'Country' },
    { value: 'Italy', label: 'Italy', category: 'Country' },
    { value: 'Spain', label: 'Spain', category: 'Country' },
    { value: 'Portugal', label: 'Portugal', category: 'Country' },
    { value: 'Poland', label: 'Poland', category: 'Country' },
    { value: 'Czech Republic', label: 'Czech Republic', category: 'Country' },
    { value: 'Japan', label: 'Japan', category: 'Country' },
    { value: 'South Korea', label: 'South Korea', category: 'Country' },
    { value: 'Singapore', label: 'Singapore', category: 'Country' },
    { value: 'Hong Kong', label: 'Hong Kong', category: 'Country' },
    { value: 'India', label: 'India', category: 'Country' },
    { value: 'Israel', label: 'Israel', category: 'Country' },
    {
      value: 'United Arab Emirates',
      label: 'United Arab Emirates',
      category: 'Country'
    },
    { value: 'South Africa', label: 'South Africa', category: 'Country' },
    { value: 'Nigeria', label: 'Nigeria', category: 'Country' },
    { value: 'Brazil', label: 'Brazil', category: 'Country' },
    { value: 'Mexico', label: 'Mexico', category: 'Country' },
    { value: 'Argentina', label: 'Argentina', category: 'Country' },
    { value: 'Chile', label: 'Chile', category: 'Country' },
    { value: 'Colombia', label: 'Colombia', category: 'Country' },

    // US States
    {
      value: 'California, US',
      label: 'California, United States',
      category: 'US State'
    },
    {
      value: 'New York, US',
      label: 'New York, United States',
      category: 'US State'
    },
    { value: 'Texas, US', label: 'Texas, United States', category: 'US State' },
    {
      value: 'Florida, US',
      label: 'Florida, United States',
      category: 'US State'
    },
    {
      value: 'Illinois, US',
      label: 'Illinois, United States',
      category: 'US State'
    },
    {
      value: 'Pennsylvania, US',
      label: 'Pennsylvania, United States',
      category: 'US State'
    },
    { value: 'Ohio, US', label: 'Ohio, United States', category: 'US State' },
    {
      value: 'Georgia, US',
      label: 'Georgia, United States',
      category: 'US State'
    },
    {
      value: 'North Carolina, US',
      label: 'North Carolina, United States',
      category: 'US State'
    },
    {
      value: 'Michigan, US',
      label: 'Michigan, United States',
      category: 'US State'
    },
    {
      value: 'New Jersey, US',
      label: 'New Jersey, United States',
      category: 'US State'
    },
    {
      value: 'Virginia, US',
      label: 'Virginia, United States',
      category: 'US State'
    },
    {
      value: 'Washington, US',
      label: 'Washington, United States',
      category: 'US State'
    },
    {
      value: 'Arizona, US',
      label: 'Arizona, United States',
      category: 'US State'
    },
    {
      value: 'Massachusetts, US',
      label: 'Massachusetts, United States',
      category: 'US State'
    },
    {
      value: 'Tennessee, US',
      label: 'Tennessee, United States',
      category: 'US State'
    },
    {
      value: 'Indiana, US',
      label: 'Indiana, United States',
      category: 'US State'
    },
    {
      value: 'Missouri, US',
      label: 'Missouri, United States',
      category: 'US State'
    },
    {
      value: 'Maryland, US',
      label: 'Maryland, United States',
      category: 'US State'
    },
    {
      value: 'Wisconsin, US',
      label: 'Wisconsin, United States',
      category: 'US State'
    },
    {
      value: 'Colorado, US',
      label: 'Colorado, United States',
      category: 'US State'
    },
    {
      value: 'Minnesota, US',
      label: 'Minnesota, United States',
      category: 'US State'
    },

    // Canadian Provinces
    {
      value: 'Ontario, Canada',
      label: 'Ontario, Canada',
      category: 'Canadian Province'
    },
    {
      value: 'Quebec, Canada',
      label: 'Quebec, Canada',
      category: 'Canadian Province'
    },
    {
      value: 'British Columbia, Canada',
      label: 'British Columbia, Canada',
      category: 'Canadian Province'
    },
    {
      value: 'Alberta, Canada',
      label: 'Alberta, Canada',
      category: 'Canadian Province'
    },
    {
      value: 'Manitoba, Canada',
      label: 'Manitoba, Canada',
      category: 'Canadian Province'
    },
    {
      value: 'Saskatchewan, Canada',
      label: 'Saskatchewan, Canada',
      category: 'Canadian Province'
    },

    // Major Cities
    {
      value: 'New York, NY, US',
      label: 'New York City, New York, US',
      category: 'City'
    },
    {
      value: 'Los Angeles, CA, US',
      label: 'Los Angeles, California, US',
      category: 'City'
    },
    {
      value: 'San Francisco, CA, US',
      label: 'San Francisco, California, US',
      category: 'City'
    },
    {
      value: 'Chicago, IL, US',
      label: 'Chicago, Illinois, US',
      category: 'City'
    },
    {
      value: 'Boston, MA, US',
      label: 'Boston, Massachusetts, US',
      category: 'City'
    },
    {
      value: 'Seattle, WA, US',
      label: 'Seattle, Washington, US',
      category: 'City'
    },
    { value: 'Austin, TX, US', label: 'Austin, Texas, US', category: 'City' },
    { value: 'Miami, FL, US', label: 'Miami, Florida, US', category: 'City' },
    {
      value: 'Atlanta, GA, US',
      label: 'Atlanta, Georgia, US',
      category: 'City'
    },
    {
      value: 'Denver, CO, US',
      label: 'Denver, Colorado, US',
      category: 'City'
    },
    { value: 'London, UK', label: 'London, United Kingdom', category: 'City' },
    {
      value: 'Toronto, ON, Canada',
      label: 'Toronto, Ontario, Canada',
      category: 'City'
    },
    {
      value: 'Vancouver, BC, Canada',
      label: 'Vancouver, British Columbia, Canada',
      category: 'City'
    },
    {
      value: 'Sydney, Australia',
      label: 'Sydney, Australia',
      category: 'City'
    },
    {
      value: 'Melbourne, Australia',
      label: 'Melbourne, Australia',
      category: 'City'
    },
    {
      value: 'Auckland, New Zealand',
      label: 'Auckland, New Zealand',
      category: 'City'
    },
    {
      value: 'Wellington, New Zealand',
      label: 'Wellington, New Zealand',
      category: 'City'
    },
    { value: 'Berlin, Germany', label: 'Berlin, Germany', category: 'City' },
    { value: 'Munich, Germany', label: 'Munich, Germany', category: 'City' },
    { value: 'Paris, France', label: 'Paris, France', category: 'City' },
    {
      value: 'Amsterdam, Netherlands',
      label: 'Amsterdam, Netherlands',
      category: 'City'
    },
    {
      value: 'Zurich, Switzerland',
      label: 'Zurich, Switzerland',
      category: 'City'
    },
    {
      value: 'Stockholm, Sweden',
      label: 'Stockholm, Sweden',
      category: 'City'
    },
    { value: 'Tokyo, Japan', label: 'Tokyo, Japan', category: 'City' },
    {
      value: 'Cape Town, South Africa',
      label: 'Cape Town, South Africa',
      category: 'City'
    },
    {
      value: 'Johannesburg, South Africa',
      label: 'Johannesburg, South Africa',
      category: 'City'
    }
  ];

  // If no query, return popular locations
  if (!query || query.trim() === '') {
    return [
      { value: 'United States', label: 'United States', category: 'Country' },
      {
        value: 'California, US',
        label: 'California, United States',
        category: 'US State'
      },
      {
        value: 'New York, US',
        label: 'New York, United States',
        category: 'US State'
      },
      { value: 'United Kingdom', label: 'United Kingdom', category: 'Country' },
      { value: 'Canada', label: 'Canada', category: 'Country' },
      { value: 'Australia', label: 'Australia', category: 'Country' },
      { value: 'Germany', label: 'Germany', category: 'Country' },
      { value: 'France', label: 'France', category: 'Country' }
    ];
  }

  // Filter by search query
  const filtered = locationDatabase.filter(
    (location) =>
      location.label.toLowerCase().includes(query.toLowerCase()) ||
      location.value.toLowerCase().includes(query.toLowerCase())
  );

  return filtered.slice(0, 10); // Limit to 10 results
}

// Industry Search - Comprehensive industry list
export async function searchIndustries(query: string): Promise<SearchResult[]> {
  const industries = [
    'Technology',
    'Software',
    'SaaS',
    'Fintech',
    'Edtech',
    'Healthtech',
    'Healthcare',
    'Medical Devices',
    'Pharmaceuticals',
    'Biotechnology',
    'Financial Services',
    'Banking',
    'Insurance',
    'Investment Management',
    'Real Estate',
    'Construction',
    'Architecture',
    'Engineering',
    'Manufacturing',
    'Automotive',
    'Aerospace',
    'Industrial Equipment',
    'Retail',
    'E-commerce',
    'Fashion',
    'Luxury Goods',
    'Consumer Goods',
    'Food & Beverage',
    'Restaurants',
    'Hospitality',
    'Travel & Tourism',
    'Media & Entertainment',
    'Publishing',
    'Gaming',
    'Sports',
    'Marketing & Advertising',
    'Public Relations',
    'Digital Marketing',
    'Consulting',
    'Professional Services',
    'Legal Services',
    'Accounting',
    'Education',
    'Higher Education',
    'Online Learning',
    'Training',
    'Non-profit',
    'Government',
    'Public Sector',
    'Defense',
    'Energy',
    'Oil & Gas',
    'Renewable Energy',
    'Utilities',
    'Transportation',
    'Logistics',
    'Supply Chain',
    'Shipping',
    'Telecommunications',
    'Internet',
    'Cybersecurity',
    'Data & Analytics',
    'Artificial Intelligence',
    'Machine Learning',
    'Blockchain',
    'Cryptocurrency',
    'Agriculture',
    'Mining',
    'Chemicals',
    'Textiles',
    'Packaging'
  ];

  // If no query, return popular industries
  if (!query || query.trim() === '') {
    return [
      { value: 'Technology', label: 'Technology' },
      { value: 'Software', label: 'Software' },
      { value: 'SaaS', label: 'SaaS' },
      { value: 'Healthcare', label: 'Healthcare' },
      { value: 'Financial Services', label: 'Financial Services' },
      { value: 'Retail', label: 'Retail' },
      { value: 'Manufacturing', label: 'Manufacturing' },
      { value: 'Consulting', label: 'Consulting' },
      { value: 'Education', label: 'Education' },
      { value: 'Marketing & Advertising', label: 'Marketing & Advertising' }
    ];
  }

  const filtered = industries
    .filter((industry) => industry.toLowerCase().includes(query.toLowerCase()))
    .map((industry) => ({ value: industry, label: industry }));

  return filtered.slice(0, 10);
}

// Job Title Search - Comprehensive role database
export async function searchJobTitles(query: string): Promise<SearchResult[]> {
  const jobTitles = [
    // C-Level
    'CEO',
    'Chief Executive Officer',
    'CTO',
    'Chief Technology Officer',
    'CFO',
    'Chief Financial Officer',
    'COO',
    'Chief Operating Officer',
    'CMO',
    'Chief Marketing Officer',
    'CPO',
    'Chief Product Officer',
    'CHRO',
    'Chief Human Resources Officer',
    'CRO',
    'Chief Revenue Officer',
    'CIO',
    'Chief Information Officer',
    'CDO',
    'Chief Data Officer',
    'CSO',
    'Chief Security Officer',
    'CCO',
    'Chief Compliance Officer',

    // Founders & Owners
    'Founder',
    'Co-Founder',
    'Owner',
    'Managing Partner',
    'Partner',
    'Entrepreneur',
    'President',
    'Managing Director',

    // VP Level
    'VP Sales',
    'Vice President Sales',
    'VP Marketing',
    'Vice President Marketing',
    'VP Engineering',
    'Vice President Engineering',
    'VP Product',
    'Vice President Product',
    'VP Operations',
    'Vice President Operations',
    'VP Finance',
    'Vice President Finance',
    'VP Human Resources',
    'VP People',
    'VP Customer Success',
    'VP Business Development',
    'VP Strategy',
    'VP Growth',
    'VP Data',
    'VP Analytics',

    // Director Level
    'Director',
    'Director of Sales',
    'Sales Director',
    'Director of Marketing',
    'Marketing Director',
    'Director of Engineering',
    'Engineering Director',
    'Director of Product',
    'Product Director',
    'Director of Operations',
    'Operations Director',
    'Director of Finance',
    'Finance Director',
    'Director of HR',
    'HR Director',
    'Director of Customer Success',
    'Director of Business Development',
    'Director of Strategy',
    'Director of Data',
    'Data Director',
    'Director of Analytics',

    // Manager Level
    'Manager',
    'Sales Manager',
    'Marketing Manager',
    'Product Manager',
    'Engineering Manager',
    'Operations Manager',
    'Finance Manager',
    'HR Manager',
    'Project Manager',
    'Program Manager',
    'Account Manager',
    'Customer Success Manager',
    'Business Development Manager',
    'Data Manager',
    'Analytics Manager',
    'IT Manager',
    'Security Manager',

    // Senior Individual Contributors
    'Senior',
    'Lead',
    'Principal',
    'Staff',
    'Senior Engineer',
    'Lead Engineer',
    'Principal Engineer',
    'Staff Engineer',
    'Senior Developer',
    'Lead Developer',
    'Senior Designer',
    'Lead Designer',
    'Senior Analyst',
    'Lead Analyst',
    'Senior Consultant',
    'Principal Consultant',
    'Senior Specialist',

    // Specialists & Individual Contributors
    'Engineer',
    'Software Engineer',
    'Developer',
    'Software Developer',
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'Mobile Developer',
    'DevOps Engineer',
    'Data Engineer',
    'ML Engineer',
    'Data Scientist',
    'Data Analyst',
    'Business Analyst',
    'Systems Analyst',
    'UX Designer',
    'UI Designer',
    'Product Designer',
    'Graphic Designer',
    'Marketing Specialist',
    'Digital Marketing Specialist',
    'SEO Specialist',
    'Content Marketing Specialist',
    'Social Media Manager',
    'Community Manager',
    'Sales Representative',
    'Account Executive',
    'Business Development Representative',
    'Customer Success Specialist',
    'Support Specialist',
    'Technical Support',
    'Consultant',
    'Advisor',
    'Architect',
    'Solutions Architect',
    'Technical Architect',
    'Security Analyst',
    'Cybersecurity Specialist',
    'Network Administrator',
    'Database Administrator',
    'Quality Assurance',
    'QA Engineer',
    'Test Engineer',
    'Recruiter',
    'Talent Acquisition',
    'HR Business Partner',
    'HR Generalist',
    'Financial Analyst',
    'Accountant',
    'Controller',
    'Treasurer',
    'Auditor',
    'Legal Counsel',
    'Paralegal',
    'Compliance Officer',
    'Risk Manager',
    'Research Scientist',
    'Researcher',
    'Lab Technician',
    'Clinical Research'
  ];

  // If no query, return popular job titles
  if (!query || query.trim() === '') {
    return [
      { value: 'CEO', label: 'CEO' },
      { value: 'CTO', label: 'CTO' },
      { value: 'VP Sales', label: 'VP Sales' },
      { value: 'VP Marketing', label: 'VP Marketing' },
      { value: 'Director', label: 'Director' },
      { value: 'Manager', label: 'Manager' },
      { value: 'Product Manager', label: 'Product Manager' },
      { value: 'Engineering Manager', label: 'Engineering Manager' },
      { value: 'Sales Manager', label: 'Sales Manager' },
      { value: 'Marketing Manager', label: 'Marketing Manager' }
    ];
  }

  const filtered = jobTitles
    .filter((title) => title.toLowerCase().includes(query.toLowerCase()))
    .map((title) => ({ value: title, label: title }));

  return filtered.slice(0, 15);
}

// Seniority Level Search
export async function searchSeniorities(
  query: string
): Promise<SearchResult[]> {
  const seniorities = [
    {
      value: 'c_suite',
      label: 'C-Suite',
      description: 'CEOs, CTOs, CFOs, etc.'
    },
    {
      value: 'founder',
      label: 'Founder',
      description: 'Company founders and co-founders'
    },
    {
      value: 'owner',
      label: 'Owner',
      description: 'Business owners and proprietors'
    },
    { value: 'partner', label: 'Partner', description: 'Partners in firms' },
    {
      value: 'vp',
      label: 'Vice President',
      description: 'VP level executives'
    },
    {
      value: 'director',
      label: 'Director',
      description: 'Directors and heads of departments'
    },
    {
      value: 'manager',
      label: 'Manager',
      description: 'Managers and team leads'
    },
    {
      value: 'senior',
      label: 'Senior',
      description: 'Senior individual contributors'
    },
    {
      value: 'entry',
      label: 'Entry Level',
      description: 'Junior and entry-level roles'
    }
  ];

  // If no query, return all seniorities (they're already curated)
  if (!query || query.trim() === '') {
    return seniorities;
  }

  const filtered = seniorities.filter(
    (seniority) =>
      seniority.label.toLowerCase().includes(query.toLowerCase()) ||
      seniority.description.toLowerCase().includes(query.toLowerCase())
  );

  return filtered;
}

// Company Size Search
export async function searchCompanySizes(
  query: string
): Promise<SearchResult[]> {
  const companySizes = [
    {
      value: '1-10',
      label: '1-10 employees',
      description: 'Startups and very small businesses'
    },
    {
      value: '11-50',
      label: '11-50 employees',
      description: 'Small businesses'
    },
    {
      value: '51-200',
      label: '51-200 employees',
      description: 'Medium businesses'
    },
    {
      value: '201-500',
      label: '201-500 employees',
      description: 'Large businesses'
    },
    {
      value: '501-1000',
      label: '501-1000 employees',
      description: 'Enterprise businesses'
    },
    {
      value: '1001-5000',
      label: '1001-5000 employees',
      description: 'Large enterprises'
    },
    {
      value: '5001-10000',
      label: '5001-10000 employees',
      description: 'Very large enterprises'
    },
    {
      value: '10001+',
      label: '10001+ employees',
      description: 'Fortune 500 companies'
    }
  ];

  const filtered = companySizes.filter(
    (size) =>
      size.label.toLowerCase().includes(query.toLowerCase()) ||
      size.description.toLowerCase().includes(query.toLowerCase())
  );

  return filtered;
}

// Technology Stack Search
export async function searchTechnologies(
  query: string
): Promise<SearchResult[]> {
  const technologies = [
    // CRM & Sales
    'Salesforce',
    'HubSpot',
    'Pipedrive',
    'Zoho CRM',
    'Monday.com',

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

    // Databases
    'MySQL',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Elasticsearch',
    'Oracle',
    'SQL Server',
    'Snowflake',
    'BigQuery',

    // Business Intelligence
    'Tableau',
    'Power BI',
    'Looker',
    'Qlik',
    'Sisense',
    'Metabase',

    // Communication
    'Slack',
    'Microsoft Teams',
    'Zoom',
    'Calendly',
    'Intercom',
    'Zendesk',
    'Freshdesk',
    'Help Scout'
  ];

  const filtered = technologies
    .filter((tech) => tech.toLowerCase().includes(query.toLowerCase()))
    .map((tech) => ({ value: tech, label: tech }));

  return filtered.slice(0, 10);
}
