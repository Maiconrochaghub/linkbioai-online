
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface PlanInfo {
  isPro: boolean;
  maxLinks: number;
  isFounder: boolean;
  isAdmin: boolean;
  canUpgrade: boolean;
  founderCount: number;
  plan: string;
  planExpires: string | null;
}

export const usePlan = () => {
  const { user, profile } = useAuth();
  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    isPro: false,
    maxLinks: 10, // Updated from 5 to 10
    isFounder: false,
    isAdmin: false,
    canUpgrade: true,
    founderCount: 0,
    plan: 'free',
    planExpires: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanInfo = async () => {
      if (!profile) {
        setLoading(false);
        return;
      }

      try {
        // Get founder count
        const { data: founderCount, error: founderError } = await supabase.rpc('get_founder_count');
        if (founderError) {
          console.error('Error fetching founder count:', founderError);
        }

        // Check if can still be founder
        const { data: canBeFounder, error: canBeFounderError } = await supabase.rpc('can_be_founder');
        if (canBeFounderError) {
          console.error('Error checking founder eligibility:', canBeFounderError);
        }

        const isPro = profile.plan === 'pro' || profile.is_admin === true;
        const isFounder = profile.is_founder || false;
        const isAdmin = profile.is_admin || false;

        setPlanInfo({
          isPro,
          maxLinks: isPro ? Infinity : 10, // Updated from 5 to 10
          isFounder,
          isAdmin,
          canUpgrade: canBeFounder !== false && !isPro,
          founderCount: founderCount || 0,
          plan: profile.plan || 'free',
          planExpires: profile.plan_expires || null
        });
      } catch (error) {
        console.error('Error fetching plan info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlanInfo();
  }, [profile]);

  const createCheckoutSession = async () => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('Creating checkout session...');
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Checkout error: ${error.message || 'Unknown error'}`);
      }

      if (!data?.url) {
        console.error('No checkout URL returned:', data);
        throw new Error('No checkout URL received from server');
      }
      
      console.log('Checkout session created successfully:', data);
      
      // Open Stripe checkout in current tab
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Founder offer is no longer available')) {
          throw new Error('A oferta de Fundador atingiu o limite de 10.000 usuários.');
        } else if (error.message.includes('Authentication error')) {
          throw new Error('Erro de autenticação. Faça login novamente.');
        } else if (error.message.includes('STRIPE_SECRET_KEY')) {
          throw new Error('Configuração do Stripe não encontrada. Tente novamente mais tarde.');
        } else {
          throw new Error(`Erro no checkout: ${error.message}`);
        }
      }
      
      throw new Error('Erro desconhecido no checkout. Tente novamente.');
    }
  };

  const openCustomerPortal = async () => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        }
      });

      if (error) throw error;
      
      // Open customer portal in new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
  };

  return {
    ...planInfo,
    loading,
    createCheckoutSession,
    openCustomerPortal
  };
};

