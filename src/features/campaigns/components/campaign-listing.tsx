'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Search,
  Plus,
  Play,
  Pause,
  MoreHorizontal,
  Calendar,
  TrendingUp,
  Mail,
  Users,
  Eye
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const EmptyState = () => (
  <Card className='border-dashed'>
    <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
      <div className='bg-muted mb-6 rounded-full p-6'>
        <Mail className='text-muted-foreground h-12 w-12' />
      </div>
      <h3 className='mb-2 text-xl font-semibold'>No campaigns yet</h3>
      <p className='text-muted-foreground mb-6 max-w-md'>
        Create your first outreach campaign to start connecting with prospects
        and growing your business.
      </p>
      <Link href='/dashboard/campaigns/new'>
        <Button className='gap-2'>
          <Plus className='h-4 w-4' />
          Create Your First Campaign
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-300';
    case 'completed':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <Play className='h-3 w-3' />;
    case 'paused':
      return <Pause className='h-3 w-3' />;
    default:
      return null;
  }
};

export function CampaignListing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [goalFilter, setGoalFilter] = useState('all');

  // No campaigns yet - show empty state
  const campaigns: any[] = [];
  const showEmptyState = true;

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || campaign.status === statusFilter;
    const matchesGoal = goalFilter === 'all' || campaign.goal === goalFilter;
    return matchesSearch && matchesStatus && matchesGoal;
  });

  if (showEmptyState) {
    return <EmptyState />;
  }

  return (
    <div className='space-y-6'>
      {/* Search and Filters */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='relative max-w-md flex-1'>
          <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
          <Input
            placeholder='Search campaigns...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>

        <div className='flex items-center gap-2'>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className='w-[130px]'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Status</SelectItem>
              <SelectItem value='active'>Active</SelectItem>
              <SelectItem value='paused'>Paused</SelectItem>
              <SelectItem value='draft'>Draft</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={goalFilter} onValueChange={setGoalFilter}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Goal' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Goals</SelectItem>
              <SelectItem value='Demo Calls'>Demo Calls</SelectItem>
              <SelectItem value='Sales Calls'>Sales Calls</SelectItem>
              <SelectItem value='Partnerships'>Partnerships</SelectItem>
              <SelectItem value='Investor Calls'>Investor Calls</SelectItem>
              <SelectItem value='Potential Hires'>Potential Hires</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Campaign List */}
      <div className='space-y-4'>
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className='transition-shadow hover:shadow-md'>
            <CardContent className='p-6'>
              <div className='flex items-center justify-between'>
                {/* Left Section - Campaign Info */}
                <div className='flex flex-1 items-center gap-6'>
                  <div className='min-w-0 flex-1 space-y-1'>
                    <div className='flex items-center gap-3'>
                      <h3 className='text-lg leading-tight font-semibold'>
                        {campaign.name}
                      </h3>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant='outline'
                          className={`text-xs ${getStatusColor(campaign.status)}`}
                        >
                          <div className='flex items-center gap-1'>
                            {getStatusIcon(campaign.status)}
                            <span className='capitalize'>
                              {campaign.status}
                            </span>
                          </div>
                        </Badge>
                        <Badge variant='secondary' className='text-xs'>
                          {campaign.goal}
                        </Badge>
                      </div>
                    </div>
                    <p className='text-muted-foreground text-sm'>
                      Created {new Date(campaign.created).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Metrics Section */}
                  <div className='hidden items-center gap-8 md:flex'>
                    <div className='text-center'>
                      <div className='text-muted-foreground mb-1 flex items-center gap-1 text-xs'>
                        <Users className='h-3 w-3' />
                        <span>Prospects</span>
                      </div>
                      <div className='font-semibold'>{campaign.prospects}</div>
                    </div>

                    <div className='text-center'>
                      <div className='text-muted-foreground mb-1 flex items-center gap-1 text-xs'>
                        <Mail className='h-3 w-3' />
                        <span>Sent</span>
                      </div>
                      <div className='font-semibold'>{campaign.sent}</div>
                    </div>

                    <div className='text-center'>
                      <div className='text-muted-foreground mb-1 flex items-center gap-1 text-xs'>
                        <TrendingUp className='h-3 w-3' />
                        <span>Responses</span>
                      </div>
                      <div className='font-semibold'>{campaign.responses}</div>
                    </div>

                    <div className='text-center'>
                      <div className='text-muted-foreground mb-1 flex items-center gap-1 text-xs'>
                        <Calendar className='h-3 w-3' />
                        <span>Meetings</span>
                      </div>
                      <div className='font-semibold'>{campaign.meetings}</div>
                    </div>

                    {/* Response Rate */}
                    {campaign.sent > 0 && (
                      <div className='text-center'>
                        <div className='text-muted-foreground mb-1 text-xs'>
                          Response Rate
                        </div>
                        <div className='font-semibold text-green-600'>
                          {campaign.responseRate}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className='flex items-center gap-2'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem>
                        <Eye className='mr-2 h-4 w-4' />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Play className='mr-2 h-4 w-4' />
                        {campaign.status === 'active' ? 'Pause' : 'Start'}{' '}
                        Campaign
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Mobile Metrics - Show on smaller screens */}
              <div className='mt-4 border-t pt-4 md:hidden'>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='flex items-center justify-between'>
                    <div className='text-muted-foreground flex items-center gap-1'>
                      <Users className='h-3 w-3' />
                      <span>Prospects</span>
                    </div>
                    <div className='font-medium'>{campaign.prospects}</div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='text-muted-foreground flex items-center gap-1'>
                      <Mail className='h-3 w-3' />
                      <span>Sent</span>
                    </div>
                    <div className='font-medium'>{campaign.sent}</div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='text-muted-foreground flex items-center gap-1'>
                      <TrendingUp className='h-3 w-3' />
                      <span>Responses</span>
                    </div>
                    <div className='font-medium'>{campaign.responses}</div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='text-muted-foreground flex items-center gap-1'>
                      <Calendar className='h-3 w-3' />
                      <span>Meetings</span>
                    </div>
                    <div className='font-medium'>{campaign.meetings}</div>
                  </div>
                </div>

                {/* Mobile Response Rate */}
                {campaign.sent > 0 && (
                  <div className='mt-3 border-t pt-3'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>
                        Response Rate
                      </span>
                      <span className='font-medium text-green-600'>
                        {campaign.responseRate}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCampaigns.length === 0 && campaigns.length > 0 && (
        <Card className='border-dashed'>
          <CardContent className='py-12 text-center'>
            <h3 className='mb-2 text-lg font-semibold'>No campaigns found</h3>
            <p className='text-muted-foreground'>
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
