
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContextOptimized';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { LoadingSkeletonOptimized } from '@/components/ui/loading-skeleton-optimized';
import { MobileOptimizations } from '@/components/mobile/MobileOptimizations';

// Lazy load otimizado
const Index = lazy(() => import('@/pages/Index'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const VerificationPage = lazy(() => import('@/pages/VerificationPage'));
const DashboardOptimized = lazy(() => import('@/components/dashboard/DashboardOptimized').then(m => ({ default: m.DashboardOptimized })));
const PublicPageOptimized = lazy(() => import('@/pages/PublicPageOptimized'));
const UpgradePage = lazy(() => import('@/pages/UpgradePage'));
const DemoPage = lazy(() => import('@/pages/DemoPage'));
const OfflinePage = lazy(() => import('@/pages/OfflinePage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// QueryClient otimizado
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MobileOptimizations>
          <Router>
            <div className="App">
              <Suspense fallback={<LoadingSkeletonOptimized type="minimal" />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/verify" element={<VerificationPage />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardOptimized />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/upgrade" element={<UpgradePage />} />
                  <Route path="/demo" element={<DemoPage />} />
                  <Route path="/offline" element={<OfflinePage />} />
                  <Route path="/:username" element={<PublicPageOptimized />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
            </div>
          </Router>
        </MobileOptimizations>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
