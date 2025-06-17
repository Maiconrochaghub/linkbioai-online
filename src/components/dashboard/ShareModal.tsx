
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Download, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from 'react-qr-code';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
}

export function ShareModal({ open, onOpenChange, username }: ShareModalProps) {
  const [showQRCode, setShowQRCode] = useState(false);
  const { toast } = useToast();
  
  const pageUrl = `https://linkbio.ai/${username}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      toast({
        title: "Link copiado!",
        description: "O link da sua página foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link.",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `qr-code-${username}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Share2 className="w-5 h-5 mr-2 text-purple-600" />
            Compartilhar Página
          </DialogTitle>
          <DialogDescription>
            Compartilhe sua página de links com outras pessoas
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* URL Section */}
          <div className="space-y-2">
            <Label htmlFor="page-url">Link da sua página</Label>
            <div className="flex space-x-2">
              <Input
                id="page-url"
                value={pageUrl}
                readOnly
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={copyToClipboard}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>QR Code</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQRCode(!showQRCode)}
              >
                <QrCode className="w-4 h-4 mr-2" />
                {showQRCode ? 'Ocultar' : 'Mostrar'} QR Code
              </Button>
            </div>

            {showQRCode && (
              <div className="flex flex-col items-center space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <QRCode
                    id="qr-code-svg"
                    value={pageUrl}
                    size={200}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadQRCode}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar PNG
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  Escaneie este código com a câmera do celular para acessar sua página
                </p>
              </div>
            )}
          </div>

          {/* Social Sharing Buttons */}
          <div className="space-y-2">
            <Label>Compartilhar em redes sociais</Label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Confira minha página de links: ${pageUrl}`)}`)}
                className="flex-1"
              >
                WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Confira minha página de links: ${pageUrl}`)}`)}
                className="flex-1"
              >
                Twitter
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
