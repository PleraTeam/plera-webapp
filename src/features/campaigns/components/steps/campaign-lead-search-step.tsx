'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search,
  Users,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Mail
} from 'lucide-react';
import { TargetSegment } from '@/types/targeting';
import { ProspectsDataTable } from '../prospects-data-table';
import type { Prospect } from '../prospects-table-columns';

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

interface LeadSearchStepProps {
  businessAnalysis: BusinessAnalysis;
  targetSegments: TargetSegment[];
  onComplete: (data: any) => void;
  onDataChange: (data: any) => void;
  onBack: () => void;
}

interface SearchStats {
  totalFound: number;
  withEmail: number;
  shownCount: number;
  userTier: 'free' | 'bronze' | 'silver' | 'gold';
  emailRate: number;
}

export function CampaignLeadSearchStep({
  targetSegments,
  onComplete,
  onDataChange,
  onBack
}: Omit<LeadSearchStepProps, 'businessAnalysis'>) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [searchStats, setSearchStats] = useState<SearchStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Direct Apollo.io API call to search for leads
  const handleSearchLeads = async () => {
    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch('/api/campaigns/search-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetSegments
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to search for leads');
      }

      if (result.success) {
        const { prospects: foundProspects, searchStats: stats } = result.data;

        setProspects(foundProspects || []);
        setSearchStats(stats);
        setSearchCompleted(true);

        // Update parent component
        onDataChange({
          prospects: foundProspects,
          searchStats: stats
        });
      } else {
        throw new Error('Search was unsuccessful');
      }
    } catch (err) {
      console.error('Apollo.io search error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to search Apollo.io for leads. Please try again.'
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleContinue = () => {
    onComplete({
      prospects,
      searchStats
    });
  };

  const SegmentSummary = ({ segment }: { segment: TargetSegment }) => (
    <div className='bg-muted/50 space-y-3 rounded-lg p-4'>
      <div className='flex items-center gap-2'>
        <h4 className='text-foreground font-medium'>{segment.name}</h4>
        {segment.isAIGenerated && (
          <Badge variant='outline' className='text-xs'>
            AI Generated
          </Badge>
        )}
      </div>

      <div className='grid grid-cols-1 gap-4 text-sm md:grid-cols-3'>
        <div>
          <span className='text-muted-foreground'>Industries:</span>
          <div className='mt-1 flex flex-wrap gap-1'>
            {segment.filters.industries.slice(0, 2).map((industry, idx) => (
              <Badge key={idx} variant='outline' className='text-xs'>
                {industry}
              </Badge>
            ))}
            {segment.filters.industries.length > 2 && (
              <Badge variant='outline' className='text-xs'>
                +{segment.filters.industries.length - 2} more
              </Badge>
            )}
          </div>
        </div>

        <div>
          <span className='text-muted-foreground'>Roles:</span>
          <div className='mt-1 flex flex-wrap gap-1'>
            {segment.filters.jobTitles.slice(0, 2).map((role, idx) => (
              <Badge key={idx} variant='outline' className='text-xs'>
                {role}
              </Badge>
            ))}
            {segment.filters.jobTitles.length > 2 && (
              <Badge variant='outline' className='text-xs'>
                +{segment.filters.jobTitles.length - 2} more
              </Badge>
            )}
          </div>
        </div>

        <div>
          <span className='text-muted-foreground'>Company Size:</span>
          <div className='mt-1 flex flex-wrap gap-1'>
            {segment.filters.companySizes.slice(0, 2).map((size, idx) => (
              <Badge key={idx} variant='outline' className='text-xs'>
                {size.label}
              </Badge>
            ))}
            {segment.filters.companySizes.length > 2 && (
              <Badge variant='outline' className='text-xs'>
                +{segment.filters.companySizes.length - 2} more
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='space-y-6'>
      {/* Targeting Summary */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Search className='h-5 w-5 text-orange-500' />
            Search Criteria
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {targetSegments.map((segment) => (
            <SegmentSummary key={segment.id} segment={segment} />
          ))}

          {!searchCompleted && (
            <div className='pt-4 text-center'>
              <Button
                onClick={handleSearchLeads}
                disabled={isSearching}
                className='bg-orange-500 hover:bg-orange-600'
                size='lg'
              >
                {isSearching ? (
                  <>
                    <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className='mr-2 h-4 w-4' />
                    Search
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchCompleted && searchStats && (
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='flex items-center gap-2'>
                <CheckCircle className='h-5 w-5 text-green-500' />
                Search Results
              </CardTitle>
              <Button
                variant='outline'
                onClick={handleSearchLeads}
                disabled={isSearching}
              >
                <RefreshCw className='mr-2 h-4 w-4' />
                Refresh Search
              </Button>
            </div>
          </CardHeader>
          <CardContent className='space-y-6 overflow-visible'>
            {/* Simplified Stats */}
            <div className='flex items-center justify-between border-b py-4'>
              <div className='flex items-center gap-6'>
                <div className='flex items-center gap-2'>
                  <Users className='text-muted-foreground h-4 w-4' />
                  <span className='text-sm font-medium'>
                    {prospects.length} prospects found
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Mail className='h-4 w-4 text-green-600' />
                  <span className='text-muted-foreground text-sm'>
                    {prospects.filter((p) => p.email).length} with verified
                    emails
                  </span>
                </div>
              </div>
              {searchStats.userTier === 'free' && prospects.length >= 20 && (
                <Badge variant='outline' className='text-xs'>
                  Free tier: {prospects.length} of {searchStats.totalFound}{' '}
                  shown
                </Badge>
              )}
            </div>

            {/* Prospects Data Table */}
            <div className='w-full overflow-visible'>
              <ProspectsDataTable
                prospects={prospects}
                targetSegments={targetSegments}
              />
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
        <Button variant='outline' onClick={onBack}>
          ← Back to Targeting
        </Button>
        {searchCompleted && (
          <Button
            onClick={handleContinue}
            className='bg-orange-500 hover:bg-orange-600'
          >
            Configure Messages
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
}
