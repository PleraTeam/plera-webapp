import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { DashboardWrapper } from '@/components/layout/dashboard-wrapper';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import {
  ErrorBoundary,
  DashboardErrorFallback
} from '@/components/error-boundary';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Dashboard - Plera',
  description: 'Plera Dashboard - Scale Your Business Faster'
};

export default async function DashboardLayoutPage({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <DashboardWrapper>
      <ErrorBoundary fallback={DashboardErrorFallback}>
        <KBar>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <SidebarInset>
              <Header />
              {/* Dashboard content with navigation */}
              <main className='flex-1 space-y-4 p-4 md:p-6'>
                <DashboardLayout>{children}</DashboardLayout>
              </main>
            </SidebarInset>
          </SidebarProvider>
        </KBar>
      </ErrorBoundary>
    </DashboardWrapper>
  );
}
