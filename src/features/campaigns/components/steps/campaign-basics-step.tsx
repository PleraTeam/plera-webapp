'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Upload,
  FileText,
  Trash2,
  Check,
  Loader2,
  Eye,
  Brain
} from 'lucide-react';
import { toast } from 'sonner';

const campaignGoals = [
  'Demo Calls',
  'Sales Calls',
  'Partnerships',
  'Investor Calls',
  'Potential Hires'
];

const basicsSchema = z.object({
  campaignGoal: z.string().min(1, 'Campaign goal is required'),
  companyWebsite: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Please enter a valid URL (e.g., https://www.example.com)'
    }),
  alternativeInputType: z.enum(['upload', 'paste', 'none']).default('none'),
  alternativeInputText: z.string().optional()
});

type BasicsFormData = z.infer<typeof basicsSchema>;

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

interface CampaignBasicsStepProps {
  data: {
    campaignGoal: string;
    companyWebsite: string;
    alternativeInput: {
      type: 'upload' | 'paste' | null;
      content: string | File | null;
    };
    analysis?: BusinessAnalysis;
  };
  onComplete: (data: any) => void;
  onDataChange: (data: any) => void;
}

// Helper function to extract text from uploaded files
const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string;

      // For text files, return content directly
      if (file.type === 'text/plain') {
        resolve(result);
        return;
      }

      // For other file types (PDF, DOC, DOCX), we'd need more sophisticated parsing
      // For now, we'll show a warning and return empty string
      if (
        file.type.includes('pdf') ||
        file.type.includes('word') ||
        file.type.includes('document')
      ) {
        toast.warning('Document uploaded but text extraction is limited', {
          description:
            'Only text files (.txt) are fully supported. For PDF/Word docs, please copy and paste the key content using the "Paste Text" option.'
        });
        resolve('');
        return;
      }

      resolve(result || '');
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
};

export function CampaignBasicsStep({
  data,
  onComplete,
  onDataChange
}: CampaignBasicsStepProps) {
  const [selectedInputType, setSelectedInputType] = useState<
    'upload' | 'paste' | null
  >(data.alternativeInput.type);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [extractedTexts, setExtractedTexts] = useState<
    { file: string; content: string; success: boolean }[]
  >([]);
  const [pastedText, setPastedText] = useState<string>(
    typeof data.alternativeInput.content === 'string'
      ? data.alternativeInput.content
      : ''
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtractingFiles, setIsExtractingFiles] = useState(false);
  const [analysis, setAnalysis] = useState<BusinessAnalysis | null>(
    data.analysis || null
  );
  const [showAnalysis, setShowAnalysis] = useState(!!data.analysis);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BasicsFormData>({
    resolver: zodResolver(basicsSchema),
    defaultValues: {
      campaignGoal: data.campaignGoal,
      companyWebsite: data.companyWebsite,
      alternativeInputType: data.alternativeInput.type || 'none',
      alternativeInputText:
        typeof data.alternativeInput.content === 'string'
          ? data.alternativeInput.content
          : ''
    }
  });

  const handleInputTypeChange = (type: 'upload' | 'paste') => {
    setSelectedInputType(type);

    // Clear the other input type
    if (type === 'upload') {
      setPastedText('');
      form.setValue('alternativeInputText', '');
    } else {
      setUploadedFiles([]);
      setExtractedTexts([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }

    form.setValue('alternativeInputType', type);
    updateParentData();
  };

  const handleMultipleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      if (!allowedTypes.includes(file.type)) {
        invalidFiles.push(file.name);
      } else if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        invalidFiles.push(`${file.name} (too large)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error('Some files were rejected', {
        description: `Invalid files: ${invalidFiles.join(', ')}`
      });
    }

    if (validFiles.length === 0) return;

    setUploadedFiles((prev) => [...prev, ...validFiles]);
    setPastedText(''); // Clear paste text when files are uploaded

    toast.success(`${validFiles.length} file(s) uploaded successfully`);

    // Extract text from uploaded files
    await extractTextFromFiles(validFiles);
    updateParentData();
  };

  const extractTextFromFiles = async (files: File[]) => {
    setIsExtractingFiles(true);

    try {
      const extractions = await Promise.all(
        files.map(async (file) => {
          try {
            const content = await extractTextFromFile(file);
            return {
              file: file.name,
              content,
              success: content.length > 0
            };
          } catch (error) {
            return {
              file: file.name,
              content: '',
              success: false
            };
          }
        })
      );

      setExtractedTexts((prev) => [...prev, ...extractions]);

      const successCount = extractions.filter((e) => e.success).length;

      if (successCount > 0) {
        toast.success(
          `Text extracted from ${successCount} of ${files.length} files`
        );
      } else {
        toast.warning('Limited text extraction', {
          description:
            'For better results with PDF/Word docs, consider using "Paste Text" option'
        });
      }
    } catch (error) {
      toast.error('Text extraction failed', {
        description:
          'Please try uploading files individually or use the paste option'
      });
    } finally {
      setIsExtractingFiles(false);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName));
    setExtractedTexts((prev) => prev.filter((e) => e.file !== fileName));
    updateParentData();
  };

  const getAllExtractedText = () => {
    return extractedTexts
      .filter((e) => e.success && e.content.trim())
      .map((e) => `=== ${e.file} ===\n${e.content}`)
      .join('\n\n');
  };

  const handleTextChange = (text: string) => {
    setPastedText(text);
    setUploadedFiles([]); // Clear files when text is pasted
    setExtractedTexts([]); // Clear extracted texts
    form.setValue('alternativeInputText', text);
    updateParentData();
  };

  const updateParentData = () => {
    const allContent =
      selectedInputType === 'upload' ? getAllExtractedText() : pastedText;

    const currentData = {
      campaignGoal: form.getValues('campaignGoal'),
      companyWebsite: form.getValues('companyWebsite'),
      alternativeInput: {
        type: selectedInputType,
        content: allContent || null,
        files: uploadedFiles.map((f) => ({ name: f.name, size: f.size }))
      },
      analysis
    };
    onDataChange(currentData);
  };

  const analyzeWebsite = async () => {
    const website = form.getValues('companyWebsite');
    const goal = form.getValues('campaignGoal');
    const hasAdditionalContent =
      (selectedInputType === 'paste' && pastedText.trim()) ||
      (selectedInputType === 'upload' && uploadedFiles.length > 0);

    if (!goal) {
      toast.error('Please select a campaign goal before analyzing');
      return;
    }

    if (!website && !hasAdditionalContent) {
      toast.error(
        'Please provide either a website URL or additional business content (paste text or upload files) before analyzing'
      );
      return;
    }

    setIsAnalyzing(true);

    try {
      // Prepare additional content if available
      let additionalContent = '';
      if (selectedInputType === 'paste' && pastedText) {
        additionalContent = pastedText;
      } else if (selectedInputType === 'upload' && uploadedFiles.length > 0) {
        additionalContent = getAllExtractedText();
      }

      const response = await fetch('/api/campaigns/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          website_url: website,
          campaign_goal: goal,
          additional_content: additionalContent
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Analysis failed');
      }

      const result = await response.json();
      setAnalysis(result.data.analysis);
      setShowAnalysis(true);
      updateParentData();

      toast.success('Business analysis completed!', {
        description:
          'Your business insights are ready to guide your campaign targeting decisions.'
      });
    } catch (error) {
      toast.error('Analysis failed', {
        description:
          error instanceof Error
            ? error.message
            : 'Please try again or contact support.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = (formData: BasicsFormData) => {
    const stepData = {
      campaignGoal: formData.campaignGoal,
      companyWebsite: formData.companyWebsite,
      alternativeInput: {
        type: selectedInputType,
        content:
          selectedInputType === 'upload'
            ? getAllExtractedText()
            : pastedText || null
      },
      analysis
    };

    onComplete(stepData);
    toast.success('Basics step completed!', {
      description: 'Moving to the next step...'
    });
  };

  // Check if form is valid for completion
  const hasAdditionalContent =
    (selectedInputType === 'paste' && pastedText.trim()) ||
    (selectedInputType === 'upload' && uploadedFiles.length > 0);
  const isFormValid =
    form.formState.isValid &&
    form.getValues('campaignGoal') &&
    (form.getValues('companyWebsite') || hasAdditionalContent);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='grid gap-8 md:grid-cols-2'>
          {/* Campaign Goal */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Campaign Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name='campaignGoal'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      What&apos;s the main goal of this campaign?
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        updateParentData();
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select campaign goal' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {campaignGoals.map((goal) => (
                          <SelectItem key={goal} value={goal}>
                            {goal}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Company Website */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>Your Website (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name='companyWebsite'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your business website URL (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://www.yourbusiness.com'
                        type='url'
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          updateParentData();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        {/* Website Analysis Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Brain className='h-5 w-5' />
              Your Business Analysis
            </CardTitle>
            <p className='text-muted-foreground text-sm'>
              Get AI-powered insights about your business to make informed
              campaign targeting decisions
            </p>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex gap-3'>
              <Button
                type='button'
                onClick={analyzeWebsite}
                disabled={
                  isAnalyzing ||
                  !form.getValues('campaignGoal') ||
                  (!form.getValues('companyWebsite') &&
                    !(
                      (selectedInputType === 'paste' && pastedText.trim()) ||
                      (selectedInputType === 'upload' &&
                        uploadedFiles.length > 0)
                    ))
                }
                className='flex items-center gap-2'
              >
                {isAnalyzing ? (
                  <Loader2 className='h-4 w-4 animate-spin' />
                ) : (
                  <Brain className='h-4 w-4' />
                )}
                {isAnalyzing
                  ? 'Analyzing Your Business...'
                  : 'Analyze My Business'}
              </Button>

              {analysis && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  className='flex items-center gap-2'
                >
                  <Eye className='h-4 w-4' />
                  {showAnalysis ? 'Hide' : 'Show'} Analysis
                </Button>
              )}
            </div>

            {analysis && showAnalysis && (
              <div className='bg-muted/30 mt-6 space-y-4 rounded-lg border p-4'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <h4 className='mb-2 text-sm font-semibold'>
                      Core Value Proposition
                    </h4>
                    <p className='text-muted-foreground text-sm'>
                      {analysis.coreValueProposition}
                    </p>
                  </div>
                  <div>
                    <h4 className='mb-2 text-sm font-semibold'>
                      Target Customer
                    </h4>
                    <p className='text-muted-foreground text-sm'>
                      {analysis.targetCustomer}
                    </p>
                  </div>
                  <div>
                    <h4 className='mb-2 text-sm font-semibold'>
                      Key Differentiator
                    </h4>
                    <p className='text-muted-foreground text-sm'>
                      {analysis.keyDifferentiator}
                    </p>
                  </div>
                  <div>
                    <h4 className='mb-2 text-sm font-semibold'>
                      Implementation
                    </h4>
                    <p className='text-muted-foreground text-sm'>
                      {analysis.implementation}
                    </p>
                  </div>
                </div>

                <div className='grid gap-4 md:grid-cols-2'>
                  <div>
                    <h4 className='mb-2 text-sm font-semibold'>Pain Points</h4>
                    <ul className='text-muted-foreground space-y-1 text-sm'>
                      {analysis.painPoints.map((point, index) => (
                        <li key={index} className='flex items-start gap-2'>
                          <span className='mt-1 text-xs'>•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className='mb-2 text-sm font-semibold'>
                      Key Capabilities
                    </h4>
                    <ul className='text-muted-foreground space-y-1 text-sm'>
                      {analysis.keyCapabilities.map((capability, index) => (
                        <li key={index} className='flex items-start gap-2'>
                          <span className='mt-1 text-xs'>•</span>
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className='mb-2 text-sm font-semibold'>
                      Target Industries
                    </h4>
                    <ul className='text-muted-foreground space-y-1 text-sm'>
                      {analysis.targetIndustries.map((industry, index) => (
                        <li key={index} className='flex items-start gap-2'>
                          <span className='mt-1 text-xs'>•</span>
                          <span>{industry}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className='mb-2 text-sm font-semibold'>
                      Decision Makers
                    </h4>
                    <ul className='text-muted-foreground space-y-1 text-sm'>
                      {analysis.decisionMakers.map((maker, index) => (
                        <li key={index} className='flex items-start gap-2'>
                          <span className='mt-1 text-xs'>•</span>
                          <span>{maker}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className='border-t pt-2'>
                  <h4 className='mb-2 text-sm font-semibold'>
                    Client Outcomes & Competitive Edges
                  </h4>
                  <div className='grid gap-4 md:grid-cols-2'>
                    <div>
                      <h5 className='text-muted-foreground mb-1 text-xs font-medium'>
                        CLIENT OUTCOMES
                      </h5>
                      <ul className='space-y-1 text-sm'>
                        {analysis.clientOutcomes.map((outcome, index) => (
                          <li key={index} className='flex items-start gap-2'>
                            <span className='mt-1 text-xs'>•</span>
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className='text-muted-foreground mb-1 text-xs font-medium'>
                        COMPETITIVE EDGES
                      </h5>
                      <ul className='space-y-1 text-sm'>
                        {analysis.competitiveEdges.map((edge, index) => (
                          <li key={index} className='flex items-start gap-2'>
                            <span className='mt-1 text-xs'>•</span>
                            <span>{edge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Alternative Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className='text-lg'>
              Additional Business Details (Optional)
            </CardTitle>
            <p className='text-muted-foreground text-sm'>
              Share extra details about your business to get more accurate
              campaign insights
            </p>
          </CardHeader>
          <CardContent className='space-y-6'>
            {/* Input Type Selection */}
            <div className='flex gap-4'>
              <Button
                type='button'
                variant={selectedInputType === 'upload' ? 'default' : 'outline'}
                onClick={() => handleInputTypeChange('upload')}
                className='flex items-center gap-2'
              >
                <Upload className='h-4 w-4' />
                Upload File
              </Button>
              <Button
                type='button'
                variant={selectedInputType === 'paste' ? 'default' : 'outline'}
                onClick={() => handleInputTypeChange('paste')}
                className='flex items-center gap-2'
              >
                <FileText className='h-4 w-4' />
                Paste Text
              </Button>
            </div>

            {/* File Upload Section */}
            {selectedInputType === 'upload' && (
              <div className='space-y-4'>
                <div className='border-muted-foreground/25 rounded-lg border-2 border-dashed p-6'>
                  {uploadedFiles.length > 0 ? (
                    <div className='space-y-3'>
                      {/* Upload new files button */}
                      <div className='flex items-center justify-between'>
                        <h4 className='text-sm font-medium'>
                          Uploaded Files ({uploadedFiles.length})
                        </h4>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isExtractingFiles}
                        >
                          <Upload className='mr-1 h-3 w-3' />
                          Add More
                        </Button>
                      </div>

                      {/* File list */}
                      <div className='max-h-48 space-y-2 overflow-y-auto'>
                        {uploadedFiles.map((file, index) => {
                          const extraction = extractedTexts.find(
                            (e) => e.file === file.name
                          );
                          return (
                            <div
                              key={`${file.name}-${index}`}
                              className={`flex items-center justify-between rounded-md border p-3 ${
                                extraction?.success
                                  ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                                  : extraction?.success === false
                                    ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20'
                                    : 'bg-muted/50 border-muted-foreground/25'
                              }`}
                            >
                              <div className='flex items-center gap-3'>
                                {extraction?.success ? (
                                  <Check className='h-4 w-4 text-green-600' />
                                ) : extraction?.success === false ? (
                                  <FileText className='h-4 w-4 text-orange-600' />
                                ) : (
                                  <Loader2 className='text-muted-foreground h-4 w-4 animate-spin' />
                                )}
                                <div className='min-w-0 flex-1'>
                                  <p className='truncate text-sm font-medium'>
                                    {file.name}
                                  </p>
                                  <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                                    <span>
                                      {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                    {extraction && (
                                      <span>
                                        •{' '}
                                        {extraction.success
                                          ? `${extraction.content.length} chars extracted`
                                          : 'Limited extraction'}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => handleRemoveFile(file.name)}
                                className='text-red-600 hover:text-red-700'
                              >
                                <Trash2 className='h-3 w-3' />
                              </Button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Extraction status */}
                      {isExtractingFiles && (
                        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                          <Loader2 className='h-4 w-4 animate-spin' />
                          <span>Extracting text from files...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='space-y-4 text-center'>
                      <Upload className='text-muted-foreground mx-auto h-12 w-12' />
                      <div>
                        <p className='text-sm font-medium'>
                          Click to upload or drag and drop
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          PDF, DOC, DOCX, or TXT files (multiple files
                          supported)
                        </p>
                      </div>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isExtractingFiles}
                      >
                        {isExtractingFiles ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload className='mr-2 h-4 w-4' />
                            Choose Files
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='.pdf,.doc,.docx,.txt'
                    multiple
                    onChange={handleMultipleFileUpload}
                    className='hidden'
                  />
                </div>

                <div className='text-muted-foreground text-xs'>
                  <p>
                    <strong>Fully supported:</strong> TXT files
                  </p>
                  <p>
                    <strong>Limited support:</strong> PDF, DOC, DOCX (text
                    extraction coming soon)
                  </p>
                  <p>
                    <strong>Maximum file size:</strong> 10MB per file
                  </p>
                  <p className='text-amber-600'>
                    <strong>Tip:</strong> For best results with PDF/Word docs,
                    use &quot;Paste Text&quot; instead
                  </p>
                </div>
              </div>
            )}

            {/* Paste Text Section */}
            {selectedInputType === 'paste' && (
              <div className='space-y-4'>
                <FormField
                  control={form.control}
                  name='alternativeInputText'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paste your business details here</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Paste your business description, service details, unique features, or any relevant information about your company...'
                          className='min-h-[120px] resize-none'
                          value={pastedText}
                          onChange={(e) => {
                            field.onChange(e);
                            handleTextChange(e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='text-muted-foreground text-xs'>
                  <p>
                    You can paste your business description, service
                    information, value propositions, or any other relevant
                    details about your company.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className='flex justify-end'>
          <Button
            type='submit'
            disabled={!isFormValid}
            className='min-w-[150px]'
          >
            Continue to Targeting
          </Button>
        </div>
      </form>
    </Form>
  );
}
