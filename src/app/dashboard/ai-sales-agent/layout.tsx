'use client';

import {
  Layers,
  Inbox,
  Users,
  X,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Star,
  MoreHorizontal,
  BarChart3,
  Target,
  Activity,
  MessageSquare,
  Mail,
  TrendingUp,
  Building2,
  UserSearch,
  FileText,
  FileText as Drafts,
  Send,
  Trash,
  Archive,
  User,
  UserCheck,
  UserX,
  Workflow
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Segment Card Component
interface SegmentCardProps {
  segment: any;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (newFilters: any) => void;
  getProspectCount: (filters: any) => Promise<number>;
}

function SegmentCard({
  segment,
  index,
  isSelected,
  onSelect,
  onUpdate,
  getProspectCount
}: SegmentCardProps) {
  const [prospectCount, setProspectCount] = useState<number | null>(null);
  const [isLoadingCount, setIsLoadingCount] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load prospect count when component mounts or filters change
  useEffect(() => {
    const loadCount = async () => {
      setIsLoadingCount(true);
      try {
        const count = await getProspectCount(segment.filters);
        setProspectCount(count);
      } catch (error) {
        console.error('Failed to load prospect count:', error);
        setProspectCount(0);
      } finally {
        setIsLoadingCount(false);
      }
    };

    loadCount();
  }, [segment.filters, getProspectCount]);

  return (
    <div
      className={`cursor-pointer rounded-lg border p-4 transition-colors ${
        isSelected
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-white/20 bg-white/5 hover:border-white/30'
      }`}
      onClick={onSelect}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <h4 className='mb-2 font-medium text-white'>{segment.name}</h4>
          {segment.description && (
            <p className='mb-3 text-sm text-white/70'>{segment.description}</p>
          )}

          {/* Prospect Count */}
          <div className='mb-3 flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-xs text-white/50'>
                Estimated Prospects:
              </span>
              {isLoadingCount ? (
                <div className='h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white'></div>
              ) : (
                <span className='text-sm font-medium text-green-400'>
                  {prospectCount?.toLocaleString() || '0'}
                </span>
              )}
            </div>
            {segment.isAIGenerated && (
              <span className='rounded bg-purple-500/20 px-2 py-1 text-xs text-purple-300'>
                AI Generated
              </span>
            )}
          </div>

          {/* Quick Filter Preview */}
          <div className='mb-3 flex flex-wrap gap-2'>
            {segment.filters.industries
              ?.slice(0, 3)
              .map((industry: string, idx: number) => (
                <span
                  key={idx}
                  className='rounded bg-white/10 px-2 py-1 text-xs text-white/80'
                >
                  {industry}
                </span>
              ))}
            {segment.filters.jobTitles
              ?.slice(0, 2)
              .map((title: string, idx: number) => (
                <span
                  key={idx}
                  className='rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-300'
                >
                  {title}
                </span>
              ))}
            {(segment.filters.industries?.length > 3 ||
              segment.filters.jobTitles?.length > 2) && (
              <span className='text-xs text-white/50'>
                +
                {(segment.filters.industries?.length || 0) +
                  (segment.filters.jobTitles?.length || 0) -
                  5}{' '}
                more
              </span>
            )}
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className='rounded p-1 hover:bg-white/10'
          >
            <ChevronDown
              className={`h-4 w-4 text-white/60 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expanded Filters View */}
      {isExpanded && (
        <div className='mt-4 space-y-3 border-t border-white/10 pt-4'>
          <div className='grid grid-cols-2 gap-4 text-xs'>
            <div>
              <span className='mb-1 block text-white/50'>Industries</span>
              <div className='space-y-1'>
                {segment.filters.industries?.map(
                  (industry: string, idx: number) => (
                    <div key={idx} className='text-white/80'>
                      {industry}
                    </div>
                  )
                )}
              </div>
            </div>
            <div>
              <span className='mb-1 block text-white/50'>Job Titles</span>
              <div className='space-y-1'>
                {segment.filters.jobTitles?.map(
                  (title: string, idx: number) => (
                    <div key={idx} className='text-white/80'>
                      {title}
                    </div>
                  )
                )}
              </div>
            </div>
            <div>
              <span className='mb-1 block text-white/50'>Company Sizes</span>
              <div className='space-y-1'>
                {segment.filters.companySizes?.map((size: any, idx: number) => (
                  <div key={idx} className='text-white/80'>
                    {size.label}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <span className='mb-1 block text-white/50'>Seniorities</span>
              <div className='space-y-1'>
                {segment.filters.seniorities?.map(
                  (seniority: string, idx: number) => (
                    <div key={idx} className='text-white/80 capitalize'>
                      {seniority.replace('_', ' ')}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

type Level1Type = 'overview' | 'collections' | 'inbox' | 'people';

interface TabItem {
  id: string;
  title: string;
  type:
    | 'campaign'
    | 'environment'
    | 'flow'
    | 'activity'
    | 'collection'
    | 'campaign-builder';
  content: any;
}

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'paused';
  prospects: number;
  responseRate: string;
}

interface Collection {
  id: string;
  name: string;
  expanded: boolean;
  campaigns: Campaign[];
}

export default function AISalesAgentLayout() {
  const [activeLevel1, setActiveLevel1] = useState<Level1Type>('collections');
  const [lastNonOverviewLevel1, setLastNonOverviewLevel1] =
    useState<Level1Type>('collections');
  const [openTabs, setOpenTabs] = useState<TabItem[]>([
    {
      id: 'cold-outreach-q4',
      title: 'Cold Outreach Q4',
      type: 'campaign',
      content: { status: 'active', prospects: 124, responseRate: '12%' }
    }
  ]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<string>('cold-outreach-q4');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );
  const [newDialogOpen, setNewDialogOpen] = useState<boolean>(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>('campaign');
  const [workspaceDescription, setWorkspaceDescription] = useState<string>(
    'Add information that you want quick access to. It can include links to important resources or notes of what you want to remember.'
  );
  const [pinnedCollections, setPinnedCollections] = useState<Set<string>>(
    new Set()
  );
  const [editingCollection, setEditingCollection] = useState<string | null>(
    null
  );
  const [editingName, setEditingName] = useState<string>('');
  const [deletingCollection, setDeletingCollection] = useState<string | null>(
    null
  );
  const [editingCampaign, setEditingCampaign] = useState<string | null>(null);
  const [editingCampaignName, setEditingCampaignName] = useState<string>('');
  const [deletingCampaign, setDeletingCampaign] = useState<{
    campaignId: string;
    collectionId: string;
    campaignName: string;
  } | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: 'collection-1',
      name: 'New Collection',
      expanded: true,
      campaigns: [
        {
          id: 'cold-outreach-q4',
          name: 'Cold Outreach Q4',
          status: 'active',
          prospects: 124,
          responseRate: '12%'
        },
        {
          id: 'product-demo-followup',
          name: 'Product Demo Follow-up',
          status: 'draft',
          prospects: 89,
          responseRate: '18%'
        },
        {
          id: 'warm-leads-nurturing',
          name: 'Warm Leads Nurturing',
          status: 'paused',
          prospects: 256,
          responseRate: '24%'
        }
      ]
    }
  ]);

  // Handle escape key for editing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingCollection) {
          cancelEditingCollection();
        } else if (editingCampaign) {
          cancelEditingCampaign();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editingCollection, editingCampaign]);

  // Level 1 Navigation Items
  const level1Items = [
    { id: 'collections' as Level1Type, icon: Layers, label: 'Collections' },
    { id: 'inbox' as Level1Type, icon: Inbox, label: 'Inbox' },
    { id: 'people' as Level1Type, icon: Users, label: 'People' },
    { id: 'overview' as Level1Type, icon: FileText, label: 'Overview' }
  ];

  // Collection management functions
  const createNewCollection = () => {
    const newCollection: Collection = {
      id: `collection-${collections.length + 1}`,
      name: `Collection ${collections.length + 1}`,
      expanded: true,
      campaigns: []
    };
    setCollections([...collections, newCollection]);
  };

  const toggleCollection = (collectionId: string) => {
    setCollections(
      collections.map((collection) =>
        collection.id === collectionId
          ? { ...collection, expanded: !collection.expanded }
          : collection
      )
    );
  };

  // Pin/Unpin collection functionality
  const togglePinCollection = (collectionId: string) => {
    const newPinnedCollections = new Set(pinnedCollections);
    if (newPinnedCollections.has(collectionId)) {
      newPinnedCollections.delete(collectionId);
    } else {
      newPinnedCollections.add(collectionId);
    }
    setPinnedCollections(newPinnedCollections);
  };

  // Start editing collection name
  const startEditingCollection = (
    collectionId: string,
    currentName: string
  ) => {
    setEditingCollection(collectionId);
    setEditingName(currentName);
    // Close dropdown
    setOpenDropdowns(new Set());
  };

  // Cancel editing collection name
  const cancelEditingCollection = () => {
    setEditingCollection(null);
    setEditingName('');
  };

  // Save collection name
  const saveCollectionName = (collectionId: string) => {
    const trimmedName = editingName.trim();

    // Only update if there's a valid name (not empty after trimming)
    if (trimmedName) {
      setCollections(
        collections.map((collection) =>
          collection.id === collectionId
            ? { ...collection, name: trimmedName }
            : collection
        )
      );
    }
    // If name is empty after trimming, we keep the original name (no update needed)
    // Always close the editing mode for good UX
    setEditingCollection(null);
    setEditingName('');
  };

  // Delete collection function
  const deleteCollection = (collectionId: string) => {
    // Remove from collections
    setCollections(
      collections.filter((collection) => collection.id !== collectionId)
    );

    // Remove from pinned collections
    const newPinnedCollections = new Set(pinnedCollections);
    newPinnedCollections.delete(collectionId);
    setPinnedCollections(newPinnedCollections);

    // Close any related tabs
    const tabsToClose: number[] = [];
    openTabs.forEach((tab, index) => {
      if (tab.id === collectionId || tab.id.startsWith(`${collectionId}-`)) {
        tabsToClose.push(index);
      }
    });

    // Close tabs from highest index to lowest to avoid index shifting
    tabsToClose.reverse().forEach((index) => {
      closeTab(index);
    });

    // Clear selection if this collection was selected
    if (selectedCollection === collectionId) {
      setSelectedCollection(null);
    }

    // Clear item selection if it was from this collection
    if (selectedItem && selectedItem.startsWith(`${collectionId}-`)) {
      setSelectedItem('');
    }

    // Close the dialog
    setDeletingCollection(null);
  };

  // Handle delete collection confirmation
  const handleDeleteCollection = (collectionId: string) => {
    setDeletingCollection(collectionId);
  };

  // Get collection name for deletion dialog
  const getDeletingCollectionName = () => {
    if (!deletingCollection) return '';
    const collection = collections.find((c) => c.id === deletingCollection);
    return collection?.name || '';
  };

  // Campaign management functions
  const startEditingCampaign = (
    campaignId: string,
    collectionId: string,
    currentName: string
  ) => {
    setEditingCampaign(campaignId);
    setEditingCampaignName(currentName);
    closeAllDropdowns();
  };

  const cancelEditingCampaign = () => {
    setEditingCampaign(null);
    setEditingCampaignName('');
  };

  const saveCampaignName = (campaignId: string, collectionId: string) => {
    const trimmedName = editingCampaignName.trim();

    if (trimmedName) {
      setCollections(
        collections.map((collection) =>
          collection.id === collectionId
            ? {
                ...collection,
                campaigns: collection.campaigns.map((campaign) =>
                  campaign.id === campaignId
                    ? { ...campaign, name: trimmedName }
                    : campaign
                )
              }
            : collection
        )
      );

      // Update tab title if this campaign has an open tab
      const updatedTabs = openTabs.map((tab) =>
        tab.id === campaignId ? { ...tab, title: trimmedName } : tab
      );
      setOpenTabs(updatedTabs);
    }

    setEditingCampaign(null);
    setEditingCampaignName('');
  };

  const handleDeleteCampaign = (
    campaignId: string,
    collectionId: string,
    campaignName: string
  ) => {
    setDeletingCampaign({ campaignId, collectionId, campaignName });
  };

  const deleteCampaign = () => {
    if (!deletingCampaign) return;

    const { campaignId, collectionId } = deletingCampaign;

    // Remove campaign from collection
    setCollections(
      collections.map((collection) =>
        collection.id === collectionId
          ? {
              ...collection,
              campaigns: collection.campaigns.filter(
                (campaign) => campaign.id !== campaignId
              )
            }
          : collection
      )
    );

    // Close any related tabs
    const tabsToClose: number[] = [];
    openTabs.forEach((tab, index) => {
      if (tab.id === campaignId) {
        tabsToClose.push(index);
      }
    });

    // Close tabs from highest index to lowest to avoid index shifting
    tabsToClose.reverse().forEach((index) => {
      closeTab(index);
    });

    // Clear selection if this campaign was selected
    if (selectedItem === campaignId) {
      setSelectedItem('');
    }

    setDeletingCampaign(null);
  };

  // Dropdown helpers
  const isDropdownOpen = (dropdownId: string) => openDropdowns.has(dropdownId);
  const toggleDropdown = (dropdownId: string) => {
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(dropdownId)) {
      newOpenDropdowns.delete(dropdownId);
    } else {
      newOpenDropdowns.clear(); // Close all other dropdowns
      newOpenDropdowns.add(dropdownId);
    }
    setOpenDropdowns(newOpenDropdowns);
  };
  const closeAllDropdowns = () => setOpenDropdowns(new Set());

  // Campaign goal update function
  const updateCampaignGoal = (goal: string) => {
    const updatedTabs = openTabs.map((tab, tabIndex) =>
      tabIndex === activeTab && tab.type === 'campaign-builder'
        ? {
            ...tab,
            content: {
              ...tab.content,
              campaignData: {
                ...tab.content.campaignData,
                basics: {
                  ...tab.content.campaignData.basics,
                  campaignGoal: goal
                }
              }
            }
          }
        : tab
    );
    setOpenTabs(updatedTabs);
  };

  // Update company website URL
  const updateCompanyWebsite = (website: string) => {
    const updatedTabs = openTabs.map((tab, tabIndex) =>
      tabIndex === activeTab && tab.type === 'campaign-builder'
        ? {
            ...tab,
            content: {
              ...tab.content,
              campaignData: {
                ...tab.content.campaignData,
                basics: {
                  ...tab.content.campaignData.basics,
                  companyWebsite: website
                }
              }
            }
          }
        : tab
    );
    setOpenTabs(updatedTabs);
  };

  // Update input method type
  const updateInputMethod = (inputType: 'website' | 'upload' | 'paste') => {
    const updatedTabs = openTabs.map((tab, tabIndex) =>
      tabIndex === activeTab && tab.type === 'campaign-builder'
        ? {
            ...tab,
            content: {
              ...tab.content,
              campaignData: {
                ...tab.content.campaignData,
                basics: {
                  ...tab.content.campaignData.basics,
                  alternativeInput: {
                    type: inputType,
                    content: null
                  }
                }
              }
            }
          }
        : tab
    );
    setOpenTabs(updatedTabs);
  };

  // Update alternative input content
  const updateAlternativeInputContent = (content: string) => {
    const updatedTabs = openTabs.map((tab, tabIndex) =>
      tabIndex === activeTab && tab.type === 'campaign-builder'
        ? {
            ...tab,
            content: {
              ...tab.content,
              campaignData: {
                ...tab.content.campaignData,
                basics: {
                  ...tab.content.campaignData.basics,
                  alternativeInput: {
                    ...tab.content.campaignData.basics.alternativeInput,
                    content: content
                  }
                }
              }
            }
          }
        : tab
    );
    setOpenTabs(updatedTabs);
  };

  // State for business analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // State for target segment generation
  const [isGeneratingSegments, setIsGeneratingSegments] = useState(false);
  const [segmentError, setSegmentError] = useState<string | null>(null);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);

  // State for messaging generation
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);

  // Function to start business analysis
  const startBusinessAnalysis = async () => {
    const currentCampaignTab = openTabs[activeTab];
    if (!currentCampaignTab || currentCampaignTab.type !== 'campaign-builder') {
      return;
    }

    const campaignData = currentCampaignTab.content.campaignData;
    const { campaignGoal, companyWebsite, alternativeInput } =
      campaignData.basics;

    // Validation
    if (!campaignGoal) {
      setAnalysisError('Please select a campaign goal first.');
      return;
    }

    // Check if we have content to analyze
    const hasWebsite = companyWebsite && companyWebsite.trim();
    const hasAlternativeContent =
      alternativeInput?.content && alternativeInput.content.trim();

    if (!hasWebsite && !hasAlternativeContent) {
      setAnalysisError(
        'Please provide either a website URL or business information to analyze.'
      );
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Map our campaign goal to API format
      const goalMapping: Record<string, string> = {
        'demo-calls': 'Demo Calls',
        'sales-calls': 'Sales Calls',
        partnerships: 'Partnerships',
        'investor-calls': 'Investor Calls',
        'potential-hires': 'Potential Hires'
      };

      const requestBody: any = {
        campaign_goal: goalMapping[campaignGoal] || 'Sales Calls'
      };

      // Add website URL if provided
      if (hasWebsite) {
        requestBody.website_url = companyWebsite;
      }

      // Add additional content if provided
      if (hasAlternativeContent) {
        requestBody.additional_content = alternativeInput.content;
      }

      const response = await fetch('/api/campaigns/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
      }

      // Update campaign data with analysis results
      const updatedTabs = openTabs.map((tab, tabIndex) =>
        tabIndex === activeTab && tab.type === 'campaign-builder'
          ? {
              ...tab,
              content: {
                ...tab.content,
                campaignData: {
                  ...tab.content.campaignData,
                  basics: {
                    ...tab.content.campaignData.basics,
                    analysis: data.data.analysis
                  }
                }
              }
            }
          : tab
      );
      setOpenTabs(updatedTabs);
    } catch (error) {
      console.error('❌ Analysis error:', error);
      setAnalysisError(
        error instanceof Error ? error.message : 'Analysis failed'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Function to generate target segments
  const generateTargetSegments = async () => {
    const currentCampaignTab = openTabs[activeTab];
    if (!currentCampaignTab || currentCampaignTab.type !== 'campaign-builder') {
      return;
    }

    const analysis = currentCampaignTab.content.campaignData?.basics?.analysis;
    const campaignGoal =
      currentCampaignTab.content.campaignData?.basics?.campaignGoal;

    if (!analysis || !campaignGoal) {
      setSegmentError(
        'Business analysis is required before generating target segments.'
      );
      return;
    }

    setIsGeneratingSegments(true);
    setSegmentError(null);

    try {
      // Import the segment generator locally since we can't import it at the top
      const { generateTargetSegments: generateSegments } = await import(
        '@/utils/segment-generator'
      );

      // Generate segments from business analysis
      const segments = generateSegments(analysis, campaignGoal);

      // Update campaign data with generated segments
      const updatedTabs = openTabs.map((tab, tabIndex) =>
        tabIndex === activeTab && tab.type === 'campaign-builder'
          ? {
              ...tab,
              content: {
                ...tab.content,
                campaignData: {
                  ...tab.content.campaignData,
                  targeting: {
                    segments: segments,
                    selectedSegmentIndex: 0
                  }
                }
              }
            }
          : tab
      );
      setOpenTabs(updatedTabs);
      setSelectedSegmentIndex(0);
    } catch (error) {
      console.error('❌ Segment generation error:', error);
      setSegmentError(
        error instanceof Error
          ? error.message
          : 'Failed to generate target segments'
      );
    } finally {
      setIsGeneratingSegments(false);
    }
  };

  // Function to get prospect count for a segment
  const getProspectCount = async (segmentFilters: any) => {
    try {
      // Convert targeting filters to Apollo format for prospect count
      const { convertToApolloFilters } = await import('@/types/targeting');
      const apolloFilters = convertToApolloFilters(segmentFilters);

      const response = await fetch('/api/campaigns/prospect-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filters: apolloFilters
        })
      });

      if (!response.ok) {
        console.error('Prospect count API error:', response.status);
        return 0;
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Error getting prospect count:', error);
      return 0;
    }
  };

  // Function to update segment filters
  const updateSegmentFilters = (segmentIndex: number, newFilters: any) => {
    const updatedTabs = openTabs.map((tab, tabIndex) =>
      tabIndex === activeTab && tab.type === 'campaign-builder'
        ? {
            ...tab,
            content: {
              ...tab.content,
              campaignData: {
                ...tab.content.campaignData,
                targeting: {
                  ...tab.content.campaignData.targeting,
                  segments: tab.content.campaignData.targeting.segments.map(
                    (segment: any, index: number) =>
                      index === segmentIndex
                        ? { ...segment, filters: newFilters }
                        : segment
                  )
                }
              }
            }
          }
        : tab
    );
    setOpenTabs(updatedTabs);
  };

  // Function to update message settings
  const updateMessageSettings = (newSettings: any) => {
    const updatedTabs = openTabs.map((tab, tabIndex) =>
      tabIndex === activeTab && tab.type === 'campaign-builder'
        ? {
            ...tab,
            content: {
              ...tab.content,
              campaignData: {
                ...tab.content.campaignData,
                messaging: {
                  ...tab.content.campaignData.messaging,
                  settings: {
                    ...tab.content.campaignData.messaging.settings,
                    ...newSettings
                  }
                }
              }
            }
          }
        : tab
    );
    setOpenTabs(updatedTabs);
  };

  // Function to generate messages
  const generateMessages = async () => {
    const currentCampaignTab = openTabs[activeTab];
    if (!currentCampaignTab || currentCampaignTab.type !== 'campaign-builder') {
      return;
    }

    const campaignData = currentCampaignTab.content.campaignData;
    const analysis = campaignData?.basics?.analysis;
    const segments = campaignData?.targeting?.segments;
    const selectedSegment = segments?.[selectedSegmentIndex];
    const messageSettings = campaignData?.messaging?.settings;

    if (!analysis || !selectedSegment || !messageSettings) {
      setMessageError('Complete previous steps before generating messages.');
      return;
    }

    setIsGeneratingMessages(true);
    setMessageError(null);

    try {
      // Mock prospect data for message generation
      const mockProspects = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          name: 'John Smith',
          title: 'VP Sales',
          company: 'TechCorp Inc',
          industry: 'Technology',
          location: 'San Francisco, CA',
          email: 'john.smith@techcorp.com'
        }
      ];

      const requestBody = {
        campaignId: currentCampaignTab.content.campaignId,
        prospects: mockProspects,
        businessAnalysis: {
          companyName: 'Your Company', // This would come from analysis
          valueProposition: analysis.coreValueProposition,
          competitiveEdges: analysis.competitiveEdges,
          painPoints: analysis.painPoints,
          keyCapabilities: analysis.keyCapabilities,
          targetCustomer: analysis.targetCustomer,
          keyDifferentiator: analysis.keyDifferentiator
        },
        messageSettings: messageSettings,
        campaignGoal: campaignData.basics.campaignGoal
      };

      const response = await fetch('/api/campaigns/generate-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Message generation failed');
      }

      // Update campaign data with generated messages
      const updatedTabs = openTabs.map((tab, tabIndex) =>
        tabIndex === activeTab && tab.type === 'campaign-builder'
          ? {
              ...tab,
              content: {
                ...tab.content,
                campaignData: {
                  ...tab.content.campaignData,
                  messaging: {
                    ...tab.content.campaignData.messaging,
                    generatedMessages: data.data.messages || []
                  }
                }
              }
            }
          : tab
      );
      setOpenTabs(updatedTabs);
    } catch (error) {
      console.error('❌ Message generation error:', error);
      setMessageError(
        error instanceof Error ? error.message : 'Message generation failed'
      );
    } finally {
      setIsGeneratingMessages(false);
    }
  };

  // Campaign creation
  const createNewCampaign = () => {
    if (!selectedCollection) {
      // If no collection is selected, create campaign in first collection or prompt user
      alert('Please select a collection first to create a campaign.');
      return;
    }

    const newCampaignId = `campaign-${Date.now()}`;
    const newCampaign: Campaign = {
      id: newCampaignId,
      name: 'New Campaign',
      status: 'draft',
      prospects: 0,
      responseRate: '0%'
    };

    // Add campaign to the selected collection
    setCollections(
      collections.map((collection) =>
        collection.id === selectedCollection
          ? { ...collection, campaigns: [...collection.campaigns, newCampaign] }
          : collection
      )
    );

    // Create and open campaign builder tab
    const campaignBuilderTab: TabItem = {
      id: newCampaignId,
      title: 'New Campaign',
      type: 'campaign-builder',
      content: {
        campaignId: newCampaignId,
        collectionId: selectedCollection,
        step: 'business-analysis', // Start with business analysis
        campaignData: {
          basics: {
            campaignGoal: '',
            companyWebsite: '',
            alternativeInput: {
              type: null,
              content: null
            },
            analysis: null
          },
          targeting: {
            segments: [],
            selectedSegmentIndex: 0
          },
          messaging: {
            settings: {
              tone: 'professional',
              approach: 'value-based',
              ctaStyle: 'soft-ask',
              ctaAction: '',
              emailLength: 'concise'
            },
            generatedMessages: []
          },
          sequencing: {}
        }
      }
    };

    // Add tab and make it active
    setOpenTabs([...openTabs, campaignBuilderTab]);
    setActiveTab(openTabs.length);
    setSelectedItem(newCampaignId);

    // Close the new dialog
    setNewDialogOpen(false);
  };

  // Function to add a new tab for campaign
  const addTab = (campaign: Campaign) => {
    const tabItem: TabItem = {
      id: campaign.id,
      title: campaign.name,
      type: 'campaign',
      content: {
        status: campaign.status,
        prospects: campaign.prospects,
        responseRate: campaign.responseRate
      }
    };

    const existingTabIndex = openTabs.findIndex((tab) => tab.id === tabItem.id);
    if (existingTabIndex >= 0) {
      setActiveTab(existingTabIndex);
    } else {
      setOpenTabs([...openTabs, tabItem]);
      setActiveTab(openTabs.length);
    }
    setSelectedItem(campaign.id);
    setSelectedCollection(null);
  };

  // Function to add any tab item (for environments, flows, etc.)
  const addTabItem = (item: TabItem) => {
    const existingTabIndex = openTabs.findIndex((tab) => tab.id === item.id);
    if (existingTabIndex >= 0) {
      setActiveTab(existingTabIndex);
    } else {
      setOpenTabs([...openTabs, item]);
      setActiveTab(openTabs.length);
    }
    setSelectedItem(item.id);
    setSelectedCollection(null);
  };

  // Function to open overview tab
  const openOverview = () => {
    const overviewTab: TabItem = {
      id: 'overview',
      title: 'Overview',
      type: 'collection',
      content: {
        isOverview: true,
        workspaceDescription
      }
    };

    const existingTabIndex = openTabs.findIndex((tab) => tab.id === 'overview');
    if (existingTabIndex >= 0) {
      setActiveTab(existingTabIndex);
    } else {
      setOpenTabs([...openTabs, overviewTab]);
      setActiveTab(openTabs.length);
    }
    setSelectedCollection(null);
    setSelectedItem('');
  };

  // Function to select collection (for overview)
  const selectCollection = (collection: Collection) => {
    const tabItem: TabItem = {
      id: collection.id,
      title: collection.name,
      type: 'collection',
      content: {
        campaigns: collection.campaigns,
        totalCampaigns: collection.campaigns.length
      }
    };

    const existingTabIndex = openTabs.findIndex((tab) => tab.id === tabItem.id);
    if (existingTabIndex >= 0) {
      setActiveTab(existingTabIndex);
    } else {
      setOpenTabs([...openTabs, tabItem]);
      setActiveTab(openTabs.length);
    }
    setSelectedCollection(collection.id);
    setSelectedItem('');
  };

  // Function to close a tab
  const closeTab = (index: number) => {
    const newTabs = openTabs.filter((_, i) => i !== index);
    setOpenTabs(newTabs);
    if (activeTab >= index && activeTab > 0) {
      setActiveTab(activeTab - 1);
    } else if (newTabs.length === 0) {
      setActiveTab(-1);
    }
  };

  // Filter and sort collections based on search query and pinned status
  const filteredCollections = collections
    .filter(
      (collection) =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.campaigns.some((campaign) =>
          campaign.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
    .sort((a, b) => {
      // Sort pinned collections to the top
      const aIsPinned = pinnedCollections.has(a.id);
      const bIsPinned = pinnedCollections.has(b.id);

      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return 0; // Keep original order for same pin status
    });

  // Level 2 Content based on Level 1 selection
  const renderLevel2Content = () => {
    // If overview is active, show the last non-overview level 2 content
    const contentType =
      activeLevel1 === 'overview' ? lastNonOverviewLevel1 : activeLevel1;

    switch (contentType) {
      case 'collections':
        return (
          <div className='flex h-full flex-col space-y-0 overflow-hidden'>
            {filteredCollections.map((collection) => (
              <div key={collection.id} className='space-y-0'>
                {/* Collection Header */}
                <div
                  className={`group relative flex items-center justify-between px-3 py-1.5 text-xs transition-colors hover:bg-white/5 ${
                    selectedCollection === collection.id
                      ? 'bg-white/5 text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {/* Orange left border for selected collection */}
                  {selectedCollection === collection.id && (
                    <div className='absolute top-0 left-0 h-full w-0.5 bg-orange-500' />
                  )}

                  <div className='flex flex-1 items-center gap-2'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCollection(collection.id);
                      }}
                      className='flex items-center justify-center rounded p-0.5 hover:bg-white/10'
                    >
                      {collection.expanded ? (
                        <ChevronDown className='h-3 w-3' />
                      ) : (
                        <ChevronRight className='h-3 w-3' />
                      )}
                    </button>
                    {editingCollection === collection.id ? (
                      <input
                        type='text'
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={() => saveCollectionName(collection.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveCollectionName(collection.id);
                          } else if (e.key === 'Escape') {
                            cancelEditingCollection();
                          }
                        }}
                        className='flex-1 rounded border border-white/20 bg-white/5 px-2 py-1 text-xs text-white focus:border-white/40 focus:outline-none'
                        autoFocus
                      />
                    ) : (
                      <span
                        className='flex-1 cursor-pointer font-medium'
                        onClick={() => selectCollection(collection)}
                      >
                        {collection.name}
                      </span>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-1 transition-opacity ${
                      pinnedCollections.has(collection.id)
                        ? 'opacity-100'
                        : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <button
                      className='rounded p-1 hover:bg-white/10'
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePinCollection(collection.id);
                      }}
                    >
                      <Star
                        className={`h-3 w-3 ${
                          pinnedCollections.has(collection.id)
                            ? 'fill-yellow-400 text-yellow-400'
                            : ''
                        }`}
                      />
                    </button>
                    <DropdownMenu
                      open={isDropdownOpen(`collection-${collection.id}`)}
                      onOpenChange={(open) => {
                        if (open) {
                          toggleDropdown(`collection-${collection.id}`);
                        } else {
                          closeAllDropdowns();
                        }
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <button
                          className='rounded p-1 hover:bg-white/10'
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className='h-3 w-3' />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align='end'
                        className='w-32 border-white/20 bg-[#2a2a2a]'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuItem
                          className='text-xs text-white/50 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white'
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingCollection(
                              collection.id,
                              collection.name
                            );
                          }}
                        >
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant='destructive'
                          className='text-xs hover:bg-red-500/10 focus:bg-red-500/10'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCollection(collection.id);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Collection Campaigns with Vertical Indentation Line */}
                {collection.expanded && (
                  <div className='relative'>
                    {/* Vertical indentation line */}
                    <div className='absolute top-0 bottom-0 left-4 w-px bg-white/10' />

                    {collection.campaigns.map((campaign) => (
                      <div
                        key={campaign.id}
                        className={`group relative flex cursor-pointer items-center justify-between py-1.5 pr-3 pl-8 text-xs transition-colors hover:bg-white/5 ${
                          selectedItem === campaign.id
                            ? 'bg-white/5 text-white'
                            : 'text-white/50 hover:text-white'
                        }`}
                        onClick={() => addTab(campaign)}
                      >
                        {/* Orange left border for selected item */}
                        {selectedItem === campaign.id && (
                          <div className='absolute top-0 left-0 h-full w-0.5 bg-orange-500' />
                        )}

                        <div className='flex flex-1 items-center gap-2'>
                          {editingCampaign === campaign.id ? (
                            <input
                              type='text'
                              value={editingCampaignName}
                              onChange={(e) =>
                                setEditingCampaignName(e.target.value)
                              }
                              onBlur={() =>
                                saveCampaignName(campaign.id, collection.id)
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  saveCampaignName(campaign.id, collection.id);
                                } else if (e.key === 'Escape') {
                                  cancelEditingCampaign();
                                }
                              }}
                              className='flex-1 rounded border border-white/20 bg-white/5 px-2 py-1 text-xs text-white focus:border-white/40 focus:outline-none'
                              autoFocus
                            />
                          ) : (
                            <span className='flex-1'>{campaign.name}</span>
                          )}
                        </div>

                        {/* Only show three dots for campaigns (no star) */}
                        <div className='flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className='rounded p-1 hover:bg-white/10'
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className='h-3 w-3' />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align='end'
                              className='w-32 border-white/20 bg-[#2a2a2a]'
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenuItem
                                className='text-xs text-white/50 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  startEditingCampaign(
                                    campaign.id,
                                    collection.id,
                                    campaign.name
                                  );
                                }}
                              >
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant='destructive'
                                className='text-xs hover:bg-red-500/10 focus:bg-red-500/10'
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteCampaign(
                                    campaign.id,
                                    collection.id,
                                    campaign.name
                                  );
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'inbox':
        return (
          <div className='flex h-full flex-col overflow-hidden'>
            <div className='space-y-0'>
              {/* Inbox with count */}
              <div
                className={`group relative flex cursor-pointer items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-white/5 ${
                  selectedItem === 'inbox-main'
                    ? 'bg-white/5 text-white'
                    : 'text-white hover:text-white'
                }`}
                onClick={() => {
                  addTabItem({
                    id: 'inbox-main',
                    title: 'Inbox',
                    type: 'activity',
                    content: { type: 'inbox', count: 0, folder: 'inbox' }
                  });
                  setSelectedItem('inbox-main');
                }}
              >
                {/* Orange left border for selected item */}
                {selectedItem === 'inbox-main' && (
                  <div className='absolute top-0 left-0 h-full w-0.5 bg-orange-500' />
                )}

                <div className='flex items-center gap-2'>
                  <Inbox className='h-4 w-4' />
                  <span>Inbox</span>
                </div>
                <span className='rounded bg-white/10 px-2 py-0.5 text-xs'>
                  0
                </span>
              </div>

              {/* Drafts */}
              <div
                className={`group relative flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/5 ${
                  selectedItem === 'drafts'
                    ? 'bg-white/5 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
                onClick={() => {
                  addTabItem({
                    id: 'drafts',
                    title: 'Drafts',
                    type: 'activity',
                    content: { type: 'drafts', count: 0, folder: 'drafts' }
                  });
                  setSelectedItem('drafts');
                }}
              >
                {/* Orange left border for selected item */}
                {selectedItem === 'drafts' && (
                  <div className='absolute top-0 left-0 h-full w-0.5 bg-orange-500' />
                )}

                <Drafts className='h-4 w-4' />
                <span>Drafts</span>
              </div>

              {/* Sent */}
              <div
                className={`group relative flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/5 ${
                  selectedItem === 'sent'
                    ? 'bg-white/5 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
                onClick={() => {
                  addTabItem({
                    id: 'sent',
                    title: 'Sent',
                    type: 'activity',
                    content: { type: 'sent', count: 0, folder: 'sent' }
                  });
                  setSelectedItem('sent');
                }}
              >
                {/* Orange left border for selected item */}
                {selectedItem === 'sent' && (
                  <div className='absolute top-0 left-0 h-full w-0.5 bg-orange-500' />
                )}

                <Send className='h-4 w-4' />
                <span>Sent</span>
              </div>

              {/* Junk */}
              <div
                className={`group relative flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/5 ${
                  selectedItem === 'junk'
                    ? 'bg-white/5 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
                onClick={() => {
                  addTabItem({
                    id: 'junk',
                    title: 'Junk',
                    type: 'activity',
                    content: { type: 'junk', count: 0, folder: 'junk' }
                  });
                  setSelectedItem('junk');
                }}
              >
                {/* Orange left border for selected item */}
                {selectedItem === 'junk' && (
                  <div className='absolute top-0 left-0 h-full w-0.5 bg-orange-500' />
                )}

                <Archive className='h-4 w-4' />
                <span>Junk</span>
              </div>

              {/* Trash */}
              <div
                className={`group relative flex cursor-pointer items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-white/5 ${
                  selectedItem === 'trash'
                    ? 'bg-white/5 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
                onClick={() => {
                  addTabItem({
                    id: 'trash',
                    title: 'Trash',
                    type: 'activity',
                    content: { type: 'trash', count: 0, folder: 'trash' }
                  });
                  setSelectedItem('trash');
                }}
              >
                {/* Orange left border for selected item */}
                {selectedItem === 'trash' && (
                  <div className='absolute top-0 left-0 h-full w-0.5 bg-orange-500' />
                )}

                <Trash className='h-4 w-4' />
                <span>Trash</span>
              </div>
            </div>
          </div>
        );

      case 'people':
        return (
          <div className='flex h-full flex-col space-y-0 overflow-hidden'>
            {filteredCollections.map((collection) => (
              <div key={collection.id} className='space-y-0'>
                {/* Collection Header */}
                <div
                  className={`group relative flex items-center justify-between px-3 py-1.5 text-xs transition-colors hover:bg-white/5 ${
                    selectedCollection === collection.id
                      ? 'bg-white/5 text-white'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {/* Orange left border for selected collection */}
                  {selectedCollection === collection.id && (
                    <div className='absolute top-0 left-0 h-full w-0.5 bg-orange-500' />
                  )}

                  <div className='flex flex-1 items-center gap-2'>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCollection(collection.id);
                      }}
                      className='flex items-center justify-center rounded p-0.5 hover:bg-white/10'
                    >
                      {collection.expanded ? (
                        <ChevronDown className='h-3 w-3' />
                      ) : (
                        <ChevronRight className='h-3 w-3' />
                      )}
                    </button>
                    {editingCollection === collection.id ? (
                      <input
                        type='text'
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={() => saveCollectionName(collection.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveCollectionName(collection.id);
                          } else if (e.key === 'Escape') {
                            cancelEditingCollection();
                          }
                        }}
                        className='flex-1 rounded border border-white/20 bg-white/5 px-2 py-1 text-xs text-white focus:border-white/40 focus:outline-none'
                        autoFocus
                      />
                    ) : (
                      <span
                        className='flex-1 cursor-pointer font-medium'
                        onClick={() => selectCollection(collection)}
                      >
                        {collection.name}
                      </span>
                    )}
                  </div>
                  <div className='flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                    <button
                      className={`rounded p-1 hover:bg-white/10 ${
                        pinnedCollections.has(collection.id)
                          ? 'opacity-100'
                          : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePinCollection(collection.id);
                      }}
                    >
                      <Star
                        className={`h-3 w-3 ${
                          pinnedCollections.has(collection.id)
                            ? 'fill-yellow-400 text-yellow-400'
                            : ''
                        }`}
                      />
                    </button>
                    <DropdownMenu
                      open={isDropdownOpen(
                        `people-collection-${collection.id}`
                      )}
                      onOpenChange={(open) => {
                        if (open) {
                          toggleDropdown(`people-collection-${collection.id}`);
                        } else {
                          closeAllDropdowns();
                        }
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <button
                          className='rounded p-1 hover:bg-white/10'
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className='h-3 w-3' />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align='end'
                        className='w-32 border-white/20 bg-[#2a2a2a]'
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuItem
                          className='text-xs text-white/50 hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white'
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditingCollection(
                              collection.id,
                              collection.name
                            );
                          }}
                        >
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          variant='destructive'
                          className='text-xs hover:bg-red-500/10 focus:bg-red-500/10'
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCollection(collection.id);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* People Categories with Vertical Indentation Line */}
                {collection.expanded && (
                  <div className='relative'>
                    {/* Vertical indentation line */}
                    <div className='absolute top-0 bottom-0 left-4 w-px bg-white/10' />

                    {/* Interested */}
                    <div
                      className={`group relative flex cursor-pointer items-center justify-between py-1.5 pr-3 pl-8 text-xs transition-colors hover:bg-white/5 ${
                        selectedItem === `${collection.id}-interested`
                          ? 'bg-white/5 text-white'
                          : 'text-white/50 hover:text-white'
                      }`}
                      onClick={() => {
                        addTabItem({
                          id: `${collection.id}-interested`,
                          title: `${collection.name} - Interested`,
                          type: 'activity',
                          content: {
                            type: 'people',
                            status: 'interested',
                            collection: collection.name
                          }
                        });
                        setSelectedItem(`${collection.id}-interested`);
                      }}
                    >
                      {/* Orange left border for selected item */}
                      {selectedItem === `${collection.id}-interested` && (
                        <div className='absolute top-0 left-0 h-full w-0.5 bg-orange-500' />
                      )}

                      <div className='flex items-center gap-2'>
                        <User className='h-3 w-3' />
                        <span>Interested</span>
                      </div>
                    </div>

                    {/* Booked */}
                    <div
                      className={`group relative flex cursor-pointer items-center justify-between py-1.5 pr-3 pl-8 text-xs transition-colors hover:bg-white/5 ${
                        selectedItem === `${collection.id}-booked`
                          ? 'bg-white/5 text-white'
                          : 'text-white/50 hover:text-white'
                      }`}
                      onClick={() => {
                        addTabItem({
                          id: `${collection.id}-booked`,
                          title: `${collection.name} - Booked`,
                          type: 'activity',
                          content: {
                            type: 'people',
                            status: 'booked',
                            collection: collection.name
                          }
                        });
                        setSelectedItem(`${collection.id}-booked`);
                      }}
                    >
                      {/* Orange left border for selected item */}
                      {selectedItem === `${collection.id}-booked` && (
                        <div className='absolute top-0 left-0 h-full w-0.5 bg-orange-500' />
                      )}

                      <div className='flex items-center gap-2'>
                        <UserCheck className='h-3 w-3' />
                        <span>Booked</span>
                      </div>
                    </div>

                    {/* Completed */}
                    <div
                      className={`group relative flex cursor-pointer items-center justify-between py-1.5 pr-3 pl-8 text-xs transition-colors hover:bg-white/5 ${
                        selectedItem === `${collection.id}-completed`
                          ? 'bg-white/5 text-white'
                          : 'text-white/50 hover:text-white'
                      }`}
                      onClick={() => {
                        addTabItem({
                          id: `${collection.id}-completed`,
                          title: `${collection.name} - Completed`,
                          type: 'activity',
                          content: {
                            type: 'people',
                            status: 'completed',
                            collection: collection.name
                          }
                        });
                        setSelectedItem(`${collection.id}-completed`);
                      }}
                    >
                      {/* Orange left border for selected item */}
                      {selectedItem === `${collection.id}-completed` && (
                        <div className='absolute top-0 left-0 h-full w-0.5 bg-orange-500' />
                      )}

                      <div className='flex items-center gap-2'>
                        <UserX className='h-3 w-3' />
                        <span>Completed</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Tab Content Renderer
  const renderTabContent = () => {
    if (activeTab === -1 || !openTabs[activeTab]) {
      return (
        <div className='flex flex-1 items-center justify-center'>
          <div className='text-center'>
            <div className='mb-8 flex justify-center'>
              <div className='rounded-full bg-white/5 p-6'>
                <BarChart3 className='h-12 w-12 text-white/30' />
              </div>
            </div>
            <button
              onClick={openOverview}
              className='mb-6 rounded border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white'
            >
              Open Workspace Overview
            </button>
          </div>
        </div>
      );
    }

    const currentTab = openTabs[activeTab];

    switch (currentTab.type) {
      case 'campaign':
        return (
          <div className='p-6'>
            <div className='mb-6'>
              <h2 className='text-lg font-medium text-white'>
                {currentTab.title}
              </h2>
              <p className='text-sm text-white/50'>
                Campaign details and management
              </p>
            </div>

            <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='rounded border border-white/10 bg-[#262626] p-4'>
                <p className='text-xs text-white/60'>Status</p>
                <p className='text-lg font-medium text-white capitalize'>
                  {currentTab.content.status}
                </p>
              </div>
              <div className='rounded border border-white/10 bg-[#262626] p-4'>
                <p className='text-xs text-white/60'>Prospects</p>
                <p className='text-lg font-medium text-white'>
                  {currentTab.content.prospects}
                </p>
              </div>
              <div className='rounded border border-white/10 bg-[#262626] p-4'>
                <p className='text-xs text-white/60'>Response Rate</p>
                <p className='text-lg font-medium text-white'>
                  {currentTab.content.responseRate}
                </p>
              </div>
            </div>

            <div className='rounded border border-white/10 bg-[#262626] p-6'>
              <h3 className='mb-4 text-sm font-medium text-white'>
                Campaign Actions
              </h3>
              <div className='flex gap-3'>
                <button className='rounded bg-blue-600 px-4 py-2 text-xs text-white transition-colors hover:bg-blue-700'>
                  Edit Campaign
                </button>
                <button className='rounded bg-green-600 px-4 py-2 text-xs text-white transition-colors hover:bg-green-700'>
                  View Reports
                </button>
                <button className='rounded bg-gray-600 px-4 py-2 text-xs text-white transition-colors hover:bg-gray-700'>
                  Export Data
                </button>
              </div>
            </div>
          </div>
        );

      case 'environment':
        return (
          <div className='p-6'>
            <div className='mb-6'>
              <h2 className='text-lg font-medium text-white'>
                {currentTab.title} Environment
              </h2>
              <p className='text-sm text-white/50'>
                Environment configuration and settings
              </p>
            </div>

            <div className='rounded border border-white/10 bg-[#262626] p-6'>
              <h3 className='mb-4 text-sm font-medium text-white'>
                Configuration
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-xs text-white/50'>API Endpoint</span>
                  <span className='text-xs text-white'>
                    {currentTab.content.apiEndpoint}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-xs text-white/50'>Status</span>
                  <span className='text-xs text-green-400'>Active</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'flow':
        return (
          <div className='p-6'>
            <div className='mb-6'>
              <h2 className='text-lg font-medium text-white'>
                {currentTab.title}
              </h2>
              <p className='text-sm text-white/50'>
                Automation flow configuration
              </p>
            </div>

            <div className='rounded border border-white/10 bg-[#262626] p-6'>
              <h3 className='mb-4 text-sm font-medium text-white'>
                Flow Details
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-xs text-white/50'>Type</span>
                  <span className='text-xs text-white capitalize'>
                    {currentTab.content.type.replace('_', ' ')}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-xs text-white/50'>Steps</span>
                  <span className='text-xs text-white'>
                    {currentTab.content.steps}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-xs text-white/50'>Status</span>
                  <span
                    className={`text-xs ${currentTab.content.active ? 'text-green-400' : 'text-yellow-400'}`}
                  >
                    {currentTab.content.active ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'collection':
        // Check if this is the overview tab
        if (currentTab.content.isOverview) {
          return (
            <div className='p-6'>
              {/* Overview Navigation - Full Width */}
              <div className='mb-6 border-b border-white/10'>
                <div className='flex space-x-6'>
                  <button className='border-b-2 border-orange-500 pb-2 text-sm font-normal text-white'>
                    Overview
                  </button>
                  <button className='pb-2 text-sm font-normal text-white/50 hover:text-white'>
                    Updates
                  </button>
                  <button className='pb-2 text-sm font-normal text-white/50 hover:text-white'>
                    Settings
                  </button>
                </div>
              </div>

              {/* Content Section - Max Width Applied */}
              <div className='mx-auto max-w-2xl'>
                {/* Workspace Description Section */}
                <div className='mb-8'>
                  <div className='mb-4 flex items-center gap-2'>
                    <BarChart3 className='h-4 w-4 text-white/50' />
                    <h3 className='text-sm font-medium text-white'>
                      Workspace description
                    </h3>
                  </div>
                  <textarea
                    value={workspaceDescription}
                    onChange={(e) => setWorkspaceDescription(e.target.value)}
                    className='min-h-[100px] w-full rounded border border-white/10 bg-white/5 p-3 text-sm text-white placeholder-white/50 focus:border-white/30 focus:ring-0 focus:outline-none'
                    placeholder='Add information that you want quick access to...'
                  />
                </div>
              </div>
            </div>
          );
        }

        // Regular collection view
        return (
          <div className='p-6'>
            <div className='mb-6'>
              <h2 className='text-lg font-medium text-white'>
                {currentTab.title}
              </h2>
              <p className='text-sm text-white/50'>Collection overview</p>
            </div>

            <div className='rounded border border-white/10 bg-[#262626] p-6'>
              <h3 className='mb-4 text-sm font-medium text-white'>
                Campaigns ({currentTab.content.totalCampaigns})
              </h3>
              <div className='space-y-2'>
                {currentTab.content.campaigns.map((campaign: Campaign) => (
                  <div
                    key={campaign.id}
                    className='flex items-center justify-between rounded p-2 hover:bg-white/5'
                  >
                    <span className='text-xs text-white'>{campaign.name}</span>
                    <span
                      className={`rounded px-2 py-1 text-xs ${
                        campaign.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : campaign.status === 'draft'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'activity':
        return (
          <div className='p-6'>
            <div className='mb-6'>
              <h2 className='text-lg font-medium text-white'>
                {currentTab.title}
              </h2>
              <p className='text-sm text-white/50'>Activity history and logs</p>
            </div>

            <div className='rounded border border-white/10 bg-[#262626] p-6'>
              <h3 className='mb-4 text-sm font-medium text-white'>Summary</h3>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-xs text-white/50'>Type</span>
                  <span className='text-xs text-white capitalize'>
                    {currentTab.content.type.replace('_', ' ')}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-xs text-white/50'>Count</span>
                  <span className='text-xs text-white'>
                    {currentTab.content.count}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-xs text-white/50'>Date</span>
                  <span className='text-xs text-white'>
                    {currentTab.content.date}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'campaign-builder':
        return (
          <div className='p-6'>
            {/* Campaign Builder Navigation - Full Width */}
            <div className='mb-6 border-b border-white/10'>
              <div className='flex space-x-6'>
                {[
                  { id: 'business-analysis', label: 'Business Analysis' },
                  { id: 'target-segment', label: 'Target Segment' },
                  { id: 'messaging', label: 'Messaging' },
                  { id: 'sequencing', label: 'Sequencing' }
                ].map((step) => {
                  const isActive = currentTab.content.step === step.id;

                  return (
                    <button
                      key={step.id}
                      className={`pb-2 text-sm font-normal transition-colors ${
                        isActive
                          ? 'border-b-2 border-orange-500 text-white'
                          : 'text-white/50 hover:text-white'
                      }`}
                      onClick={() => {
                        // Update the tab content to change step
                        const updatedTabs = openTabs.map((tab, tabIndex) =>
                          tabIndex === activeTab
                            ? {
                                ...tab,
                                content: { ...tab.content, step: step.id }
                              }
                            : tab
                        );
                        setOpenTabs(updatedTabs);
                      }}
                    >
                      {step.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Section - Max Width Applied */}
            <div className='mx-auto max-w-2xl'>
              {currentTab.content.step === 'business-analysis' && (
                <div className='space-y-6'>
                  {/* Campaign Goal Selection */}
                  <div>
                    <label className='mb-2 block text-sm font-medium text-white'>
                      Campaign Goal <span className='text-red-400'>*</span>
                    </label>
                    <select
                      value={
                        currentTab.content.campaignData?.basics?.campaignGoal ||
                        ''
                      }
                      onChange={(e) => updateCampaignGoal(e.target.value)}
                      className='w-full rounded border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none'
                    >
                      <option
                        value=''
                        disabled
                        className='bg-[#2a2a2a] text-white/50'
                      >
                        Select your campaign objective...
                      </option>
                      <option
                        value='demo-calls'
                        className='bg-[#2a2a2a] text-white'
                      >
                        Demo Calls
                      </option>
                      <option
                        value='sales-calls'
                        className='bg-[#2a2a2a] text-white'
                      >
                        Sales Calls
                      </option>
                      <option
                        value='partnerships'
                        className='bg-[#2a2a2a] text-white'
                      >
                        Partnerships
                      </option>
                      <option
                        value='investor-calls'
                        className='bg-[#2a2a2a] text-white'
                      >
                        Investor Calls
                      </option>
                      <option
                        value='potential-hires'
                        className='bg-[#2a2a2a] text-white'
                      >
                        Potential Hires
                      </option>
                    </select>
                    <p className='mt-1 text-xs text-white/50'>
                      Choose your primary campaign objective to tailor the AI
                      analysis for your specific goals.
                    </p>
                  </div>

                  {/* Business Information Input */}
                  <div>
                    <label className='mb-3 block text-sm font-medium text-white'>
                      Business Information{' '}
                      <span className='text-red-400'>*</span>
                    </label>
                    <p className='mb-4 text-xs text-white/50'>
                      Choose how you&apos;d like to provide information about
                      your business for AI analysis.
                    </p>

                    {/* Input Method Selector */}
                    <div className='mb-0 flex rounded-t border border-white/20 bg-white/5'>
                      {[
                        { id: 'website', label: 'Website URL', icon: '🌐' },
                        { id: 'upload', label: 'Upload Files', icon: '📄' },
                        { id: 'paste', label: 'Paste Text', icon: '📝' }
                      ].map((method) => {
                        const isActive =
                          (currentTab.content.campaignData?.basics
                            ?.alternativeInput?.type || 'website') ===
                          method.id;

                        return (
                          <button
                            key={method.id}
                            onClick={() =>
                              updateInputMethod(
                                method.id as 'website' | 'upload' | 'paste'
                              )
                            }
                            className={`flex-1 border-r border-white/20 px-4 py-3 text-sm font-medium transition-colors last:border-r-0 ${
                              isActive
                                ? 'bg-white/10 text-white'
                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span className='mr-2'>{method.icon}</span>
                            {method.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Input Content Area */}
                    <div className='rounded-b border border-t-0 border-white/20 bg-white/5 p-4'>
                      {/* Website URL Input */}
                      {(currentTab.content.campaignData?.basics
                        ?.alternativeInput?.type || 'website') ===
                        'website' && (
                        <div className='space-y-3'>
                          <input
                            type='url'
                            value={
                              currentTab.content.campaignData?.basics
                                ?.companyWebsite || ''
                            }
                            onChange={(e) =>
                              updateCompanyWebsite(e.target.value)
                            }
                            placeholder='https://your-company.com'
                            className='w-full rounded border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 focus:border-white/40 focus:outline-none'
                          />
                          <p className='text-xs text-white/50'>
                            We&apos;ll analyze your website to understand your
                            business model, value proposition, and target
                            market.
                          </p>
                        </div>
                      )}

                      {/* File Upload Area */}
                      {currentTab.content.campaignData?.basics?.alternativeInput
                        ?.type === 'upload' && (
                        <div className='space-y-3'>
                          <div
                            className='cursor-pointer rounded-lg border-2 border-dashed border-white/30 p-8 text-center transition-colors hover:border-white/50'
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add(
                                'border-blue-500',
                                'bg-blue-500/10'
                              );
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove(
                                'border-blue-500',
                                'bg-blue-500/10'
                              );
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove(
                                'border-blue-500',
                                'bg-blue-500/10'
                              );
                              const files = Array.from(e.dataTransfer.files);
                              const validFiles = files.filter(
                                (file) =>
                                  ['.pdf', '.doc', '.docx', '.txt'].some(
                                    (ext) =>
                                      file.name.toLowerCase().endsWith(ext)
                                  ) && file.size <= 10 * 1024 * 1024
                              );
                              if (validFiles.length > 0) {
                                updateAlternativeInputContent(
                                  validFiles.map((f) => f.name).join(', ')
                                );
                              }
                            }}
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.multiple = true;
                              input.accept = '.pdf,.doc,.docx,.txt';
                              input.onchange = (e) => {
                                const files = Array.from(
                                  (e.target as HTMLInputElement).files || []
                                );
                                updateAlternativeInputContent(
                                  files.map((f) => f.name).join(', ')
                                );
                              };
                              input.click();
                            }}
                          >
                            <div className='mb-2 text-3xl'>📁</div>
                            <p className='mb-1 text-sm text-white/80'>
                              Drag and drop files here, or click to browse
                            </p>
                            <p className='text-xs text-white/50'>
                              Supports: PDF, DOC, DOCX, TXT (max 10MB each)
                            </p>
                            {currentTab.content.campaignData?.basics
                              ?.alternativeInput?.content && (
                              <div className='mt-3 rounded bg-white/10 p-2 text-xs text-white/80'>
                                Selected:{' '}
                                {
                                  currentTab.content.campaignData.basics
                                    .alternativeInput.content
                                }
                              </div>
                            )}
                          </div>
                          <p className='text-xs text-white/50'>
                            Upload business documents, pitch decks, or marketing
                            materials for analysis.
                          </p>
                        </div>
                      )}

                      {/* Paste Text Area */}
                      {currentTab.content.campaignData?.basics?.alternativeInput
                        ?.type === 'paste' && (
                        <div className='space-y-3'>
                          <textarea
                            value={
                              currentTab.content.campaignData?.basics
                                ?.alternativeInput?.content || ''
                            }
                            onChange={(e) =>
                              updateAlternativeInputContent(e.target.value)
                            }
                            placeholder='Paste your business description, value proposition, product details, or any relevant information about your company...'
                            className='h-32 w-full resize-none rounded border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/50 focus:border-white/40 focus:outline-none'
                          />
                          <p className='text-xs text-white/50'>
                            Paste any text about your business, products, or
                            services for AI analysis.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Error Message */}
                    {analysisError && (
                      <div className='mt-3 rounded border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300'>
                        {analysisError}
                      </div>
                    )}

                    {/* Action Button */}
                    <div className='mt-4'>
                      <button
                        onClick={startBusinessAnalysis}
                        disabled={isAnalyzing}
                        className='flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
                      >
                        {isAnalyzing ? (
                          <>
                            <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white'></div>
                            Analyzing...
                          </>
                        ) : (
                          'Start AI Business Analysis'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Business Analysis Results */}
                  {currentTab.content.campaignData?.basics?.analysis && (
                    <div className='mt-8'>
                      <div className='mb-4 flex items-center gap-2'>
                        <div className='h-2 w-2 rounded-full bg-green-500'></div>
                        <h3 className='text-lg font-medium text-white'>
                          Business Analysis Results
                        </h3>
                      </div>

                      <div className='space-y-6 rounded-lg border border-white/10 bg-white/5 p-6'>
                        {/* Core Value Proposition */}
                        <div>
                          <h4 className='mb-2 text-sm font-medium text-orange-400'>
                            Core Value Proposition
                          </h4>
                          <p className='text-sm leading-relaxed text-white/90'>
                            {
                              currentTab.content.campaignData.basics.analysis
                                .coreValueProposition
                            }
                          </p>
                        </div>

                        {/* Target Customer */}
                        <div>
                          <h4 className='mb-2 text-sm font-medium text-orange-400'>
                            Target Customer
                          </h4>
                          <p className='text-sm leading-relaxed text-white/90'>
                            {
                              currentTab.content.campaignData.basics.analysis
                                .targetCustomer
                            }
                          </p>
                        </div>

                        {/* Key Differentiator */}
                        <div>
                          <h4 className='mb-2 text-sm font-medium text-orange-400'>
                            Key Differentiator
                          </h4>
                          <p className='text-sm leading-relaxed text-white/90'>
                            {
                              currentTab.content.campaignData.basics.analysis
                                .keyDifferentiator
                            }
                          </p>
                        </div>

                        {/* Pain Points */}
                        {currentTab.content.campaignData.basics.analysis
                          .painPoints?.length > 0 && (
                          <div>
                            <h4 className='mb-2 text-sm font-medium text-orange-400'>
                              Pain Points
                            </h4>
                            <ul className='space-y-1'>
                              {currentTab.content.campaignData.basics.analysis.painPoints.map(
                                (point: string, index: number) => (
                                  <li
                                    key={index}
                                    className='flex items-start gap-2 text-sm text-white/80'
                                  >
                                    <span className='mt-1 text-orange-400'>
                                      •
                                    </span>
                                    <span>{point}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Target Industries */}
                        {currentTab.content.campaignData.basics.analysis
                          .targetIndustries?.length > 0 && (
                          <div>
                            <h4 className='mb-2 text-sm font-medium text-orange-400'>
                              Target Industries
                            </h4>
                            <div className='flex flex-wrap gap-2'>
                              {currentTab.content.campaignData.basics.analysis.targetIndustries.map(
                                (industry: string, index: number) => (
                                  <span
                                    key={index}
                                    className='rounded bg-white/10 px-2 py-1 text-xs text-white/80'
                                  >
                                    {industry}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Decision Makers */}
                        {currentTab.content.campaignData.basics.analysis
                          .decisionMakers?.length > 0 && (
                          <div>
                            <h4 className='mb-2 text-sm font-medium text-orange-400'>
                              Decision Makers
                            </h4>
                            <div className='flex flex-wrap gap-2'>
                              {currentTab.content.campaignData.basics.analysis.decisionMakers.map(
                                (maker: string, index: number) => (
                                  <span
                                    key={index}
                                    className='rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-200'
                                  >
                                    {maker}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Key Capabilities */}
                        {currentTab.content.campaignData.basics.analysis
                          .keyCapabilities?.length > 0 && (
                          <div>
                            <h4 className='mb-2 text-sm font-medium text-orange-400'>
                              Key Capabilities
                            </h4>
                            <ul className='space-y-1'>
                              {currentTab.content.campaignData.basics.analysis.keyCapabilities.map(
                                (capability: string, index: number) => (
                                  <li
                                    key={index}
                                    className='flex items-start gap-2 text-sm text-white/80'
                                  >
                                    <span className='mt-1 text-green-400'>
                                      ✓
                                    </span>
                                    <span>{capability}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Continue to Next Step Button */}
                        <div className='border-t border-white/10 pt-4'>
                          <button
                            onClick={() => {
                              // Update to next step
                              const updatedTabs = openTabs.map(
                                (tab, tabIndex) =>
                                  tabIndex === activeTab
                                    ? {
                                        ...tab,
                                        content: {
                                          ...tab.content,
                                          step: 'target-segment'
                                        }
                                      }
                                    : tab
                              );
                              setOpenTabs(updatedTabs);
                            }}
                            className='w-full rounded bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700'
                          >
                            Continue to Target Segment →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentTab.content.step === 'target-segment' && (
                <div className='space-y-6'>
                  {/* Check if business analysis is completed */}
                  {!currentTab.content.campaignData?.basics?.analysis ? (
                    <div className='rounded border border-white/10 bg-[#262626] p-6'>
                      <p className='text-center text-sm text-white/50'>
                        Complete business analysis first to generate target
                        segments.
                      </p>
                      <div className='mt-4 text-center'>
                        <button
                          onClick={() => {
                            const updatedTabs = openTabs.map((tab, tabIndex) =>
                              tabIndex === activeTab
                                ? {
                                    ...tab,
                                    content: {
                                      ...tab.content,
                                      step: 'business-analysis'
                                    }
                                  }
                                : tab
                            );
                            setOpenTabs(updatedTabs);
                          }}
                          className='text-sm text-blue-400 underline hover:text-blue-300'
                        >
                          ← Back to Business Analysis
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Target Segment Generation */}
                      {(!currentTab.content.campaignData?.targeting?.segments ||
                        currentTab.content.campaignData.targeting.segments
                          .length === 0) && (
                        <div>
                          <h3 className='mb-3 text-lg font-medium text-white'>
                            Generate Target Segments
                          </h3>
                          <p className='mb-4 text-sm text-white/70'>
                            Create targeted audience segments based on your
                            business analysis to reach the most relevant
                            prospects.
                          </p>

                          {segmentError && (
                            <div className='mb-4 rounded border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300'>
                              {segmentError}
                            </div>
                          )}

                          <button
                            onClick={generateTargetSegments}
                            disabled={isGeneratingSegments}
                            className='flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
                          >
                            {isGeneratingSegments ? (
                              <>
                                <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white'></div>
                                Generating Segments...
                              </>
                            ) : (
                              '🎯 Generate Target Segments'
                            )}
                          </button>
                        </div>
                      )}

                      {/* Generated Segments Display */}
                      {currentTab.content.campaignData?.targeting?.segments &&
                        currentTab.content.campaignData.targeting.segments
                          .length > 0 && (
                          <div>
                            <div className='mb-4 flex items-center gap-2'>
                              <div className='h-2 w-2 rounded-full bg-green-500'></div>
                              <h3 className='text-lg font-medium text-white'>
                                Target Segments
                              </h3>
                              <span className='rounded bg-green-500/20 px-2 py-1 text-xs text-green-300'>
                                {
                                  currentTab.content.campaignData.targeting
                                    .segments.length
                                }{' '}
                                Generated
                              </span>
                            </div>

                            <div className='space-y-4'>
                              {currentTab.content.campaignData.targeting.segments.map(
                                (segment: any, index: number) => (
                                  <SegmentCard
                                    key={segment.id}
                                    segment={segment}
                                    index={index}
                                    isSelected={selectedSegmentIndex === index}
                                    onSelect={() =>
                                      setSelectedSegmentIndex(index)
                                    }
                                    onUpdate={(newFilters) =>
                                      updateSegmentFilters(index, newFilters)
                                    }
                                    getProspectCount={getProspectCount}
                                  />
                                )
                              )}
                            </div>

                            {/* Continue to Messaging Button */}
                            <div className='mt-6 border-t border-white/10 pt-4'>
                              <button
                                onClick={() => {
                                  const updatedTabs = openTabs.map(
                                    (tab, tabIndex) =>
                                      tabIndex === activeTab
                                        ? {
                                            ...tab,
                                            content: {
                                              ...tab.content,
                                              step: 'messaging'
                                            }
                                          }
                                        : tab
                                  );
                                  setOpenTabs(updatedTabs);
                                }}
                                className='w-full rounded bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700'
                              >
                                Continue to Messaging →
                              </button>
                            </div>
                          </div>
                        )}
                    </>
                  )}
                </div>
              )}

              {currentTab.content.step === 'messaging' && (
                <div className='space-y-6'>
                  {/* Check if target segments are available */}
                  {!currentTab.content.campaignData?.targeting?.segments ||
                  currentTab.content.campaignData.targeting.segments.length ===
                    0 ? (
                    <div className='rounded border border-white/10 bg-[#262626] p-6'>
                      <p className='text-center text-sm text-white/50'>
                        Complete target segment selection first to configure
                        messaging.
                      </p>
                      <div className='mt-4 text-center'>
                        <button
                          onClick={() => {
                            const updatedTabs = openTabs.map((tab, tabIndex) =>
                              tabIndex === activeTab
                                ? {
                                    ...tab,
                                    content: {
                                      ...tab.content,
                                      step: 'target-segment'
                                    }
                                  }
                                : tab
                            );
                            setOpenTabs(updatedTabs);
                          }}
                          className='text-sm text-blue-400 underline hover:text-blue-300'
                        >
                          ← Back to Target Segments
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Message Settings Configuration */}
                      <div>
                        <h3 className='mb-3 text-lg font-medium text-white'>
                          Message Configuration
                        </h3>
                        <p className='mb-6 text-sm text-white/70'>
                          Configure the tone, approach, and style for your
                          campaign messages.
                        </p>

                        <div className='grid grid-cols-2 gap-6'>
                          {/* Tone Selection */}
                          <div>
                            <label className='mb-2 block text-sm font-medium text-white'>
                              Message Tone
                            </label>
                            <select
                              value={
                                currentTab.content.campaignData?.messaging
                                  ?.settings?.tone || 'professional'
                              }
                              onChange={(e) =>
                                updateMessageSettings({ tone: e.target.value })
                              }
                              className='w-full rounded border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none'
                            >
                              <option
                                value='professional'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Professional
                              </option>
                              <option
                                value='friendly'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Friendly
                              </option>
                              <option
                                value='casual'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Casual
                              </option>
                              <option
                                value='direct'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Direct
                              </option>
                            </select>
                          </div>

                          {/* Approach Selection */}
                          <div>
                            <label className='mb-2 block text-sm font-medium text-white'>
                              Message Approach
                            </label>
                            <select
                              value={
                                currentTab.content.campaignData?.messaging
                                  ?.settings?.approach || 'value-based'
                              }
                              onChange={(e) =>
                                updateMessageSettings({
                                  approach: e.target.value
                                })
                              }
                              className='w-full rounded border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none'
                            >
                              <option
                                value='value-based'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Value-Based
                              </option>
                              <option
                                value='question-based'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Question-Based
                              </option>
                              <option
                                value='pain-agitate-solve'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Pain-Agitate-Solve
                              </option>
                              <option
                                value='customer-story'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Customer Story
                              </option>
                              <option
                                value='custom'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Custom
                              </option>
                            </select>
                          </div>

                          {/* CTA Style */}
                          <div>
                            <label className='mb-2 block text-sm font-medium text-white'>
                              Call-to-Action Style
                            </label>
                            <select
                              value={
                                currentTab.content.campaignData?.messaging
                                  ?.settings?.ctaStyle || 'soft-ask'
                              }
                              onChange={(e) =>
                                updateMessageSettings({
                                  ctaStyle: e.target.value
                                })
                              }
                              className='w-full rounded border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none'
                            >
                              <option
                                value='soft-ask'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Soft Ask
                              </option>
                              <option
                                value='hard-ask'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Hard Ask
                              </option>
                              <option
                                value='no-ask'
                                className='bg-[#2a2a2a] text-white'
                              >
                                No Ask
                              </option>
                              <option
                                value='custom'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Custom
                              </option>
                            </select>
                          </div>

                          {/* Email Length */}
                          <div>
                            <label className='mb-2 block text-sm font-medium text-white'>
                              Email Length
                            </label>
                            <select
                              value={
                                currentTab.content.campaignData?.messaging
                                  ?.settings?.emailLength || 'concise'
                              }
                              onChange={(e) =>
                                updateMessageSettings({
                                  emailLength: e.target.value
                                })
                              }
                              className='w-full rounded border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none'
                            >
                              <option
                                value='concise'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Concise (50-100 words)
                              </option>
                              <option
                                value='detailed'
                                className='bg-[#2a2a2a] text-white'
                              >
                                Detailed (100-200 words)
                              </option>
                            </select>
                          </div>
                        </div>

                        {/* CTA Action Input */}
                        <div className='mt-4'>
                          <label className='mb-2 block text-sm font-medium text-white'>
                            Call-to-Action
                          </label>
                          <input
                            type='text'
                            value={
                              currentTab.content.campaignData?.messaging
                                ?.settings?.ctaAction || ''
                            }
                            onChange={(e) =>
                              updateMessageSettings({
                                ctaAction: e.target.value
                              })
                            }
                            placeholder='e.g., Schedule a 15-minute demo call'
                            className='w-full rounded border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/50 focus:border-white/40 focus:outline-none'
                          />
                        </div>

                        {/* Custom Instructions */}
                        {(currentTab.content.campaignData?.messaging?.settings
                          ?.approach === 'custom' ||
                          currentTab.content.campaignData?.messaging?.settings
                            ?.ctaStyle === 'custom') && (
                          <div className='mt-4'>
                            <label className='mb-2 block text-sm font-medium text-white'>
                              Custom Instructions
                            </label>
                            <textarea
                              value={
                                currentTab.content.campaignData?.messaging
                                  ?.settings?.customInstructions || ''
                              }
                              onChange={(e) =>
                                updateMessageSettings({
                                  customInstructions: e.target.value
                                })
                              }
                              placeholder='Provide specific instructions for message tone, approach, or style...'
                              className='h-24 w-full resize-none rounded border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/50 focus:border-white/40 focus:outline-none'
                            />
                          </div>
                        )}
                      </div>

                      {/* Generate Messages Button */}
                      <div>
                        {messageError && (
                          <div className='mb-4 rounded border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300'>
                            {messageError}
                          </div>
                        )}

                        <button
                          onClick={generateMessages}
                          disabled={isGeneratingMessages}
                          className='flex w-full items-center justify-center gap-2 rounded bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          {isGeneratingMessages ? (
                            <>
                              <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white'></div>
                              Generating Messages...
                            </>
                          ) : (
                            '💬 Generate Campaign Messages'
                          )}
                        </button>
                      </div>

                      {/* Generated Messages Display */}
                      {currentTab.content.campaignData?.messaging
                        ?.generatedMessages &&
                        currentTab.content.campaignData.messaging
                          .generatedMessages.length > 0 && (
                          <div>
                            <div className='mb-4 flex items-center gap-2'>
                              <div className='h-2 w-2 rounded-full bg-green-500'></div>
                              <h3 className='text-lg font-medium text-white'>
                                Generated Messages
                              </h3>
                              <span className='rounded bg-green-500/20 px-2 py-1 text-xs text-green-300'>
                                {
                                  currentTab.content.campaignData.messaging
                                    .generatedMessages.length
                                }{' '}
                                Messages
                              </span>
                            </div>

                            <div className='space-y-4'>
                              {currentTab.content.campaignData.messaging.generatedMessages.map(
                                (message: any, index: number) => (
                                  <div
                                    key={index}
                                    className='rounded-lg border border-white/20 bg-white/5 p-4'
                                  >
                                    <div className='mb-2 flex items-center justify-between'>
                                      <span className='text-sm font-medium text-white'>
                                        Message {index + 1}
                                      </span>
                                      <span className='text-xs text-white/50'>
                                        {message.subject ? 'Email' : 'LinkedIn'}
                                      </span>
                                    </div>

                                    {message.subject && (
                                      <div className='mb-3'>
                                        <span className='mb-1 block text-xs text-white/50'>
                                          Subject:
                                        </span>
                                        <div className='text-sm font-medium text-white/90'>
                                          {message.subject}
                                        </div>
                                      </div>
                                    )}

                                    <div className='mb-3'>
                                      <span className='mb-1 block text-xs text-white/50'>
                                        Message:
                                      </span>
                                      <div className='text-sm leading-relaxed whitespace-pre-wrap text-white/90'>
                                        {message.body || message.content}
                                      </div>
                                    </div>

                                    <div className='flex items-center gap-2 border-t border-white/10 pt-2'>
                                      <button className='text-xs text-blue-400 hover:text-blue-300'>
                                        Edit
                                      </button>
                                      <button className='text-xs text-green-400 hover:text-green-300'>
                                        Copy
                                      </button>
                                      <button className='text-xs text-orange-400 hover:text-orange-300'>
                                        Regenerate
                                      </button>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>

                            {/* Continue to Sequencing Button */}
                            <div className='mt-6 border-t border-white/10 pt-4'>
                              <button
                                onClick={() => {
                                  const updatedTabs = openTabs.map(
                                    (tab, tabIndex) =>
                                      tabIndex === activeTab
                                        ? {
                                            ...tab,
                                            content: {
                                              ...tab.content,
                                              step: 'sequencing'
                                            }
                                          }
                                        : tab
                                  );
                                  setOpenTabs(updatedTabs);
                                }}
                                className='w-full rounded bg-green-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-green-700'
                              >
                                Continue to Sequencing →
                              </button>
                            </div>
                          </div>
                        )}
                    </>
                  )}
                </div>
              )}

              {currentTab.content.step === 'sequencing' && (
                <div className='rounded border border-white/10 bg-[#262626] p-6'>
                  <p className='text-center text-sm text-white/50'>
                    Sequencing configuration will appear here after messaging is
                    completed.
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className='flex flex-1 items-center justify-center'>
            <p className='text-white/60'>Unknown tab type</p>
          </div>
        );
    }
  };

  return (
    <div className='h-screen overflow-hidden bg-[#212121] text-white'>
      {/* Fixed Left Side Navigation Area */}
      <div className='fixed top-10 left-0 z-20 flex h-[calc(100vh-2.5rem)] w-[21rem] flex-col overflow-hidden'>
        {/* Fixed Header - Only over Level 1 and Level 2 nav */}
        <div className='flex h-10 flex-shrink-0 items-center justify-between border-r border-b border-white/10 bg-[#262626] px-2'>
          <div className='flex items-center gap-3'>
            <h1 className='text-sm font-medium text-white'>AI Sales Agent</h1>
          </div>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setNewDialogOpen(true)}
              className='rounded border border-white/20 px-2 py-1 text-xs text-white/80 transition-colors hover:border-white hover:bg-white/5 hover:text-white'
            >
              New
            </button>
          </div>
        </div>

        {/* Navigation Area */}
        <div className='flex min-h-0 flex-1'>
          {/* Level 1 Navigation - Far Left */}
          <div className='flex w-20 flex-col border-r border-white/10 bg-[#262626]'>
            <div className='min-h-0 flex-1 space-y-1 p-1'>
              {level1Items.map((item) => {
                const Icon = item.icon;
                const isActive = activeLevel1 === item.id;
                const isOverview = item.id === 'overview';

                return (
                  <div key={item.id}>
                    {/* Add divider before Overview */}
                    {isOverview && (
                      <div className='mx-2 my-2 border-t border-white/20' />
                    )}
                    <button
                      onClick={() => {
                        if (isOverview) {
                          // For overview, directly open the overview tab
                          setActiveLevel1(item.id);
                          openOverview();
                        } else {
                          // For other items, set as active and remember as last non-overview
                          setActiveLevel1(item.id);
                          setLastNonOverviewLevel1(item.id);
                        }
                      }}
                      className={`flex w-full ${isOverview ? 'items-center justify-center' : 'flex-col items-center gap-1'} rounded ${isOverview ? 'p-3' : 'px-3 py-2'} transition-colors ${
                        isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/50 hover:bg-white/5 hover:text-white'
                      }`}
                      title={item.label}
                    >
                      <Icon className={isOverview ? 'h-4 w-4' : 'h-3 w-3'} />
                      {!isOverview && (
                        <span className='text-xs'>{item.label}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Level 2 Navigation - Middle Panel */}
          <div className='flex w-64 flex-col border-r border-white/10 bg-[#262626]'>
            {/* Level 2 Header */}
            <div className='flex-shrink-0 space-y-3 border-b border-white/10 p-3'>
              {/* Plus Icon and Search Bar */}
              <div className='flex items-center gap-2'>
                <button
                  onClick={createNewCollection}
                  className='flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-white/10'
                  title='Create new collection'
                >
                  <Plus className='h-4 w-4 text-white/50' />
                </button>
                <div className='relative flex-1'>
                  <Search className='absolute top-1/2 left-2 h-3 w-3 -translate-y-1/2 text-white/50' />
                  <input
                    type='text'
                    placeholder='Search...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full rounded border border-white/20 bg-white/5 py-1 pr-2 pl-7 text-xs text-white placeholder-white/50 focus:border-white/40 focus:ring-0 focus:outline-none'
                  />
                </div>
              </div>
            </div>

            <div className='min-h-0 flex-1 overflow-hidden'>
              {renderLevel2Content()}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Tab Bar */}
      {openTabs.length > 0 && (
        <div className='fixed top-10 right-0 left-[21rem] z-10 h-12 border-b border-[#404040] bg-[#212121]'>
          <div className='flex h-full items-stretch'>
            {openTabs.map((tab, index) => {
              const isActive = activeTab === index;

              // Get icon based on tab type
              const getTabIcon = () => {
                switch (tab.type) {
                  case 'collection':
                    return <BarChart3 className='h-3 w-3' />;
                  case 'campaign':
                    return <Target className='h-3 w-3' />;
                  case 'campaign-builder':
                    return <Target className='h-3 w-3' />;
                  case 'environment':
                    return <Inbox className='h-3 w-3' />;
                  case 'flow':
                    return <Workflow className='h-3 w-3' />;
                  case 'activity':
                    return <Activity className='h-3 w-3' />;
                  default:
                    return <Target className='h-3 w-3' />;
                }
              };

              return (
                <div
                  key={tab.id}
                  className={`relative flex max-w-42 min-w-0 cursor-pointer items-center gap-2 px-3 py-3 transition-colors ${
                    isActive
                      ? 'bg-[#212121] text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  {/* Active tab orange underline - thinner */}
                  {isActive && (
                    <div className='absolute right-0 bottom-0 left-0 h-px bg-orange-500' />
                  )}

                  {/* Tab icon */}
                  <div className='flex-shrink-0'>{getTabIcon()}</div>

                  {/* Tab content - centered */}
                  <div className='flex min-w-0 flex-1 items-center justify-center gap-2'>
                    {/* POST label for campaigns */}
                    {tab.type === 'campaign' && (
                      <span className='text-xs font-medium text-yellow-500'>
                        POST
                      </span>
                    )}

                    {/* BUILD label for campaign builders */}
                    {tab.type === 'campaign-builder' && (
                      <span className='text-xs font-medium text-blue-500'>
                        BUILD
                      </span>
                    )}

                    <span className='flex-1 truncate text-center text-xs'>
                      {tab.title}
                    </span>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(index);
                    }}
                    className='flex-shrink-0 rounded p-0.5 transition-colors hover:bg-white/10'
                  >
                    <X className='h-3 w-3' />
                  </button>

                  {/* Vertical separator - not full height */}
                  {index < openTabs.length - 1 && (
                    <div className='absolute top-2 right-0 bottom-2 w-px bg-white/10' />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area - Right Panel */}
      <div className='ml-[21rem] h-screen overflow-y-auto bg-[#212121] pt-12'>
        {renderTabContent()}
      </div>

      {/* New Dialog Modal */}
      {newDialogOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center'
          onClick={() => setNewDialogOpen(false)}
        >
          <div
            className='relative w-[620px] rounded border border-white/20 bg-[#212121] shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dialog Header */}
            <div className='flex items-center justify-end px-2 pt-2'>
              <button
                onClick={() => setNewDialogOpen(false)}
                className='rounded p-2 transition-all hover:rotate-90 hover:bg-white/10'
              >
                <X className='h-4 w-4 text-white/50 hover:text-white' />
              </button>
            </div>

            {/* Dialog content */}
            <div className='bg-[#212121] p-4'>
              {/* Grid of options */}
              <div className='mb-8 grid grid-cols-3 place-items-center justify-items-center'>
                {/* Campaign */}
                <button
                  className={`group relative flex h-32 w-32 flex-col items-center justify-center gap-2 rounded border p-1 transition-all duration-300 ${hoveredOption === 'campaign' ? 'border-blue-500 bg-[#012D70]' : 'border-transparent hover:border-blue-500 hover:bg-[#012D70]'}`}
                  onMouseEnter={() => setHoveredOption('campaign')}
                  onClick={createNewCampaign}
                >
                  <div className='p-2 transition-all'>
                    <Target className='h-6 w-6 text-white/50 group-hover:text-white' />
                  </div>
                  <span className='text-xs font-normal text-white/50 group-hover:text-white'>
                    Campaign
                  </span>
                </button>

                {/* Search People */}
                <button
                  className={`group relative flex h-32 w-32 flex-col items-center justify-center gap-2 rounded border p-1 transition-all duration-300 ${hoveredOption === 'search-people' ? 'border-blue-500 bg-[#012D70]' : 'border-transparent hover:border-blue-500 hover:bg-[#012D70]'}`}
                  onMouseEnter={() => setHoveredOption('search-people')}
                >
                  <div className='p-2 transition-all'>
                    <UserSearch className='h-6 w-6 text-white/50 group-hover:text-white' />
                  </div>
                  <span className='text-xs font-normal text-white/50 group-hover:text-white'>
                    Search People
                  </span>
                </button>

                {/* Search Companies */}
                <button
                  className={`group relative flex h-32 w-32 flex-col items-center justify-center gap-2 rounded border p-1 transition-all duration-300 ${hoveredOption === 'search-companies' ? 'border-blue-500 bg-[#012D70]' : 'border-transparent hover:border-blue-500 hover:bg-[#012D70]'}`}
                  onMouseEnter={() => setHoveredOption('search-companies')}
                >
                  <div className='p-2 transition-all'>
                    <Building2 className='h-6 w-6 text-white/50 group-hover:text-white' />
                  </div>
                  <span className='text-xs font-normal text-white/50 group-hover:text-white'>
                    Search Companies
                  </span>
                </button>

                {/* Business Analysis */}
                <button
                  className={`group relative flex h-32 w-32 flex-col items-center justify-center gap-2 rounded border p-1 transition-all duration-300 ${hoveredOption === 'business-analysis' ? 'border-blue-500 bg-[#012D70]' : 'border-transparent hover:border-blue-500 hover:bg-[#012D70]'}`}
                  onMouseEnter={() => setHoveredOption('business-analysis')}
                >
                  <div className='p-2 transition-all'>
                    <TrendingUp className='h-6 w-6 text-white/50 group-hover:text-white' />
                  </div>
                  <span className='text-xs font-normal text-white/50 group-hover:text-white'>
                    Business Analysis
                  </span>
                </button>

                {/* Messaging */}
                <button
                  className={`group relative flex h-32 w-32 flex-col items-center justify-center gap-2 rounded border p-1 transition-all duration-300 ${hoveredOption === 'messaging' ? 'border-blue-500 bg-[#012D70]' : 'border-transparent hover:border-blue-500 hover:bg-[#012D70]'}`}
                  onMouseEnter={() => setHoveredOption('messaging')}
                >
                  <div className='p-2 transition-all'>
                    <MessageSquare className='h-6 w-6 text-white/50 group-hover:text-white' />
                  </div>
                  <span className='text-xs font-normal text-white/50 group-hover:text-white'>
                    Messaging
                  </span>
                </button>

                {/* Outreach Sequence */}
                <button
                  className={`group relative flex h-32 w-32 flex-col items-center justify-center gap-2 rounded border p-1 transition-all duration-300 ${hoveredOption === 'outreach-sequence' ? 'border-blue-500 bg-[#012D70]' : 'border-transparent hover:border-blue-500 hover:bg-[#012D70]'}`}
                  onMouseEnter={() => setHoveredOption('outreach-sequence')}
                >
                  <div className='p-2 transition-all'>
                    <Mail className='h-6 w-6 text-white/50 group-hover:text-white' />
                  </div>
                  <span className='text-xs font-normal text-white/50 group-hover:text-white'>
                    Outreach Sequence
                  </span>
                </button>
              </div>
            </div>

            {/* Dynamic Description Footer - Full Width Divider */}
            <div className='border-t border-white/10 bg-[#262626] p-4'>
              <div className='flex items-center'>
                <p className='text-left text-xs leading-relaxed text-white transition-all duration-300'>
                  {hoveredOption === 'campaign' &&
                    'Create targeted sales campaigns with AI-powered personalization and automated follow-ups to convert prospects into customers.'}
                  {hoveredOption === 'search-people' &&
                    'Find and discover potential prospects using AI-powered search with filters for job title, company, location, and industry.'}
                  {hoveredOption === 'search-companies' &&
                    'Research and identify target companies based on size, industry, funding, and growth indicators for strategic outreach.'}
                  {hoveredOption === 'business-analysis' &&
                    'Analyze company data, market trends, and competitive intelligence to optimize your sales approach and strategy.'}
                  {hoveredOption === 'messaging' &&
                    'Craft personalized messages using AI that adapts tone, content, and timing based on prospect behavior and preferences.'}
                  {hoveredOption === 'outreach-sequence' &&
                    'Build automated multi-channel sequences combining email, LinkedIn, and phone outreach with smart timing and personalization.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Collection Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCollection}
        onOpenChange={(open) => !open && setDeletingCollection(null)}
      >
        <AlertDialogContent className='border-white/20 bg-[#2a2a2a]'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-white'>
              Delete Collection &quot;{getDeletingCollectionName()}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className='text-white/70'>
              This action cannot be undone. This will permanently delete the
              collection and remove it from both the Collections and People
              navigation sections.
              <br />
              <br />
              <strong>What will be deleted:</strong>
              <ul className='mt-2 list-inside list-disc space-y-1 text-sm'>
                <li>The collection and all its campaigns</li>
                <li>All open tabs related to this collection</li>
                <li>
                  People categories (Interested, Booked, Completed) for this
                  collection
                </li>
                <li>Any pinned status for this collection</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='border-white/20 bg-white/10 text-white hover:bg-white/20'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingCollection && deleteCollection(deletingCollection)
              }
              className='bg-red-600 text-white hover:bg-red-700'
            >
              Delete Collection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Campaign Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCampaign}
        onOpenChange={(open) => !open && setDeletingCampaign(null)}
      >
        <AlertDialogContent className='border-white/20 bg-[#2a2a2a]'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-white'>
              Delete Campaign &quot;{deletingCampaign?.campaignName}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className='text-white/70'>
              This action cannot be undone. This will permanently delete the
              campaign from the collection.
              <br />
              <br />
              <strong>What will be deleted:</strong>
              <ul className='mt-2 list-inside list-disc space-y-1 text-sm'>
                <li>The campaign and all its data</li>
                <li>Any open tabs for this campaign</li>
                <li>Campaign progress and settings</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='border-white/20 bg-white/10 text-white hover:bg-white/20'>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteCampaign}
              className='bg-red-600 text-white hover:bg-red-700'
            >
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
