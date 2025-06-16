'use client';

import { useRouter } from 'next/navigation';
import {
  Zap,
  Upload,
  Lock,
  BarChart3,
  FileText,
  Package,
  Code,
  Workflow
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const router = useRouter();

  return (
    <div className='bg-[#212121] text-white'>
      {/* Container with max width like billing page */}
      <div className='mx-auto max-w-4xl p-6'>
        {/* Get started section - Vertical list */}
        <div className='mb-12'>
          <div className='mb-6'>
            <h1 className='text-left text-lg font-medium'>Get started</h1>
          </div>

          {/* Vertical list of action items */}
          <div className='w-full space-y-0'>
            {/* Send an API request */}
            <div className='py-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded bg-blue-500/20'>
                    <Zap className='h-4 w-4 text-white' />
                  </div>
                  <div>
                    <h3 className='mb-1 text-xs font-medium text-white'>
                      Send an API request
                    </h3>
                    <p className='text-xs text-white/70'>
                      Quickly send and test any type of API request: HTTP,
                      GraphQL, gRPC, WebSocket, Socket.IO, or MQTT
                    </p>
                  </div>
                </div>
                <button className='border border-white/20 px-3 py-2 text-xs text-white/80 transition-colors hover:border-white hover:bg-white/5 hover:text-white'>
                  New Request
                </button>
              </div>
            </div>

            {/* Separator line */}
            <div className='border-t border-white/10'></div>

            {/* Import APIs and collections */}
            <div className='py-6'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded bg-orange-500/20'>
                    <Upload className='h-4 w-4 text-white' />
                  </div>
                  <div>
                    <h3 className='mb-1 text-xs font-medium text-white'>
                      Import APIs and collections
                    </h3>
                    <p className='text-xs text-white/70'>
                      Easily import your existing APIs, collections, files,
                      folders, cURL commands, raw text, or URLs
                    </p>
                  </div>
                </div>
                <button className='border border-white/20 px-3 py-2 text-xs text-white/80 transition-colors hover:border-white hover:bg-white/5 hover:text-white'>
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Discover what you can do section */}
        <div>
          <div className='mx-auto max-w-5xl pb-8'>
            <div className='mb-8'>
              <div>
                <h2 className='text-left text-base font-medium text-white'>
                  Discover what you can do in Plera
                </h2>
                <p className='mt-1 text-sm text-white/70'>
                  Explore the full potential of Plera with collection templates.
                </p>
              </div>
            </div>

            {/* Grid container */}
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
              {/* AI Sales Agent */}
              <div
                className='cursor-pointer border border-white/10 p-6 transition-colors hover:bg-white/5'
                onClick={() => router.push('/dashboard/ai-sales-agent')}
              >
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded bg-[#262626]'>
                  <Package className='h-4 w-4 text-white' />
                </div>
                <h3 className='mb-2 text-xs font-medium text-white'>
                  AI Sales Agent
                </h3>
                <p className='mb-4 text-xs text-white/70'>
                  Automate your sales outreach with intelligent AI-powered
                  agents.
                </p>
              </div>

              {/* Integration testing basics */}
              <div className='relative cursor-default border border-dashed border-white/20 p-6 opacity-70'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded bg-[#262626]'>
                  <Workflow className='h-4 w-4 text-white' />
                </div>
                <h3 className='mb-2 text-xs font-medium text-white'>
                  Integration testing basics
                </h3>
                <p className='mb-4 text-xs text-white/70'>
                  Verify if your APIs work as expected.
                </p>
                <div className='absolute top-2 right-2 rounded border border-orange-500/30 bg-orange-500/20 px-2 py-0.5 text-xs text-orange-300'>
                  Coming Soon
                </div>
              </div>

              {/* API documentation */}
              <div className='relative cursor-default border border-dashed border-white/20 p-6 opacity-70'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded bg-[#262626]'>
                  <FileText className='h-4 w-4 text-white' />
                </div>
                <h3 className='mb-2 text-xs font-medium text-white'>
                  API documentation
                </h3>
                <p className='mb-4 text-xs text-white/70'>
                  Create beautiful API documentation using Markdown.
                </p>
                <div className='absolute top-2 right-2 rounded border border-orange-500/30 bg-orange-500/20 px-2 py-0.5 text-xs text-orange-300'>
                  Coming Soon
                </div>
              </div>

              {/* API scenario testing */}
              <div className='relative cursor-default border border-dashed border-white/20 p-6 opacity-70'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded bg-[#262626]'>
                  <Code className='h-4 w-4 text-white' />
                </div>
                <h3 className='mb-2 text-xs font-medium text-white'>
                  API scenario testing
                </h3>
                <p className='mb-4 text-xs text-white/70'>
                  Test complex API workflows and scenarios.
                </p>
                <div className='absolute top-2 right-2 rounded border border-orange-500/30 bg-orange-500/20 px-2 py-0.5 text-xs text-orange-300'>
                  Coming Soon
                </div>
              </div>

              {/* Data visualization */}
              <div className='relative cursor-default border border-dashed border-white/20 p-6 opacity-70'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded bg-[#262626]'>
                  <BarChart3 className='h-4 w-4 text-white' />
                </div>
                <h3 className='mb-2 text-xs font-medium text-white'>
                  Data visualization
                </h3>
                <p className='mb-4 text-xs text-white/70'>
                  Visualize API response data with charts and graphs.
                </p>
                <div className='absolute top-2 right-2 rounded border border-orange-500/30 bg-orange-500/20 px-2 py-0.5 text-xs text-orange-300'>
                  Coming Soon
                </div>
              </div>

              {/* Authorization methods */}
              <div className='relative cursor-default border border-dashed border-white/20 p-6 opacity-70'>
                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded bg-[#262626]'>
                  <Lock className='h-4 w-4 text-white' />
                </div>
                <h3 className='mb-2 text-xs font-medium text-white'>
                  Authorization methods
                </h3>
                <p className='mb-4 text-xs text-white/70'>
                  Learn different ways to authenticate your API requests.
                </p>
                <div className='absolute top-2 right-2 rounded border border-orange-500/30 bg-orange-500/20 px-2 py-0.5 text-xs text-orange-300'>
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
