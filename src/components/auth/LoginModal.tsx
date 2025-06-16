
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LoginModal({ open, onOpenChange, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, insira seu email.",
        variant: "destructive"
      });
      return;
    }

    if (!email.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setEmailSent(true);
      setIsLoading(false);
      
      toast({
        title: "Link de acesso enviado! 📧",
        description: "Verifique seu email e clique no link para entrar.",
      });
    }, 1500);
  };

  const handleResetForm = () => {
    setEmailSent(false);
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Fazer Login
          </DialogTitle>
          <DialogDescription>
            {emailSent 
              ? "Link de acesso enviado para seu email"
              : "Enviaremos um link mágico para seu email"
            }
          </DialogDescription>
        </DialogHeader>
        
        {!emailSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando link...
                </>
              ) : (
                <>
                  Enviar Link Mágico
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Enviamos um link de acesso para:
              </p>
              <p className="font-medium text-gray-900">{email}</p>
            </div>

            <div className="space-y-2">
              <Button 
                onClick={handleResetForm}
                variant="outline" 
                className="w-full"
              >
                Usar outro email
              </Button>
              
              <Button 
                onClick={() => onOpenChange(false)}
                variant="ghost" 
                className="w-full text-gray-600"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}

        {!emailSent && (
          <div className="text-center text-sm text-gray-600">
            Não tem conta?{" "}
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Criar conta grátis
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
