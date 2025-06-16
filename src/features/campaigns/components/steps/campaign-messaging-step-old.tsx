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
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Mail,
  Wand2,
  Users,
  Building,
  Target,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Save,
  Send,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  RotateCcw
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
  tone: 'professional' | 'casual' | 'direct' | 'friendly';
  approach: 'value-based' | 'problem-focused' | 'social-proof';
  emailLength: 'concise' | 'detailed';
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
}

interface CampaignMessagingStepProps {
  prospects: Prospect[];
  businessAnalysis: BusinessAnalysis;
  campaignId?: string;
  campaignName?: string;
  onComplete: (data: any) => void;
  onDataChange?: (data: any) => void;
  onBack?: () => void;
}

export function CampaignMessagingStep({
  prospects,
  businessAnalysis,
  campaignId,
  campaignName,
  onComplete,
  onDataChange,
  onBack
}: CampaignMessagingStepProps) {
  const [messageSettings, setMessageSettings] = useState<MessageSettings>({
    tone: 'professional',
    approach: 'value-based',
    emailLength: 'concise',
    customInstructions: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessages, setGeneratedMessages] = useState<
    GeneratedMessage[]
  >([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStats, setGenerationStats] = useState<{
    total: number;
    successful: number;
    failed: number;
    airtableSaved: number;
  } | null>(null);

  const handleSettingChange = (key: keyof MessageSettings, value: string) => {
    const newSettings = { ...messageSettings, [key]: value };
    setMessageSettings(newSettings);
    onDataChange?.(newSettings);
  };

  const handleGenerateMessages = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedMessages([]);
    setGenerationStats(null);

    try {
      const response = await fetch('/api/campaigns/generate-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          campaignId: campaignId || `campaign-${Date.now()}`,
          campaignName: campaignName || 'Generated Campaign',
          prospects,
          businessAnalysis,
          messageSettings
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate messages');
      }

      const result = await response.json();

      setGeneratedMessages(result.generatedMessages);
      setGenerationStats({
        total: result.processingStats.totalProspects,
        successful: result.processingStats.successfulGenerations,
        failed: result.processingStats.failedGenerations,
        airtableSaved: result.airtableStats.recordsSaved
      });

      setGenerationProgress(100);
    } catch (error) {
      console.error('❌ Message generation failed:', error);
      alert(
        `Message generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    if (generatedMessages.length === 0) {
      alert('Please generate messages first');
      return;
    }

    onComplete({
      messageSettings,
      generatedMessages,
      generationStats
    });
  };

  const currentPreview = generatedMessages[currentPreviewIndex];

  return (
    <div className='space-y-6'>
      {/* Header Stats */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2'>
              <Users className='h-4 w-4 text-blue-500' />
              <div>
                <div className='text-2xl font-bold'>{prospects.length}</div>
                <div className='text-muted-foreground text-sm'>Prospects</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2'>
              <Building className='h-4 w-4 text-green-500' />
              <div>
                <div className='text-lg font-semibold'>
                  {businessAnalysis.companyName || 'Your Company'}
                </div>
                <div className='text-muted-foreground text-sm'>
                  Company Context
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center gap-2'>
              <Target className='h-4 w-4 text-purple-500' />
              <div>
                <div className='text-lg font-semibold'>
                  {businessAnalysis.industry || 'Business'}
                </div>
                <div className='text-muted-foreground text-sm'>
                  Industry Focus
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Left Panel - Message Settings */}
        <div className='space-y-4 lg:col-span-1'>
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Message Settings</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium'>Tone</label>
                <Select
                  value={messageSettings.tone}
                  onValueChange={(value: any) =>
                    handleSettingChange('tone', value)
                  }
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
                  Approach
                </label>
                <Select
                  value={messageSettings.approach}
                  onValueChange={(value: any) =>
                    handleSettingChange('approach', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='value-based'>Value-based</SelectItem>
                    <SelectItem value='problem-focused'>
                      Problem-focused
                    </SelectItem>
                    <SelectItem value='social-proof'>Social Proof</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium'>
                  Email Length
                </label>
                <Select
                  value={messageSettings.emailLength}
                  onValueChange={(value: any) =>
                    handleSettingChange('emailLength', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='concise'>
                      Concise (100-150 words)
                    </SelectItem>
                    <SelectItem value='detailed'>
                      Detailed (150-250 words)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium'>
                  Custom Instructions
                </label>
                <Textarea
                  placeholder="Add specific instructions for the AI (e.g., 'Focus on cost savings', 'Mention our recent partnership with...')"
                  value={messageSettings.customInstructions}
                  onChange={(e) =>
                    handleSettingChange('customInstructions', e.target.value)
                  }
                  rows={3}
                />
              </div>

              <Button
                onClick={handleGenerateMessages}
                disabled={isGenerating}
                className='w-full'
                size='lg'
              >
                {isGenerating ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className='mr-2 h-4 w-4' />
                    Generate Messages
                  </>
                )}
              </Button>

              {isGenerating && (
                <div className='space-y-2'>
                  <Progress value={generationProgress} />
                  <div className='text-muted-foreground text-center text-sm'>
                    Generating personalized messages...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generation Stats */}
          {generationStats && (
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Generation Results</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex justify-between'>
                  <span>Total Prospects:</span>
                  <Badge variant='outline'>{generationStats.total}</Badge>
                </div>
                <div className='flex justify-between'>
                  <span>Successful:</span>
                  <Badge className='bg-green-100 text-green-800'>
                    {generationStats.successful}
                  </Badge>
                </div>
                {generationStats.failed > 0 && (
                  <div className='flex justify-between'>
                    <span>Failed:</span>
                    <Badge className='bg-red-100 text-red-800'>
                      {generationStats.failed}
                    </Badge>
                  </div>
                )}
                <div className='flex justify-between'>
                  <span>Saved to Airtable:</span>
                  <Badge className='bg-blue-100 text-blue-800'>
                    {generationStats.airtableSaved}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className='lg:col-span-2'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Eye className='h-5 w-5' />
                  Message Preview
                </div>
                {generatedMessages.length > 0 && (
                  <div className='flex items-center gap-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        setCurrentPreviewIndex(
                          Math.max(0, currentPreviewIndex - 1)
                        )
                      }
                      disabled={currentPreviewIndex === 0}
                    >
                      Previous
                    </Button>
                    <span className='text-muted-foreground text-sm'>
                      {currentPreviewIndex + 1} of {generatedMessages.length}
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() =>
                        setCurrentPreviewIndex(
                          Math.min(
                            generatedMessages.length - 1,
                            currentPreviewIndex + 1
                          )
                        )
                      }
                      disabled={
                        currentPreviewIndex === generatedMessages.length - 1
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!currentPreview ? (
                <div className='text-muted-foreground py-12 text-center'>
                  <Mail className='mx-auto mb-4 h-12 w-12 opacity-50' />
                  <p>Generate messages to see preview</p>
                </div>
              ) : (
                <div className='space-y-4'>
                  {/* Prospect Info */}
                  <div className='bg-muted flex items-center gap-2 rounded-lg p-3'>
                    <div className='bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full'>
                      <span className='text-sm font-medium'>
                        {currentPreview.prospectName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <div className='font-medium'>
                        {currentPreview.prospectName}
                      </div>
                      <div className='text-muted-foreground text-sm'>
                        {currentPreview.prospectEmail}
                      </div>
                    </div>
                    {currentPreview.generationSuccess ? (
                      <CheckCircle className='ml-auto h-4 w-4 text-green-500' />
                    ) : (
                      <AlertCircle className='ml-auto h-4 w-4 text-red-500' />
                    )}
                  </div>

                  {currentPreview.generationSuccess ? (
                    <>
                      {/* Subject Line */}
                      <div>
                        <label className='text-muted-foreground text-sm font-medium'>
                          Subject Line
                        </label>
                        <div className='bg-background mt-1 rounded-lg border p-3'>
                          {currentPreview.subject}
                        </div>
                      </div>

                      {/* Email Body */}
                      <div>
                        <label className='text-muted-foreground text-sm font-medium'>
                          Email Body
                        </label>
                        <div className='bg-background mt-1 rounded-lg border p-4 whitespace-pre-wrap'>
                          {currentPreview.emailBody}
                        </div>
                      </div>

                      {currentPreview.airtableRecordId && (
                        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                          <Save className='h-4 w-4' />
                          Saved to Airtable: {currentPreview.airtableRecordId}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
                      <div className='flex items-center gap-2 text-red-800'>
                        <AlertCircle className='h-4 w-4' />
                        Generation Failed
                      </div>
                      <div className='mt-1 text-sm text-red-600'>
                        {currentPreview.error || 'Unknown error occurred'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex items-center justify-between border-t pt-6'>
        <Button variant='outline' onClick={onBack} disabled={isGenerating}>
          Back to Targeting
        </Button>

        <div className='flex items-center gap-3'>
          {generationStats && (
            <div className='text-muted-foreground text-sm'>
              {generationStats.successful} messages generated,{' '}
              {generationStats.airtableSaved} saved to Airtable
            </div>
          )}

          <Button
            onClick={handleComplete}
            disabled={generatedMessages.length === 0 || isGenerating}
            size='lg'
          >
            <Send className='mr-2 h-4 w-4' />
            Complete Campaign
          </Button>
        </div>
      </div>
    </div>
  );
}
