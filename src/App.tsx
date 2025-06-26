
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicRoute } from "./components/auth/PublicRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PublicPage from "./pages/PublicPage";
import PublicPageOptimized from "./pages/PublicPageOptimized";
import NotFound from "./pages/NotFound";
import DemoPage from "./pages/DemoPage";
import VerificationPage from "./pages/VerificationPage";
import { Dashboard } from "./components/dashboard/Dashboard";
import UpgradePage from "./pages/UpgradePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Retry network errors up to 2 times
        if (failureCount < 2 && error?.message?.includes('fetch')) {
          return true;
        }
        return false;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaced cacheTime)
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/verification" element={<VerificationPage />} />
              
              <Route path="/login" element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/upgrade" element={
                <ProtectedRoute>
                  <UpgradePage />
                </ProtectedRoute>
              } />
              
              {/* Use optimized version for public pages */}
              <Route path="/:username" element={<PublicPageOptimized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
