
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

// Componente para proteger rotas que precisam de autenticação
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  console.log('🛡️ ProtectedRoute - User:', user?.email, 'Loading:', loading);
  
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
  
  if (!user) {
    console.log('🚨 ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Componente para redirecionar usuários autenticados
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  console.log('🌐 PublicRoute - User:', user?.email, 'Loading:', loading);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...

</p>
        </div>
      </div>
    );
  }
  
  if (user) {
    console.log('🏠 PublicRoute - User authenticated, redirecting to dashboard');
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
            
            {/* Demo page - public */}
            <Route path="/demo" element={<DemoPage />} />
            
            {/* Verification page */}
            <Route path="/verification" element={<VerificationPage />} />
            
            {/* Rotas públicas (redireciona se logado) */}
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
            
            {/* Rotas protegidas */}
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
            
            {/* Rotas públicas de perfil */}
            <Route path="/:username" element={<PublicPage />} />
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
