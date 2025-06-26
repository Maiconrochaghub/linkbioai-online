
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PublicPage from "./pages/PublicPage";
import NotFound from "./pages/NotFound";
import DemoPage from "./pages/DemoPage";
import VerificationPage from "./pages/VerificationPage";
import { Dashboard } from "./components/dashboard/Dashboard";
import UpgradePage from "./pages/UpgradePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  
  console.log('🛡️ ProtectedRoute state:', { 
    hasUser: !!user, 
    hasProfile: !!profile, 
    loading, 
    userEmail: user?.email 
  });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  // Aguardar tanto user quanto profile antes de renderizar
  if (!user || !profile) {
    console.log('🔄 Redirecting to login - missing user or profile');
    return <Navigate to="/login" replace />;
  }
  
  console.log('✅ ProtectedRoute - user authenticated, rendering children');
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  console.log('🌐 PublicRoute state:', { 
    hasUser: !!user, 
    loading, 
    userEmail: user?.email 
  });
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }
  
  if (user) {
    console.log('🔄 PublicRoute - user authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
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
            
            <Route path="/:username" element={<PublicPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
