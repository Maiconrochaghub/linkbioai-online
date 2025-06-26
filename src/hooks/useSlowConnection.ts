
import { useState, useEffect } from 'react';

export function useSlowConnection() {
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // Função para detectar conexão lenta
    const checkConnection = () => {
      // Verificar Network Information API
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        
        const slowConnections = ['slow-2g', '2g'];
        const moderateConnections = ['3g'];
        
        const isSlow = slowConnections.includes(connection.effectiveType) || 
                      connection.downlink < 1.0;
        const isModerate = moderateConnections.includes(connection.effectiveType) ||
                          (connection.downlink >= 1.0 && connection.downlink < 2.0);
        
        setIsSlowConnection(isSlow || isModerate);
        
        console.log('📶 Connection type:', connection.effectiveType, 'Downlink:', connection.downlink, 'Slow:', isSlow || isModerate);
        
        return;
      }

      // Fallback: teste de velocidade simples
      const startTime = performance.now();
      const testImage = new Image();
      
      testImage.onload = () => {
        const loadTime = performance.now() - startTime;
        const isSlow = loadTime > 800; // Reduzido de 1000ms
        setIsSlowConnection(isSlow);
        console.log('📶 Connection test:', loadTime + 'ms', 'Slow:', isSlow);
      };
      
      testImage.onerror = () => {
        setIsSlowConnection(true);
        console.log('📶 Connection test failed, assuming slow');
      };
      
      // Imagem pequena de teste (1x1 pixel)
      testImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    };

    // Verificar imediatamente
    checkConnection();

    // Configurar listener para mudanças de conexão
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', checkConnection);
      
      return () => {
        connection.removeEventListener('change', checkConnection);
      };
    }

    // Verificar periodicamente como fallback
    const interval = setInterval(checkConnection, 30000); // A cada 30s
    
    return () => clearInterval(interval);
  }, []);

  return isSlowConnection;
}
