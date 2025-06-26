
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  theme: string;
  is_verified?: boolean;
  role?: string;
  plan: string;
  plan_expires?: string;
  stripe_customer_id?: string;
  subscription_id?: string;
  is_founder: boolean;
  is_admin: boolean;
  button_color?: string;
  text_color?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
  isMasterAdmin: () => boolean;
  isMaiconRocha: () => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Refs para controle de estado e evitar loops
  const mountedRef = useRef(true);
  const fetchingProfileRef = useRef(false);
  const profileCacheRef = useRef<{ [key: string]: Profile }>({});
  const initializingRef = useRef(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Função de fetch de perfil otimizada
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    if (!mountedRef.current || fetchingProfileRef.current) {
      return null;
    }

    // Verificar cache primeiro
    if (profileCacheRef.current[userId]) {
      console.log('✅ Using cached profile for:', userId);
      setProfile(profileCacheRef.current[userId]);
      return profileCacheRef.current[userId];
    }

    fetchingProfileRef.current = true;
    
    try {
      console.log('🔄 Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        return null;
      }
      
      if (data && mountedRef.current) {
        console.log('✅ Profile fetched successfully:', data.username);
        profileCacheRef.current[userId] = data;
        setProfile(data);
        return data;
      }
      
      return null;
    } catch (err) {
      console.error('❌ Unexpected error fetching profile:', err);
      return null;
    } finally {
      fetchingProfileRef.current = false;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      // Limpar cache para forçar refresh
      delete profileCacheRef.current[user.id];
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error.message);
        return { error: error.message };
      }

      console.log('✅ Sign in successful');
      return { error: null };
    } catch (err) {
      console.error('❌ Unexpected sign in error:', err);
      return { error: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('📝 Attempting sign up for:', email);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/verify`
        }
      });
      
      if (error) {
        console.error('❌ Sign up error:', error.message);
        return { error: error.message };
      }
      
      console.log('✅ Sign up successful');
      return { error: null };
    } catch (err) {
      console.error('❌ Unexpected sign up error:', err);
      return { error: err instanceof Error ? err.message : 'Erro desconhecido' };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    try {
      console.log('🔄 Updating profile:', updates);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Profile update error:', error);
        return { error: error.message };
      }

      // Atualizar cache e estado local
      const updatedProfile = profile ? { ...profile, ...updates } : null;
      if (updatedProfile) {
        profileCacheRef.current[user.id] = updatedProfile;
        setProfile(updatedProfile);
      }
      
      console.log('✅ Profile updated successfully');
      return { error: null };
    } catch (err) {
      console.error('❌ Unexpected profile update error:', err);
      return { error: err instanceof Error ? err.message : 'Erro ao atualizar perfil' };
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Limpar todo o estado
      setUser(null);
      setSession(null);
      setProfile(null);
      profileCacheRef.current = {};
      
      console.log('✅ Sign out successful');
    } catch (err) {
      console.error('❌ Sign out error:', err);
    }
  };

  const isMasterAdmin = useCallback(() => {
    return profile?.role === 'master_admin' || profile?.is_admin === true;
  }, [profile]);

  const isMaiconRocha = useCallback(() => {
    return user?.email === 'maicon@thiagomatos.com.br' || user?.email === 'maiconrochadsb@gmail.com';
  }, [user]);

  // Inicialização principal do contexto
  useEffect(() => {
    if (initializingRef.current) return;
    
    initializingRef.current = true;
    console.log('🚀 AuthProvider initializing...');

    // Timeout de segurança para evitar loading infinito
    loadingTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current && loading) {
        console.warn('⚠️ Loading timeout reached, forcing completion');
        setLoading(false);
      }
    }, 10000); // 10 segundos

    const initializeAuth = async () => {
      try {
        // Primeiro: configurar listener para mudanças de auth
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mountedRef.current) return;
          
          console.log('🔄 Auth state changed:', event, newSession?.user?.id || 'no user');
          
          // Atualizar estados básicos imediatamente
          setSession(newSession);
          setUser(newSession?.user || null);
          
          // Buscar perfil apenas para eventos específicos
          if (newSession?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
            // Usar setTimeout para não bloquear o callback
            setTimeout(() => {
              if (mountedRef.current) {
                fetchProfile(newSession.user.id);
              }
            }, 100);
          } else if (!newSession?.user) {
            // Limpar perfil se não há usuário
            setProfile(null);
            profileCacheRef.current = {};
          }
          
          // Completar loading se ainda estiver carregando
          if (mountedRef.current && loading) {
            setLoading(false);
          }
        });

        // Segundo: verificar sessão existente
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mountedRef.current) {
          if (currentSession?.user) {
            console.log('✅ Initial session found for:', currentSession.user.email);
            setSession(currentSession);
            setUser(currentSession.user);
            
            // Buscar perfil para sessão inicial
            setTimeout(() => {
              if (mountedRef.current) {
                fetchProfile(currentSession.user.id);
              }
            }, 100);
          } else {
            console.log('ℹ️ No initial session found');
          }
          
          // Sempre completar loading após verificar sessão
          setLoading(false);
        }

        // Cleanup function
        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('❌ Auth initialization error:', err);
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();

    return () => {
      mountedRef.current = false;
      initializingRef.current = false;
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, []); // Array de dependência vazio para executar apenas uma vez

  // Loading screen simplificado - sem gradients complexos para melhor performance
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold">L</span>
          </div>
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isMasterAdmin,
    isMaiconRocha,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
