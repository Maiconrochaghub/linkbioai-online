
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  
  console.log('🛡️ ProtectedRoute - user:', !!user, 'loading:', loading);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto" />
          <div className="space-y-2">
            <p className="text-gray-600 text-lg font-medium">Verificando autenticação...</p>
            <p className="text-gray-500 text-sm">Carregando seu painel...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    console.log('🛡️ ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('✅ ProtectedRoute - User authenticated, rendering children');
  return <>{children}</>;
}
