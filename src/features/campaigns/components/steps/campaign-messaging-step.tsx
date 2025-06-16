'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Loader2,
  Send,
  ArrowLeft,
  ArrowRight,
  Mail,
  Search
} from 'lucide-react';

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
  applyTo: 'both' | 'subject' | 'body';
  playType:
    | 'value-based'
    | 'question-based'
    | 'pain-agitate-solve'
    | 'customer-story'
    | 'custom';
  tone: 'professional' | 'friendly' | 'direct' | 'casual';
  ctaStyle: 'soft-ask' | 'hard-ask' | 'no-ask' | 'custom';
  ctaAction:
    | 'schedule-meeting'
    | 'request-demo'
    | 'schedule-call'
    | 'ask-question'
    | 'ask-response'
    | 'request-feedback'
    | 'offer-resources'
    | 'custom';
  customInstructions: string;
}

interface GeneratedMessage {
  prospectId: string;
  prospectName: string;
  prospectEmail: string;
  subject: string;
  emailBody: string;
  generationSuccess: boolean;
  airtableRecordId?: string;
  error?: string;
  toneTags?: string[];
  characterCounts?: {
    subject: number;
    body: number;
  };
}

interface CampaignMessagingStepProps {
  prospects: Prospect[];
  businessAnalysis: BusinessAnalysis;
  campaignGoal: string;
  targetingCriteria: {
    industries: string[];
    roles: string[];
    companySize: string[];
    location: string[];
  };
  campaignId?: string;
  campaignName?: string;
  onComplete: (data: any) => void;
  onDataChange?: (data: any) => void;
  onBack?: () => void;
}

export function CampaignMessagingStep({
  prospects,
  businessAnalysis,
  campaignGoal,
  targetingCriteria,
  campaignId,
  campaignName,
  onComplete,
  onDataChange,
  onBack
}: CampaignMessagingStepProps) {
  const [messageSettings, setMessageSettings] = useState<MessageSettings>({
    applyTo: 'both',
    playType: 'value-based',
    tone: 'professional',
    ctaStyle: 'soft-ask',
    ctaAction: 'schedule-meeting',
    customInstructions: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessages, setGeneratedMessages] = useState<
    GeneratedMessage[]
  >([]);
  const [currentProspectIndex, setCurrentProspectIndex] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Enhanced prospect data state (now handled automatically in API)
  const [enrichmentUsed, setEnrichmentUsed] = useState(false);

  // Auto-generate initial templates on load
  useEffect(() => {
    if (isInitialLoad && prospects.length > 0 && !isGenerating) {
      handleGenerateMessages(true);
      setIsInitialLoad(false);
    }
  }, [prospects, isInitialLoad, isGenerating]);

  const currentProspect = prospects[currentProspectIndex];
  const currentMessage = generatedMessages.find(
    (m) => m.prospectId === currentProspect?.id
  );

  // Check if the message shows signs of Lead Magic enrichment
  const hasEnrichedData =
    currentMessage?.toneTags?.includes('LinkedIn Data') ||
    currentMessage?.toneTags?.includes('Enhanced Research');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getToneTags = (settings: MessageSettings) => {
    const tags = [];

    // Play type tag
    if (settings.playType === 'value-based') tags.push('Value-based');
    if (settings.playType === 'question-based') tags.push('Question-based');
    if (settings.playType === 'pain-agitate-solve')
      tags.push('Pain-Agitate-Solve');
    if (settings.playType === 'customer-story') tags.push('Customer Story');
    if (settings.playType === 'custom') tags.push('Custom');

    // Tone tag
    if (settings.tone === 'professional') tags.push('Professional tone');
    if (settings.tone === 'casual') tags.push('Casual tone');
    if (settings.tone === 'direct') tags.push('Direct tone');
    if (settings.tone === 'friendly') tags.push('Friendly tone');

    // CTA tag
    const ctaTypeDisplay =
      settings.ctaStyle === 'hard-ask'
        ? 'Hard'
        : settings.ctaStyle === 'soft-ask'
          ? 'Soft'
          : settings.ctaStyle === 'no-ask'
            ? 'No Ask'
            : 'Custom';

    const ctaActionDisplay =
      settings.ctaAction === 'schedule-meeting'
        ? 'Meeting'
        : settings.ctaAction === 'request-demo'
          ? 'Demo'
          : settings.ctaAction === 'schedule-call'
            ? 'Call'
            : settings.ctaAction === 'ask-question'
              ? 'Question'
              : settings.ctaAction === 'ask-response'
                ? 'Response'
                : settings.ctaAction === 'request-feedback'
                  ? 'Feedback'
                  : settings.ctaAction === 'offer-resources'
                    ? 'Resources'
                    : 'Custom';

    tags.push(`${ctaTypeDisplay} • ${ctaActionDisplay}`);

    return tags;
  };

  const getCharacterCount = (text: string) => {
    return text.length;
  };

  const handleSettingChange = (key: keyof MessageSettings, value: string) => {
    const newSettings = { ...messageSettings, [key]: value };
    setMessageSettings(newSettings);
    onDataChange?.(newSettings);
  };

  const handleGenerateMessages = async (isInitial = false) => {
    // Prevent multiple simultaneous generations
    if (isGenerating) {
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/campaigns/generate-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          campaignId: campaignId || `campaign-${Date.now()}`,
          campaignName: campaignName || 'Generated Campaign',
          prospects: prospects.slice(0, 3), // Only generate for first 3 prospects for fast preview
          businessAnalysis,
          campaignGoal,
          targetingCriteria,
          messageSettings: {
            tone: messageSettings.tone,
            approach: messageSettings.playType,
            ctaStyle: messageSettings.ctaStyle,
            ctaAction: messageSettings.ctaAction,
            customInstructions: messageSettings.customInstructions
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate messages');
      }

      const result = await response.json();

      // Check if enrichment was used (indicated by sophisticated subject lines or content)
      const enrichmentWasUsed = result.generatedMessages.some(
        (msg: any) =>
          msg.subject?.includes('hey ') ||
          msg.emailBody?.includes("I know you're doing") ||
          msg.emailBody?.includes("I've been following")
      );

      if (enrichmentWasUsed) {
        setEnrichmentUsed(true);
      }

      // Transform the response to include tone tags and character counts
      const messagesWithMetadata = result.generatedMessages.map((msg: any) => {
        const baseTags = getToneTags(messageSettings);
        const enrichmentTags = enrichmentWasUsed
          ? ['LinkedIn Research', 'Enhanced Personalization']
          : [];

        return {
          ...msg,
          toneTags: [...baseTags, ...enrichmentTags],
          characterCounts: {
            subject: getCharacterCount(msg.subject || ''),
            body: getCharacterCount(msg.emailBody || '')
          }
        };
      });

      setGeneratedMessages(messagesWithMetadata);
    } catch (error) {
      console.error('❌ Message generation failed:', error);
      if (!isInitial) {
        alert(
          `Message generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProspectNavigation = (direction: 'prev' | 'next') => {
    const maxPreviewIndex = Math.min(2, prospects.length - 1); // Only navigate through first 3 prospects

    if (direction === 'prev' && currentProspectIndex > 0) {
      setCurrentProspectIndex(currentProspectIndex - 1);
    } else if (direction === 'next' && currentProspectIndex < maxPreviewIndex) {
      setCurrentProspectIndex(currentProspectIndex + 1);
    }
  };

  const handleGenerateForAllProspects = async () => {
    // Prevent multiple simultaneous generations
    if (isGenerating) {
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/campaigns/generate-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          campaignId: campaignId || `campaign-${Date.now()}`,
          campaignName: campaignName || 'Generated Campaign',
          prospects, // Generate for ALL prospects
          businessAnalysis,
          campaignGoal,
          targetingCriteria,
          messageSettings: {
            tone: messageSettings.tone,
            approach: messageSettings.playType,
            ctaStyle: messageSettings.ctaStyle,
            ctaAction: messageSettings.ctaAction,
            customInstructions: messageSettings.customInstructions
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate messages');
      }

      const result = await response.json();

      // Transform the response to include tone tags and character counts
      const messagesWithMetadata = result.generatedMessages.map((msg: any) => ({
        ...msg,
        toneTags: getToneTags(messageSettings),
        characterCounts: {
          subject: getCharacterCount(msg.subject || ''),
          body: getCharacterCount(msg.emailBody || '')
        }
      }));

      setGeneratedMessages(messagesWithMetadata);
    } catch (error) {
      console.error('❌ Message generation failed:', error);
      alert(
        `Message generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = async () => {
    if (generatedMessages.length === 0) {
      alert('Please generate messages first');
      return;
    }

    // If we only have preview messages (3 or fewer), generate for all prospects
    if (generatedMessages.length <= 3 && prospects.length > 3) {
      await handleGenerateForAllProspects();
    }

    onComplete({
      messageSettings,
      generatedMessages,
      enrichmentUsed
    });
  };

  if (!currentProspect) {
    return (
      <div className='py-12 text-center'>
        <p className='text-muted-foreground'>No prospects available</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header with Preview & Test Workflow */}
      <div className='border-primary bg-muted/50 rounded-r-lg border-l-4 p-4'>
        <div className='text-foreground text-sm'>
          <strong>Preview & Test Workflow:</strong> Testing with 3 sample
          prospects for fast iteration. Once you&apos;re happy with the
          messaging approach, we&apos;ll generate personalized emails for all{' '}
          {prospects.length} prospects when you click &quot;Save and Launch
          Campaign&quot;.
        </div>
      </div>

      {/* LinkedIn Research Integration Notice */}
      {enrichmentUsed && (
        <div className='rounded-lg border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-600'>
              <Search className='h-5 w-5 text-white' />
            </div>
            <div>
              <h3 className='font-semibold text-green-900'>
                LinkedIn Research Active
              </h3>
              <p className='text-sm text-green-700'>
                These messages use real LinkedIn profile data for enhanced
                personalization
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prospect Header with Navigation - Above Grid */}
      <div className='bg-muted/30 flex items-center justify-between rounded-lg p-4'>
        <div className='flex items-center gap-3'>
          <Avatar className='bg-primary h-12 w-12 text-white'>
            <AvatarFallback className='bg-primary font-semibold text-white'>
              {getInitials(currentProspect.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className='font-semibold'>{currentProspect.name}</h3>
            <p className='text-muted-foreground text-sm'>
              {currentProspect.title} at {currentProspect.company}
            </p>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleProspectNavigation('prev')}
            disabled={currentProspectIndex === 0 || isGenerating}
          >
            <ArrowLeft className='h-4 w-4' />
            Previous
          </Button>

          {/* Prospect Avatars */}
          <div className='flex gap-1'>
            {prospects.slice(0, 3).map((prospect, index) => (
              <Avatar
                key={prospect.id}
                className={`h-8 w-8 transition-all ${
                  index === currentProspectIndex
                    ? 'bg-blue-600 text-white ring-2 ring-blue-500'
                    : 'bg-gray-200 hover:bg-gray-300'
                } ${isGenerating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                onClick={() => !isGenerating && setCurrentProspectIndex(index)}
              >
                <AvatarFallback
                  className={
                    index === currentProspectIndex
                      ? 'bg-blue-600 font-semibold text-white'
                      : 'bg-gray-200 font-semibold text-gray-700'
                  }
                >
                  {getInitials(prospect.name)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>

          <Button
            variant='outline'
            size='sm'
            onClick={() => handleProspectNavigation('next')}
            disabled={
              currentProspectIndex >= Math.min(2, prospects.length - 1) ||
              isGenerating
            }
          >
            Next
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
        {/* Left Panel - Prospect Information */}
        <div className='lg:col-span-1'>
          {/* Personal Information */}
          <Card className='mb-4'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-muted-foreground text-sm font-semibold'>
                  PERSONAL INFORMATION
                </CardTitle>
                {hasEnrichedData && (
                  <Badge className='border-blue-300 bg-blue-100 text-xs text-blue-800'>
                    LinkedIn Enriched
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-3 text-sm'>
                <div>
                  <div className='text-foreground font-medium'>Full Name</div>
                  <div className='text-muted-foreground'>
                    {currentProspect.name}
                  </div>
                </div>
                <div>
                  <div className='text-foreground font-medium'>Job Title</div>
                  <div className='text-muted-foreground'>
                    {currentProspect.title}
                  </div>
                </div>
                <div>
                  <div className='text-foreground font-medium'>
                    Professional Email
                  </div>
                  <div className='text-muted-foreground text-xs break-all'>
                    {currentProspect.email}
                  </div>
                </div>
                <div>
                  <div className='text-foreground font-medium'>Location</div>
                  <div className='text-muted-foreground'>
                    {currentProspect.location}
                  </div>
                </div>
                {currentProspect.linkedinUrl && (
                  <div>
                    <div className='text-foreground font-medium'>
                      LinkedIn Profile
                    </div>
                    <a
                      href={currentProspect.linkedinUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1 text-xs text-blue-600 hover:underline'
                    >
                      View LinkedIn <ExternalLink className='h-3 w-3' />
                    </a>
                  </div>
                )}
                {hasEnrichedData && (
                  <div className='border-t pt-2'>
                    <div className='text-xs font-medium text-blue-600'>
                      ✨ This prospect&apos;s message uses enhanced LinkedIn
                      data for better personalization
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className='mb-4'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-muted-foreground text-sm font-semibold'>
                  COMPANY INFORMATION
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 gap-3 text-sm'>
                <div>
                  <div className='text-foreground font-medium'>
                    Company Name
                  </div>
                  <div className='text-muted-foreground'>
                    {currentProspect.company}
                  </div>
                </div>
                <div>
                  <div className='text-foreground font-medium'>
                    Industry Sector
                  </div>
                  <div className='text-muted-foreground'>
                    {currentProspect.industry}
                  </div>
                </div>
                {currentProspect.companySize && (
                  <div>
                    <div className='text-foreground font-medium'>
                      Company Size
                    </div>
                    <div className='text-muted-foreground'>
                      {currentProspect.companySize}
                    </div>
                  </div>
                )}
                <div>
                  <div className='text-foreground font-medium'>
                    Headquarters
                  </div>
                  <div className='text-muted-foreground'>
                    {currentProspect.location}
                  </div>
                </div>
                {currentProspect.companyWebsite && (
                  <div>
                    <div className='text-foreground font-medium'>
                      Company Website
                    </div>
                    <a
                      href={currentProspect.companyWebsite}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1 text-xs text-blue-600 hover:underline'
                    >
                      Visit Website <ExternalLink className='h-3 w-3' />
                    </a>
                  </div>
                )}
                <div className='border-t pt-2'>
                  <div className='text-foreground font-medium'>
                    Target Profile
                  </div>
                  <div className='text-muted-foreground'>
                    {currentProspect.title} in {currentProspect.industry}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center Panel - Email Content */}
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <Tabs defaultValue='initial' className='w-full'>
                    <TabsList>
                      <TabsTrigger value='initial'>Initial Email</TabsTrigger>
                      <TabsTrigger value='followup' disabled>
                        Follow-up
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {isGenerating ? (
                <div className='py-12 text-center'>
                  <Loader2 className='mx-auto mb-4 h-8 w-8 animate-spin' />
                  <p className='text-muted-foreground'>
                    Generating personalized content...
                  </p>
                </div>
              ) : currentMessage ? (
                <>
                  {/* Subject Line */}
                  <div>
                    <div className='mb-2 flex items-center gap-2'>
                      <Mail className='text-primary h-4 w-4' />
                      <span className='text-sm font-medium'>Subject Line</span>
                      <Button variant='ghost' size='sm' className='h-6 w-6 p-0'>
                        <RotateCcw className='h-3 w-3' />
                      </Button>
                    </div>
                    <div className='bg-background rounded-lg border p-3'>
                      {currentMessage.subject}
                    </div>

                    {/* Tone Tags */}
                    <div className='mt-2 flex gap-2'>
                      {currentMessage.toneTags?.map((tag, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='text-xs'
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Email Body */}
                  <div>
                    <div className='bg-background rounded-lg border p-4 whitespace-pre-wrap'>
                      {currentMessage.emailBody}
                    </div>
                  </div>

                  {/* Character Counts */}
                  <div className='flex justify-between text-xs'>
                    <span
                      className={`${
                        (currentMessage.characterCounts?.subject || 0) > 100
                          ? 'font-medium text-red-600'
                          : (currentMessage.characterCounts?.subject || 0) > 80
                            ? 'font-medium text-yellow-600'
                            : 'text-muted-foreground'
                      }`}
                    >
                      Subject: {currentMessage.characterCounts?.subject || 0}
                      /100 characters
                      {(currentMessage.characterCounts?.subject || 0) > 100 &&
                        ' ⚠️ OVER LIMIT'}
                    </span>
                    <span
                      className={`${
                        (currentMessage.characterCounts?.body || 0) > 1000
                          ? 'font-medium text-red-600'
                          : (currentMessage.characterCounts?.body || 0) > 800
                            ? 'font-medium text-yellow-600'
                            : 'text-muted-foreground'
                      }`}
                    >
                      Body: {currentMessage.characterCounts?.body || 0}/1000
                      characters
                      {(currentMessage.characterCounts?.body || 0) > 1000 &&
                        ' ⚠️ OVER LIMIT'}
                    </span>
                  </div>
                </>
              ) : (
                <div className='text-muted-foreground py-12 text-center'>
                  <Mail className='mx-auto mb-4 h-12 w-12 opacity-50' />
                  <p>Generate messages to see preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Regenerate Options */}
        <div className='lg:col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Regenerate Options</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium'>
                  Apply to:
                </label>
                <Select
                  value={messageSettings.applyTo}
                  onValueChange={(value: any) =>
                    handleSettingChange('applyTo', value)
                  }
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='both'>Both Subject & Body</SelectItem>
                    <SelectItem value='subject'>Subject Only</SelectItem>
                    <SelectItem value='body'>Body Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium'>
                  Play Type
                </label>
                <Select
                  value={messageSettings.playType}
                  onValueChange={(value: any) =>
                    handleSettingChange('playType', value)
                  }
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='value-based'>Value-based</SelectItem>
                    <SelectItem value='question-based'>
                      Question-based
                    </SelectItem>
                    <SelectItem value='pain-agitate-solve'>
                      Pain-Agitate-Solve
                    </SelectItem>
                    <SelectItem value='customer-story'>
                      Customer Story
                    </SelectItem>
                    <SelectItem value='custom'>Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium'>Tone</label>
                <Select
                  value={messageSettings.tone}
                  onValueChange={(value: any) =>
                    handleSettingChange('tone', value)
                  }
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='professional'>Professional</SelectItem>
                    <SelectItem value='friendly'>Friendly</SelectItem>
                    <SelectItem value='casual'>Casual</SelectItem>
                    <SelectItem value='direct'>Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium'>
                  CTA Style
                </label>
                <Select
                  value={messageSettings.ctaStyle}
                  onValueChange={(value: any) =>
                    handleSettingChange('ctaStyle', value)
                  }
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='soft-ask'>Soft Ask</SelectItem>
                    <SelectItem value='hard-ask'>Hard Ask</SelectItem>
                    <SelectItem value='no-ask'>No Ask</SelectItem>
                    <SelectItem value='custom'>Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium'>
                  CTA Action
                </label>
                <Select
                  value={messageSettings.ctaAction}
                  onValueChange={(value: any) =>
                    handleSettingChange('ctaAction', value)
                  }
                  disabled={isGenerating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='schedule-meeting'>
                      Schedule a Meeting
                    </SelectItem>
                    <SelectItem value='request-demo'>Request a Demo</SelectItem>
                    <SelectItem value='schedule-call'>
                      Schedule a Call
                    </SelectItem>
                    <SelectItem value='ask-question'>Ask a Question</SelectItem>
                    <SelectItem value='ask-response'>
                      Ask for a Response
                    </SelectItem>
                    <SelectItem value='request-feedback'>
                      Request Feedback
                    </SelectItem>
                    <SelectItem value='offer-resources'>
                      Offer Resources
                    </SelectItem>
                    <SelectItem value='custom'>Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium'>
                  Custom Instructions
                </label>
                <Textarea
                  placeholder='Add specific instructions...'
                  value={messageSettings.customInstructions}
                  onChange={(e) =>
                    handleSettingChange('customInstructions', e.target.value)
                  }
                  disabled={isGenerating}
                  rows={4}
                />
              </div>

              <div className='space-y-2'>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    className='flex-1'
                    disabled={isGenerating}
                  >
                    <RotateCcw className='mr-2 h-4 w-4' />
                    Undo
                  </Button>
                  <Button
                    onClick={() => handleGenerateMessages()}
                    disabled={isGenerating}
                    className='flex-1'
                  >
                    {isGenerating ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <RotateCcw className='mr-2 h-4 w-4' />
                    )}
                    Regenerate
                  </Button>
                </div>

                {generatedMessages.length <= 3 && prospects.length > 3 && (
                  <Button
                    onClick={handleGenerateForAllProspects}
                    disabled={isGenerating}
                    variant='secondary'
                    className='w-full text-xs'
                    size='sm'
                  >
                    {isGenerating ? (
                      <Loader2 className='mr-2 h-3 w-3 animate-spin' />
                    ) : (
                      <Send className='mr-2 h-3 w-3' />
                    )}
                    Generate for All {prospects.length} Prospects
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex items-center justify-between border-t pt-6'>
        <Button variant='outline' onClick={onBack} disabled={isGenerating}>
          <ChevronLeft className='mr-2 h-4 w-4' />
          Back
        </Button>

        <Button
          onClick={handleComplete}
          disabled={generatedMessages.length === 0 || isGenerating}
          size='lg'
          className='bg-primary hover:bg-primary/90'
        >
          <Send className='mr-2 h-4 w-4' />
          {generatedMessages.length <= 3 && prospects.length > 3
            ? `Generate All ${prospects.length} & Launch Campaign`
            : 'Save and Launch Campaign'}
        </Button>
      </div>
    </div>
  );
}
