'use client';

import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { DashboardWrapper } from '@/components/layout/dashboard-wrapper';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  ErrorBoundary,
  DashboardErrorFallback
} from '@/components/error-boundary';
import { usePathname } from 'next/navigation';

export default function DashboardLayoutPage({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAISalesAgentPage = pathname?.startsWith('/dashboard/ai-sales-agent');

  return (
    <DashboardWrapper>
      <ErrorBoundary fallback={DashboardErrorFallback}>
        <KBar>
          <Header />
          {!isAISalesAgentPage && <AppSidebar />}
          {/* Main content area with conditional left margin */}
          <main
            className={`${!isAISalesAgentPage ? 'ml-72' : ''} h-screen overflow-y-auto pt-10`}
          >
            {!isAISalesAgentPage ? (
              <DashboardLayout>{children}</DashboardLayout>
            ) : (
              children
            )}
          </main>
        </KBar>
      </ErrorBoundary>
    </DashboardWrapper>
  );
}
