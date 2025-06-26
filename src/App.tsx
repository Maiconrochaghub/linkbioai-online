
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load otimizado com preload
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

// QueryClient otimizado para mobile
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000, // 2 minutos
      gcTime: 5 * 60 * 1000, // 5 minutos (renamed from cacheTime)
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 1; // Reduzido para 1 retry
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});

// Loading otimizado para mobile
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm w-full">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto">
          <span className="text-white font-bold text-sm sm:text-lg">L</span>
        </div>
        <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Suspense fallback={<PageSkeleton />}>
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
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
