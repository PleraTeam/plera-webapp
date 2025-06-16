'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  TrendingUp,
  Users,
  Wand2,
  Plus,
  Eye,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { FilterTag } from '@/components/targeting/filter-tag';
import { AddFilterButton } from '@/components/targeting/add-filter-button';
import { KeywordInput } from '@/components/targeting/keyword-input';
import { DynamicFilterSearch } from '@/components/targeting/dynamic-filter-search';
import {
  searchLocations,
  searchIndustries,
  searchJobTitles,
  searchSeniorities
} from '@/services/apollo-search';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TargetSegment,
  TargetingFilters,
  COMPANY_SIZES,
  REVENUE_RANGES,
  INDUSTRIES,
  JOB_TITLES,
  SENIORITY_LEVELS,
  LOCATIONS,
  DEPARTMENTS,
  FUNCTIONS,
  COMPANY_TYPES,
  FUNDING_STAGES,
  TECHNOLOGIES,
  TECH_CATEGORIES,
  convertToApolloFilters
} from '@/types/targeting';
import { generateTargetSegments } from '@/utils/segment-generator';
import {
  useTargetingSearch,
  validateTargetingFilters,
  estimateSearchSize
} from '@/hooks/use-targeting-search';

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

interface CampaignTargetingStepProps {
  businessAnalysis: BusinessAnalysis;
  campaignGoal: string;
  onComplete: (segments: TargetSegment[]) => void;
  onDataChange: (segments: TargetSegment[]) => void;
}

export function CampaignTargetingStep({
  businessAnalysis,
  campaignGoal,
  onComplete,
  onDataChange
}: CampaignTargetingStepProps) {
  const [segments, setSegments] = useState<TargetSegment[]>([]);
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null);
  const [editingSegment, setEditingSegment] = useState<TargetSegment | null>(
    null
  );
  const [prospectCount, setProspectCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  const {
    results,
    isLoading,
    error,
    previewSearch,
    clearResults,
    hasSearched
  } = useTargetingSearch();

  // Generate AI segments on component mount
  useEffect(() => {
    if (businessAnalysis && segments.length === 0) {
      const aiSegments = generateTargetSegments(businessAnalysis, campaignGoal);
      setSegments(aiSegments);
      onDataChange(aiSegments);
    }
  }, [businessAnalysis, campaignGoal, segments.length, onDataChange]);

  const handleAddCustomSegment = () => {
    const newSegment: TargetSegment = {
      id: `custom-${Date.now()}`,
      name: 'New Custom Segment',
      description: 'Custom target segment',
      filters: {
        industries: [],
        companySizes: [],
        revenueRanges: [],
        companyTypes: [],
        fundingStages: [],
        targetLocations: [],
        jobTitles: [],
        seniorities: [],
        departments: [],
        functions: [],
        technologies: [],
        techCategories: [],
        searchKeywords: [],
        companyTraits: [],
        excludeKeywords: [],
        recentFunding: false,
        hiring: false,
        newsActivity: false,
        jobChanges: false,
        verifiedEmail: true
      },
      isAIGenerated: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add new segment to the top of the list
    const updatedSegments = [newSegment, ...segments];
    setSegments(updatedSegments);
    setEditingSegmentId(newSegment.id);
    setEditingSegment({ ...newSegment });
    onDataChange(updatedSegments);
  };

  const handleEditSegment = (segment: TargetSegment) => {
    setEditingSegmentId(segment.id);
    setEditingSegment({ ...segment });
    setProspectCount(null); // Reset count when starting edit
  };

  const handleSaveSegment = () => {
    if (!editingSegment) return;

    const updatedSegments = segments.map((segment) =>
      segment.id === editingSegment.id
        ? { ...editingSegment, updatedAt: new Date() }
        : segment
    );
    setSegments(updatedSegments);
    setEditingSegmentId(null);
    setEditingSegment(null);
    onDataChange(updatedSegments);
  };

  const handleCancelEdit = () => {
    setEditingSegmentId(null);
    setEditingSegment(null);
    setProspectCount(null); // Reset count when canceling edit
  };

  const handleDeleteSegment = (segmentId: string) => {
    const updatedSegments = segments.filter((s) => s.id !== segmentId);
    setSegments(updatedSegments);
    if (editingSegmentId === segmentId) {
      setEditingSegmentId(null);
      setEditingSegment(null);
    }
    onDataChange(updatedSegments);
  };

  const handlePreviewSegment = async (segment: TargetSegment) => {
    const apolloFilters = convertToApolloFilters(segment.filters);
    await previewSearch(apolloFilters);
  };

  const updateEditingSegmentFilters = (updates: Partial<TargetingFilters>) => {
    if (!editingSegment) return;
    const updatedSegment = {
      ...editingSegment,
      filters: { ...editingSegment.filters, ...updates }
    };
    setEditingSegment(updatedSegment);
    // Prospect count will update automatically via useEffect debouncing
  };

  // Debounced function to get prospect count for current filters
  const updateProspectCount = useCallback(async (segment: TargetSegment) => {
    setIsLoadingCount(true);
    try {
      const apolloFilters = convertToApolloFilters(segment.filters);
      const response = await fetch('/api/campaigns/prospect-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filters: apolloFilters })
      });

      if (response.ok) {
        const data = await response.json();
        setProspectCount(data.count);
      } else {
        setProspectCount(null);
      }
    } catch (error) {
      console.error('Failed to fetch prospect count:', error);
      setProspectCount(null);
    } finally {
      setIsLoadingCount(false);
    }
  }, []);

  // Debounce the prospect count updates to avoid too many API calls
  useEffect(() => {
    if (!editingSegment) return;

    const timeoutId = setTimeout(() => {
      updateProspectCount(editingSegment);
    }, 1000); // Wait 1 second after user stops making changes

    return () => clearTimeout(timeoutId);
  }, [editingSegment, updateProspectCount]);

  // Filter Display Component
  const FilterDisplay = ({
    label,
    items,
    emptyText = 'None selected'
  }: {
    label: string;
    items: string[];
    emptyText?: string;
  }) => (
    <div className='space-y-2'>
      <span className='text-muted-foreground text-sm font-medium'>
        {label}:
      </span>
      <div className='flex flex-wrap gap-1'>
        {items.length > 0 ? (
          items.map((item, index) => (
            <Badge key={index} variant='outline' className='px-2 py-1 text-xs'>
              {item}
            </Badge>
          ))
        ) : (
          <span className='text-muted-foreground text-xs italic'>
            {emptyText}
          </span>
        )}
      </div>
    </div>
  );

  // Segment List View Component
  const SegmentListView = ({ segment }: { segment: TargetSegment }) => {
    const validation = validateTargetingFilters(
      convertToApolloFilters(segment.filters)
    );

    return (
      <Card className='border transition-shadow hover:shadow-sm'>
        <CardHeader className='pb-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <CardTitle className='text-lg font-medium'>
                {segment.name}
              </CardTitle>
              {segment.isAIGenerated && (
                <Badge variant='secondary' className='text-xs'>
                  <Wand2 className='mr-1 h-3 w-3' />
                  AI
                </Badge>
              )}
              {validation.isValid && (
                <Badge
                  variant='outline'
                  className='border-green-200 text-xs text-green-600 dark:border-green-800 dark:text-green-400'
                >
                  <CheckCircle className='mr-1 h-3 w-3' />
                  Valid
                </Badge>
              )}
            </div>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handlePreviewSegment(segment)}
                disabled={!validation.isValid || isLoading}
              >
                <Eye className='mr-1 h-4 w-4' />
                Preview
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleEditSegment(segment)}
              >
                <Edit className='mr-1 h-4 w-4' />
                Edit
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => handleDeleteSegment(segment.id)}
                className='text-red-600 hover:text-red-700'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </div>
          {segment.description && (
            <p className='text-muted-foreground mt-2 text-sm'>
              {segment.description}
            </p>
          )}
        </CardHeader>
        <CardContent className='pt-0'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {/* Company Profile */}
            <div className='space-y-3'>
              <h4 className='text-foreground flex items-center gap-2 text-sm font-semibold'>
                <Building2 className='h-4 w-4 text-orange-500' />
                Company Profile
              </h4>
              <div className='space-y-3'>
                <FilterDisplay
                  label='Industries'
                  items={segment.filters.industries}
                />
                <FilterDisplay
                  label='Company Sizes'
                  items={segment.filters.companySizes.map((size) => size.label)}
                />
                <FilterDisplay
                  label='Company Traits'
                  items={segment.filters.companyTraits}
                />
              </div>
            </div>

            {/* Business Metrics */}
            <div className='space-y-3'>
              <h4 className='text-foreground flex items-center gap-2 text-sm font-semibold'>
                <TrendingUp className='h-4 w-4 text-orange-500' />
                Business Metrics
              </h4>
              <div className='space-y-3'>
                <FilterDisplay
                  label='Revenue Range'
                  items={segment.filters.revenueRanges.map(
                    (range) => range.label
                  )}
                />
                <FilterDisplay
                  label='Company Types'
                  items={segment.filters.companyTypes}
                />
                <FilterDisplay
                  label='Funding Stages'
                  items={segment.filters.fundingStages}
                />
                <FilterDisplay
                  label='Target Locations'
                  items={segment.filters.targetLocations.map(
                    (location) => location.label
                  )}
                />
              </div>
            </div>

            {/* Target Roles & Keywords */}
            <div className='space-y-3'>
              <h4 className='text-foreground flex items-center gap-2 text-sm font-semibold'>
                <Users className='h-4 w-4 text-orange-500' />
                Target Roles & Keywords
              </h4>
              <div className='space-y-3'>
                <FilterDisplay
                  label='Job Titles'
                  items={segment.filters.jobTitles}
                />
                <FilterDisplay
                  label='Departments'
                  items={segment.filters.departments}
                />
                <FilterDisplay
                  label='Functions'
                  items={segment.filters.functions}
                />
                <FilterDisplay
                  label='Seniority Levels'
                  items={
                    segment.filters.seniorities?.map((s) =>
                      s.replace('_', ' ').toUpperCase()
                    ) || []
                  }
                />
                <FilterDisplay
                  label='Target Locations'
                  items={
                    segment.filters.targetLocations?.map((l) => l.label) || []
                  }
                />
                <FilterDisplay
                  label='Technologies'
                  items={segment.filters.technologies}
                />
                <FilterDisplay
                  label='Tech Categories'
                  items={segment.filters.techCategories}
                />
                <FilterDisplay
                  label='Search Keywords'
                  items={segment.filters.searchKeywords}
                />
                <div className='space-y-2'>
                  <span className='text-muted-foreground text-sm font-medium'>
                    Email Quality:
                  </span>
                  <div className='flex flex-wrap gap-1'>
                    <Badge
                      variant='outline'
                      className='border-green-200 bg-green-50 px-2 py-1 text-xs text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300'
                    >
                      ✓ Verified emails only (default)
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          {(!validation.isValid || validation.warnings.length > 0) && (
            <div className='mt-4 border-t pt-4'>
              {validation.errors.map((error, index) => (
                <Alert key={index} variant='destructive' className='mb-2'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ))}
              {validation.warnings.map((warning, index) => (
                <Alert key={index} className='mb-2'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>{warning}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Edit Field Component
  const EditField = ({
    label,
    children,
    description
  }: {
    label: string;
    children: React.ReactNode;
    description?: string;
  }) => (
    <div className='space-y-3'>
      <div>
        <label className='text-foreground text-sm font-semibold'>{label}</label>
        {description && (
          <p className='text-muted-foreground mt-1 text-xs'>{description}</p>
        )}
      </div>
      {children}
    </div>
  );

  // Segment Edit View Component
  const SegmentEditView = ({ segment }: { segment: TargetSegment }) => {
    if (!editingSegment) return null;

    return (
      <Card className='border-2 shadow-sm'>
        <CardHeader className='border-b'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-muted flex h-8 w-8 items-center justify-center rounded-full'>
                <Edit className='text-muted-foreground h-4 w-4' />
              </div>
              <div>
                <CardTitle className='text-foreground text-lg font-semibold'>
                  {editingSegment.isAIGenerated
                    ? 'Editing AI Segment'
                    : 'Creating Custom Segment'}
                </CardTitle>
                <p className='text-muted-foreground text-xs'>
                  Configure your targeting filters below
                </p>
              </div>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => handleDeleteSegment(segment.id)}
              className='text-red-600 hover:bg-red-50 hover:text-red-700'
            >
              <Trash2 className='mr-1 h-4 w-4' />
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-8 p-6'>
          {/* Basic Info Section */}
          <div className='bg-muted/50 space-y-4 rounded-lg p-4'>
            <h3 className='text-foreground flex items-center gap-2 text-sm font-semibold'>
              <div className='bg-muted flex h-5 w-5 items-center justify-center rounded'>
                <Edit className='text-muted-foreground h-3 w-3' />
              </div>
              Basic Information
            </h3>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <EditField
                label='Segment Name'
                description='Give your segment a descriptive name'
              >
                <Input
                  value={editingSegment.name}
                  onChange={(e) =>
                    setEditingSegment({
                      ...editingSegment,
                      name: e.target.value
                    })
                  }
                  placeholder='e.g., Healthcare CTOs'
                  className='border-border'
                />
              </EditField>
              <EditField
                label='Description'
                description='Briefly describe this target audience'
              >
                <Textarea
                  value={editingSegment.description || ''}
                  onChange={(e) =>
                    setEditingSegment({
                      ...editingSegment,
                      description: e.target.value
                    })
                  }
                  placeholder='e.g., Technology decision makers in healthcare organizations'
                  rows={3}
                  className='border-border resize-none'
                />
              </EditField>
            </div>
          </div>

          {/* Company Profile Section */}
          <div className='bg-muted/50 space-y-4 rounded-lg p-4'>
            <h3 className='text-foreground flex items-center gap-2 text-sm font-semibold'>
              <div className='bg-muted flex h-5 w-5 items-center justify-center rounded'>
                <Building2 className='text-muted-foreground h-3 w-3' />
              </div>
              Company Profile
            </h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <DynamicFilterSearch
                label='Industries'
                placeholder='Search industries (e.g., Technology, Healthcare, Finance...)'
                selectedValues={editingSegment.filters.industries}
                onValuesChange={(industries) =>
                  updateEditingSegmentFilters({ industries })
                }
                searchFunction={searchIndustries}
                description='Select relevant industries for targeting'
              />

              <EditField
                label='Company Sizes'
                description='Target company sizes by employee count'
              >
                <div className='border-border bg-background flex min-h-[38px] flex-wrap gap-2 rounded-md border p-2'>
                  {editingSegment.filters.companySizes.map((size) => (
                    <FilterTag
                      key={size.id}
                      label={size.label}
                      onRemove={() => {
                        updateEditingSegmentFilters({
                          companySizes:
                            editingSegment.filters.companySizes.filter(
                              (s) => s.id !== size.id
                            )
                        });
                      }}
                    />
                  ))}
                  <AddFilterButton
                    label='Add Size'
                    options={COMPANY_SIZES.map((size) => ({
                      value: size.id,
                      label: size.label
                    }))}
                    selectedValues={editingSegment.filters.companySizes.map(
                      (s) => s.id
                    )}
                    onSelect={(sizeId) => {
                      const size = COMPANY_SIZES.find((s) => s.id === sizeId);
                      if (size) {
                        updateEditingSegmentFilters({
                          companySizes: [
                            ...editingSegment.filters.companySizes,
                            size
                          ]
                        });
                      }
                    }}
                  />
                </div>
              </EditField>

              <EditField
                label='Company Traits'
                description='Add specific company characteristics'
              >
                <div className='min-h-[38px]'>
                  <KeywordInput
                    keywords={editingSegment.filters.companyTraits}
                    onAddKeyword={(trait) => {
                      updateEditingSegmentFilters({
                        companyTraits: [
                          ...editingSegment.filters.companyTraits,
                          trait
                        ]
                      });
                    }}
                    onRemoveKeyword={(trait) => {
                      updateEditingSegmentFilters({
                        companyTraits:
                          editingSegment.filters.companyTraits.filter(
                            (t) => t !== trait
                          )
                      });
                    }}
                    placeholder='e.g., ISO certified, public company...'
                  />
                </div>
              </EditField>
            </div>
          </div>

          {/* Business Metrics Section */}
          <div className='bg-muted/50 space-y-4 rounded-lg p-4'>
            <h3 className='text-foreground flex items-center gap-2 text-sm font-semibold'>
              <div className='bg-muted flex h-5 w-5 items-center justify-center rounded'>
                <TrendingUp className='text-muted-foreground h-3 w-3' />
              </div>
              Business Metrics
            </h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <EditField
                label='Revenue Range'
                description='Target companies by annual revenue'
              >
                <div className='border-border bg-background flex min-h-[38px] flex-wrap gap-2 rounded-md border p-2'>
                  {editingSegment.filters.revenueRanges.map((range) => (
                    <FilterTag
                      key={range.id}
                      label={range.label}
                      onRemove={() => {
                        updateEditingSegmentFilters({
                          revenueRanges:
                            editingSegment.filters.revenueRanges.filter(
                              (r) => r.id !== range.id
                            )
                        });
                      }}
                    />
                  ))}
                  <AddFilterButton
                    label='Add Revenue'
                    options={REVENUE_RANGES.map((range) => ({
                      value: range.id,
                      label: range.label
                    }))}
                    selectedValues={editingSegment.filters.revenueRanges.map(
                      (r) => r.id
                    )}
                    onSelect={(rangeId) => {
                      const range = REVENUE_RANGES.find(
                        (r) => r.id === rangeId
                      );
                      if (range) {
                        updateEditingSegmentFilters({
                          revenueRanges: [
                            ...editingSegment.filters.revenueRanges,
                            range
                          ]
                        });
                      }
                    }}
                  />
                </div>
              </EditField>

              <EditField
                label='Company Types'
                description='Target specific company types'
              >
                <div className='border-border bg-background flex min-h-[38px] flex-wrap gap-2 rounded-md border p-2'>
                  {editingSegment.filters.companyTypes.map((type, index) => (
                    <FilterTag
                      key={index}
                      label={type}
                      onRemove={() => {
                        updateEditingSegmentFilters({
                          companyTypes:
                            editingSegment.filters.companyTypes.filter(
                              (t) => t !== type
                            )
                        });
                      }}
                    />
                  ))}
                  <AddFilterButton
                    label='Add Type'
                    options={COMPANY_TYPES.map((type) => ({
                      value: type,
                      label: type
                    }))}
                    selectedValues={editingSegment.filters.companyTypes}
                    onSelect={(type) => {
                      if (!editingSegment.filters.companyTypes.includes(type)) {
                        updateEditingSegmentFilters({
                          companyTypes: [
                            ...editingSegment.filters.companyTypes,
                            type
                          ]
                        });
                      }
                    }}
                  />
                </div>
              </EditField>
            </div>
          </div>

          {/* Target Roles & Keywords Section */}
          <div className='bg-muted/50 space-y-4 rounded-lg p-4'>
            <h3 className='text-foreground flex items-center gap-2 text-sm font-semibold'>
              <div className='bg-muted flex h-5 w-5 items-center justify-center rounded'>
                <Users className='text-muted-foreground h-3 w-3' />
              </div>
              Target Roles & Keywords
            </h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <DynamicFilterSearch
                label='Job Titles'
                placeholder='Search job titles (e.g., CEO, CTO, VP Sales, Director...)'
                selectedValues={editingSegment.filters.jobTitles}
                onValuesChange={(jobTitles) =>
                  updateEditingSegmentFilters({ jobTitles })
                }
                searchFunction={searchJobTitles}
                description='Target specific job titles and roles'
              />

              <DynamicFilterSearch
                label='Departments'
                placeholder='Search departments (e.g., Sales, Marketing, Engineering...)'
                selectedValues={editingSegment.filters.departments}
                onValuesChange={(departments) =>
                  updateEditingSegmentFilters({ departments })
                }
                searchFunction={async (query: string) => {
                  const filtered = DEPARTMENTS.filter((dept) =>
                    dept.toLowerCase().includes(query.toLowerCase())
                  ).map((dept) => ({ value: dept, label: dept }));
                  return filtered.slice(0, 10);
                }}
                description='Target by department or team'
              />

              <DynamicFilterSearch
                label='Seniority Levels'
                placeholder='Search seniority levels (e.g., C-Suite, Director, Manager...)'
                selectedValues={editingSegment.filters.seniorities}
                onValuesChange={(seniorities) =>
                  updateEditingSegmentFilters({ seniorities })
                }
                searchFunction={async (query: string) => {
                  const results = await searchSeniorities(query);
                  return results.map((r) => ({
                    value: r.value,
                    label: r.label
                  }));
                }}
                description='Target by career level and hierarchy'
              />

              <div className='md:col-span-2'>
                <DynamicFilterSearch
                  label='Target Locations'
                  placeholder='Search locations (e.g., United States, California, San Francisco...)'
                  selectedValues={
                    editingSegment.filters.targetLocations?.map(
                      (l) => l.label
                    ) || []
                  }
                  onValuesChange={(locationLabels) => {
                    const targetLocations = locationLabels.map((label) => {
                      // Parse location to extract country, state, city
                      const parts = label.split(', ');
                      let country = '';
                      let state = undefined;
                      let city = undefined;

                      if (parts.length === 1) {
                        // Just country: "United States"
                        country = parts[0];
                      } else if (parts.length === 2) {
                        // State and country: "California, US" or City and country: "London, UK"
                        if (
                          parts[1] === 'US' ||
                          parts[1] === 'USA' ||
                          parts[1] === 'United States'
                        ) {
                          state = parts[0];
                          country = 'United States';
                        } else {
                          city = parts[0];
                          country = parts[1];
                        }
                      } else if (parts.length === 3) {
                        // City, state, country: "San Francisco, CA, US"
                        city = parts[0];
                        state = parts[1];
                        country =
                          parts[2] === 'US' ? 'United States' : parts[2];
                      }

                      return {
                        id: label.toLowerCase().replace(/[^a-z0-9]/g, '_'),
                        label,
                        country: country || 'Unknown',
                        state,
                        city,
                        apolloValue: label
                      };
                    });
                    updateEditingSegmentFilters({ targetLocations });
                  }}
                  searchFunction={searchLocations}
                  description='Geographic regions to target (countries, states, cities)'
                />
              </div>

              <div className='md:col-span-2'>
                <EditField
                  label='Search Keywords'
                  description='Relevant terms to help identify the right prospects'
                >
                  <div className='min-h-[38px]'>
                    <KeywordInput
                      keywords={editingSegment.filters.searchKeywords}
                      onAddKeyword={(keyword) => {
                        updateEditingSegmentFilters({
                          searchKeywords: [
                            ...editingSegment.filters.searchKeywords,
                            keyword
                          ]
                        });
                      }}
                      onRemoveKeyword={(keyword) => {
                        updateEditingSegmentFilters({
                          searchKeywords:
                            editingSegment.filters.searchKeywords.filter(
                              (k) => k !== keyword
                            )
                        });
                      }}
                      placeholder='e.g., API integration, data analytics, automation...'
                    />
                  </div>
                </EditField>
              </div>
            </div>
          </div>

          {/* Technology & Advanced Targeting */}
          <div className='bg-muted/50 space-y-4 rounded-lg p-4'>
            <h3 className='text-foreground flex items-center gap-2 text-sm font-semibold'>
              <div className='bg-muted flex h-5 w-5 items-center justify-center rounded'>
                <Building2 className='text-muted-foreground h-3 w-3' />
              </div>
              Technology & Advanced Targeting
            </h3>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <DynamicFilterSearch
                label='Technologies'
                placeholder='Search technologies (e.g., Salesforce, AWS, React...)'
                selectedValues={editingSegment.filters.technologies}
                onValuesChange={(technologies) =>
                  updateEditingSegmentFilters({ technologies })
                }
                searchFunction={async (query: string) => {
                  const filtered = TECHNOLOGIES.filter((tech) =>
                    tech.toLowerCase().includes(query.toLowerCase())
                  ).map((tech) => ({ value: tech, label: tech }));
                  return filtered.slice(0, 10);
                }}
                description='Target by technology stack and tools'
              />

              <DynamicFilterSearch
                label='Tech Categories'
                placeholder='Search tech categories (e.g., SaaS, AI, Fintech...)'
                selectedValues={editingSegment.filters.techCategories}
                onValuesChange={(techCategories) =>
                  updateEditingSegmentFilters({ techCategories })
                }
                searchFunction={async (query: string) => {
                  const filtered = TECH_CATEGORIES.filter((cat) =>
                    cat.toLowerCase().includes(query.toLowerCase())
                  ).map((cat) => ({ value: cat, label: cat }));
                  return filtered.slice(0, 10);
                }}
                description='Target by technology category'
              />

              <EditField
                label='Functions'
                description='Target by business function'
              >
                <div className='border-border bg-background flex min-h-[38px] flex-wrap gap-2 rounded-md border p-2'>
                  {editingSegment.filters.functions.map((func, index) => (
                    <FilterTag
                      key={index}
                      label={func}
                      onRemove={() => {
                        updateEditingSegmentFilters({
                          functions: editingSegment.filters.functions.filter(
                            (f) => f !== func
                          )
                        });
                      }}
                    />
                  ))}
                  <AddFilterButton
                    label='Add Function'
                    options={FUNCTIONS.map((func) => ({
                      value: func,
                      label: func
                    }))}
                    selectedValues={editingSegment.filters.functions}
                    onSelect={(func) => {
                      if (!editingSegment.filters.functions.includes(func)) {
                        updateEditingSegmentFilters({
                          functions: [...editingSegment.filters.functions, func]
                        });
                      }
                    }}
                  />
                </div>
              </EditField>

              <EditField
                label='Funding Stages'
                description='Target by funding stage'
              >
                <div className='border-border bg-background flex min-h-[38px] flex-wrap gap-2 rounded-md border p-2'>
                  {editingSegment.filters.fundingStages.map((stage, index) => (
                    <FilterTag
                      key={index}
                      label={stage}
                      onRemove={() => {
                        updateEditingSegmentFilters({
                          fundingStages:
                            editingSegment.filters.fundingStages.filter(
                              (s) => s !== stage
                            )
                        });
                      }}
                    />
                  ))}
                  <AddFilterButton
                    label='Add Stage'
                    options={FUNDING_STAGES.map((stage) => ({
                      value: stage,
                      label: stage
                    }))}
                    selectedValues={editingSegment.filters.fundingStages}
                    onSelect={(stage) => {
                      if (
                        !editingSegment.filters.fundingStages.includes(stage)
                      ) {
                        updateEditingSegmentFilters({
                          fundingStages: [
                            ...editingSegment.filters.fundingStages,
                            stage
                          ]
                        });
                      }
                    }}
                  />
                </div>
              </EditField>
            </div>
          </div>

          {/* Prospect Count Preview */}
          <div className='bg-muted/30 border-muted-foreground/25 rounded-lg border-2 border-dashed p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Users className='h-5 w-5 text-orange-500' />
                <span className='text-foreground text-sm font-semibold'>
                  Available Prospects
                </span>
              </div>
              <div className='flex items-center gap-2'>
                {isLoadingCount ? (
                  <div className='text-muted-foreground flex items-center gap-2'>
                    <div className='border-muted-foreground/30 border-t-muted-foreground h-4 w-4 animate-spin rounded-full border-2' />
                    <span className='text-sm'>Counting...</span>
                  </div>
                ) : prospectCount !== null ? (
                  <div className='flex items-center gap-2'>
                    <span className='text-2xl font-bold text-green-600 dark:text-green-400'>
                      {prospectCount.toLocaleString()}
                    </span>
                    <span className='text-muted-foreground text-sm'>
                      prospects found
                    </span>
                  </div>
                ) : (
                  <span className='text-muted-foreground text-sm'>
                    Add filters to see count
                  </span>
                )}
              </div>
            </div>
            {prospectCount !== null && prospectCount === 0 && (
              <div className='mt-2 text-sm text-amber-600 dark:text-amber-400'>
                No prospects found with current filters. Try broadening your
                criteria.
              </div>
            )}
            {prospectCount !== null && prospectCount > 0 && (
              <div className='text-muted-foreground mt-2 text-xs'>
                This count updates in real-time as you modify your targeting
                criteria
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className='flex justify-end gap-3 border-t pt-4'>
            <Button variant='outline' onClick={handleCancelEdit}>
              <X className='mr-1 h-4 w-4' />
              Cancel
            </Button>
            <Button
              onClick={handleSaveSegment}
              className='bg-orange-500 hover:bg-orange-600'
              disabled={prospectCount === 0}
            >
              <Save className='mr-1 h-4 w-4' />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h2 className='text-foreground text-2xl font-semibold'>
            Target Segments
          </h2>
          <p className='text-muted-foreground mt-1'>
            Define and refine your target segments to ensure precise audience
            targeting
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Badge variant='secondary' className='text-xs'>
            <Wand2 className='mr-1 h-3 w-3' />
            AI Generated
          </Badge>
          <Button
            onClick={handleAddCustomSegment}
            className='bg-orange-500 hover:bg-orange-600'
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Segment
          </Button>
        </div>
      </div>

      {/* Segments List/Edit */}
      <div className='space-y-4'>
        {segments.map((segment) => (
          <div key={segment.id}>
            {editingSegmentId === segment.id ? (
              <SegmentEditView segment={segment} />
            ) : (
              <SegmentListView segment={segment} />
            )}
          </div>
        ))}
      </div>

      {/* Preview Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Preview Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='text-sm'>
                <p className='font-medium'>
                  Found {results.pagination.totalEntries.toLocaleString()}{' '}
                  people
                </p>
                <p className='text-muted-foreground'>
                  Showing first {results.people.length} results
                </p>
              </div>

              <div className='max-h-64 space-y-2 overflow-y-auto'>
                {results.people.slice(0, 10).map((person) => (
                  <div
                    key={person.id}
                    className='bg-muted flex items-center gap-3 rounded p-3'
                  >
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>
                        {person.name}
                      </p>
                      <p className='text-muted-foreground truncate text-xs'>
                        {person.title} at {person.company.name}
                      </p>
                    </div>
                    <Badge variant='outline' className='text-xs'>
                      {person.emailStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className='flex justify-between border-t pt-6'>
        <Button variant='outline'>← Back</Button>
        <Button
          onClick={() => onComplete(segments)}
          disabled={segments.length === 0 || editingSegmentId !== null}
          className='bg-orange-500 hover:bg-orange-600'
        >
          Find Leads →
        </Button>
      </div>
    </div>
  );
}
