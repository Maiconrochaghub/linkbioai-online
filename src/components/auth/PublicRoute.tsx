
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuth();
  
  console.log('🌐 PublicRoute - user:', !!user, 'loading:', loading);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto" />
          <div className="space-y-2">
            <p className="text-gray-600 text-lg font-medium">Carregando...</p>
            <p className="text-gray-500 text-sm">Verificando seu acesso...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (user) {
    console.log('🌐 PublicRoute - User authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log('✅ PublicRoute - No user, rendering children');
  return <>{children}</>;
}
