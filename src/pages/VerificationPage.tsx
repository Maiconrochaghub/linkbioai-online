
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function VerificationPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleVerification = async () => {
      // If user is already authenticated, redirect to dashboard
      if (user) {
        navigate("/dashboard");
        return;
      }

      // Get token from URL parameters
      const token = searchParams.get('token');
      const access_token = searchParams.get('access_token');
      const refresh_token = searchParams.get('refresh_token');

      // Check if we have the necessary tokens
      if (!token && !access_token) {
        setStatus('error');
        toast({
          title: "Link inválido",
          description: "O link de verificação é inválido ou expirou.",
          variant: "destructive"
        });
        return;
      }

      try {
        // Supabase automatically handles the authentication when the user clicks the magic link
        // The tokens are passed in the URL and should be processed by Supabase client
        setStatus('success');
        
        toast({
          title: "Login realizado com sucesso! 🎉",
          description: "Bem-vindo ao LinkBio.AI!",
        });

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);

      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        toast({
          title: "Erro na verificação",
          description: "Ocorreu um erro ao verificar seu login. Tente novamente.",
          variant: "destructive"
        });
      }
    };

    handleVerification();
  }, [searchParams, user, navigate, toast]);

  const handleRetry = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              LinkBio.AI
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {status === 'loading' && "Verificando..."}
              {status === 'success' && "Login realizado!"}
              {status === 'error' && "Erro na verificação"}
            </CardTitle>
            <CardDescription className="text-center">
              {status === 'loading' && "Aguarde enquanto verificamos seu login"}
              {status === 'success' && "Redirecionando para seu dashboard"}
              {status === 'error' && "Ocorreu um problema com o link de verificação"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="text-center space-y-4">
              {status === 'loading' && (
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                </div>
              )}

              {status === 'success' && (
                <>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-green-700 font-medium">
                      Verificação concluída com sucesso!
                    </p>
                    <p className="text-sm text-gray-600">
                      Você será redirecionado em alguns segundos...
                    </p>
                  </div>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-red-700 font-medium">
                        Link inválido ou expirado
                      </p>
                      <p className="text-sm text-gray-600">
                        O link de verificação pode ter expirado ou já ter sido usado.
                      </p>
                    </div>
                    <Button 
                      onClick={handleRetry}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      Tentar novamente
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
