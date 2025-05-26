'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console for development
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Here you could log to an error reporting service like Sentry
    // Example: logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <Card className='mx-auto mt-8 w-full max-w-2xl'>
      <CardHeader>
        <CardTitle className='text-destructive flex items-center gap-2'>
          <AlertTriangle className='h-5 w-5' />
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>
            An unexpected error occurred. Please try refreshing the page or
            contact support if the problem persists.
          </AlertDescription>
        </Alert>

        {isDevelopment && (
          <Card>
            <CardHeader>
              <CardTitle className='text-sm'>
                Error Details (Development)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className='bg-muted max-h-40 overflow-auto rounded p-3 text-xs'>
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </CardContent>
          </Card>
        )}

        <div className='flex justify-center gap-2'>
          <Button onClick={resetError} variant='outline'>
            <RefreshCw className='mr-2 h-4 w-4' />
            Try Again
          </Button>
          <Button onClick={() => window.location.reload()} variant='default'>
            Refresh Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Dashboard-specific error fallback
export function DashboardErrorFallback({
  error,
  resetError
}: ErrorFallbackProps) {
  return (
    <div className='space-y-6'>
      <Alert variant='destructive'>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription className='flex items-center justify-between'>
          <span>Failed to load dashboard data: {error.message}</span>
          <Button variant='outline' size='sm' onClick={resetError}>
            <RefreshCw className='mr-2 h-4 w-4' />
            Retry
          </Button>
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className='pt-6'>
          <div className='space-y-4 text-center'>
            <AlertTriangle className='text-muted-foreground mx-auto h-12 w-12' />
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold'>Dashboard Unavailable</h3>
              <p className='text-muted-foreground'>
                We&apos;re having trouble loading your dashboard. This could be
                a temporary issue.
              </p>
            </div>
            <div className='flex justify-center gap-2'>
              <Button onClick={resetError} variant='outline'>
                Try Again
              </Button>
              <Button onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
