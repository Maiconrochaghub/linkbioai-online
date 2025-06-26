
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
  const [initialized, setInitialized] = useState(false);
  
  // Refs para evitar loops infinitos
  const fetchingProfile = useRef(false);
  const lastProfileFetch = useRef<string | null>(null);

  // Cache de perfil para evitar re-fetches desnecessários
  const fetchProfile = useCallback(async (userId: string, force = false) => {
    // Evitar fetch duplo
    if (fetchingProfile.current && !force) {
      console.log('⏭️ Profile fetch already in progress');
      return profile;
    }
    
    // Evitar fetch se já foi feito para este user recentemente
    if (lastProfileFetch.current === userId && !force && profile) {
      console.log('⏭️ Profile already fetched for user:', userId);
      return profile;
    }

    fetchingProfile.current = true;
    
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
      
      console.log('✅ Profile fetched successfully:', data?.username);
      lastProfileFetch.current = userId;
      setProfile(data);
      return data;
    } catch (err) {
      console.error('❌ Error fetching profile:', err);
      return null;
    } finally {
      fetchingProfile.current = false;
    }
  }, [profile]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id, true);
    }
  }, [user, fetchProfile]);

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

      setProfile(prev => prev ? { ...prev, ...updates } : null);
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
      
      // Limpar estado
      setUser(null);
      setSession(null);
      setProfile(null);
      lastProfileFetch.current = null;
      
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

  useEffect(() => {
    console.log('🚀 AuthProvider initializing...');
    
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Configurar listener otimizado
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return;
          
          console.log('🔄 Auth state changed:', event);
          
          setSession(newSession);
          
          if (newSession?.user) {
            setUser(newSession.user);
            
            // Só buscar perfil em eventos específicos e se não estiver já buscando
            if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && !fetchingProfile.current) {
              // Usar setTimeout para evitar bloquear o callback
              setTimeout(() => {
                if (mounted) {
                  fetchProfile(newSession.user.id);
                }
              }, 0);
            }
          } else {
            setUser(null);
            setProfile(null);
            lastProfileFetch.current = null;
          }
          
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
        });

        // Verificar sessão existente
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user && mounted) {
          console.log('✅ Initial session found');
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Buscar perfil para sessão inicial
          setTimeout(() => {
            if (mounted) {
              fetchProfile(currentSession.user.id);
            }
          }, 0);
        }

        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('❌ Unexpected session error:', err);
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [fetchProfile]);

  // Loading simplificado
  if (!initialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold">L</span>
          </div>
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
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
