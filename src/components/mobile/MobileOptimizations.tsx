
import { useEffect, useState } from 'react';
import { useSlowConnection } from '@/hooks/useSlowConnection';

interface MobileOptimizationsProps {
  children: React.ReactNode;
}

// Hook para detectar dispositivos móveis
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

// Componente para otimizações mobile
export function MobileOptimizations({ children }: MobileOptimizationsProps) {
  const isMobile = useIsMobile();
  const isSlowConnection = useSlowConnection();

  useEffect(() => {
    if (isMobile) {
      // Otimizações CSS para mobile
      const style = document.createElement('style');
      style.textContent = `
        /* Melhorar touch targets */
        button, a, [role="button"] {
          min-height: 44px !important;
          min-width: 44px !important;
        }
        
        /* Desabilitar hover em mobile */
        @media (hover: none) {
          .hover\\:scale-105:hover {
            transform: none !important;
          }
          .hover\\:shadow-md:hover {
            box-shadow: none !important;
          }
        }
        
        /* Otimizar animações para dispositivos lentos */
        ${isSlowConnection ? `
          * {
            animation-duration: 0.1s !important;
            transition-duration: 0.1s !important;
          }
        ` : ''}
        
        /* Melhorar scrolling */
        * {
          -webkit-overflow-scrolling: touch;
        }
        
        /* Reduzir motion para conexões lentas */
        ${isSlowConnection ? `
          @media (prefers-reduced-motion: no-preference) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        ` : ''}
      `;
      
      document.head.appendChild(style);
      
      // Configurar viewport para mobile
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes');
      }

      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isMobile, isSlowConnection]);

  useEffect(() => {
    // Preload DNS para melhor performance
    const preconnectLinks = [
      'https://lrnfshwotkvbiqkquqtm.supabase.co',
    ];

    preconnectLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      document.head.appendChild(link);
    });

    // Cleanup
    return () => {
      preconnectLinks.forEach(href => {
        const existing = document.querySelector(`link[href="${href}"]`);
        if (existing) {
          document.head.removeChild(existing);
        }
      });
    };
  }, []);

  return <>{children}</>;
}
