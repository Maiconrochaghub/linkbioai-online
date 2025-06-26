
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
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
      return data;
    } catch (err) {
      console.error('❌ Error fetching profile:', err);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  }, [user, fetchProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in for:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error.message);
        setLoading(false);
        return { error: error.message };
      }

      console.log('✅ Sign in successful, user:', data.user?.email);
      // Loading será gerenciado pelo onAuthStateChange
      return { error: null };
    } catch (err) {
      console.error('❌ Unexpected sign in error:', err);
      setLoading(false);
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
          data: { name: name },
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
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setLoading(false);
      console.log('✅ Sign out successful');
    } catch (err) {
      console.error('❌ Sign out error:', err);
      setLoading(false);
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
        // Primeiro, configurar o listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (!mounted) return;
          
          console.log('🔄 Auth state changed:', event, session?.user?.email || 'no user');
          
          if (session?.user) {
            console.log('📊 Setting user state:', session.user.email);
            setUser(session.user);
            
            // Buscar perfil apenas quando necessário
            if (event === 'SIGNED_IN' || (event === 'TOKEN_REFRESHED' && !profile)) {
              console.log('🔄 Fetching profile after auth event:', event);
              const profileData = await fetchProfile(session.user.id);
              if (mounted) {
                setProfile(profileData);
              }
            }
          } else {
            console.log('🚫 No user, clearing state');
            setUser(null);
            setProfile(null);
          }
          
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
        });

        // Depois, verificar sessão existente
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('✅ Initial session found:', session.user.email);
          setUser(session.user);
          
          // Buscar perfil para sessão inicial
          const profileData = await fetchProfile(session.user.id);
          if (mounted) {
            setProfile(profileData);
            setLoading(false);
            setInitialized(true);
          }
        } else {
          console.log('ℹ️ No initial session found');
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
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
  }, [fetchProfile, profile]);

  // Não renderizar até estar inicializado
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
