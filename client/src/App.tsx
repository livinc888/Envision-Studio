import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MarketingHome } from './pages/MarketingHome';
import { DashboardOverview } from './pages/DashboardOverview';
import { ProjectsListPage } from './pages/ProjectsListPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { useLenis } from './hooks/useLenis';
import { CustomCursor } from './components/common/CustomCursor';
import { GlobalGrain } from './components/common/GlobalGrain';
import { ToastProvider } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ScrollToTop } from './components/common/ScrollToTop';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const AppRoutes: React.FC = () => {
  // Enables smooth scroll on marketing routes only
  useLenis();

  return (
    <>
      <ScrollToTop />
      <GlobalGrain />
      <CustomCursor />
      <Routes>
        {/* Marketing Site */}
        <Route path="/" element={<MarketingHome />} />

        {/* Dashboard Web App */}
        <Route path="/app" element={<DashboardOverview />} />
        <Route path="/app/projects" element={<ProjectsListPage />} />
        <Route path="/app/projects/:id" element={<ProjectDetailPage />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
