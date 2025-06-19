
import React, { createContext, useContext, useEffect, useState } from 'react';
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
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('🔄 Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Error fetching profile:', error);
        throw error;
      }
      
      console.log('✅ Profile fetched successfully:', data?.username);
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching profile:', err);
      setError('Erro ao carregar perfil');
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Attempting sign in for:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
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
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      console.log('📝 Attempting sign up for:', email);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name },
          emailRedirectTo: window.location.origin
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
    } finally {
      setLoading(false);
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

      // Update local profile state
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
      
      setUser(null);
      setProfile(null);
      setError(null);
      console.log('✅ Sign out successful');
    } catch (err) {
      console.error('❌ Sign out error:', err);
      setError(err instanceof Error ? err.message : 'Error signing out');
    }
  };

  const isMasterAdmin = () => {
    return profile?.role === 'master_admin' || profile?.is_admin === true;
  };

  const isMaiconRocha = () => {
    return user?.email === 'maicon@thiagomatos.com.br' || user?.email === 'maiconrochadsb@gmail.com';
  };

  useEffect(() => {
    let mounted = true;
    
    console.log('🚀 AuthProvider initialized');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          setError('Erro ao verificar sessão');
        } else if (session?.user && mounted) {
          console.log('✅ Initial session found:', session.user.email);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          console.log('ℹ️ No initial session found');
        }
      } catch (err) {
        console.error('❌ Unexpected session error:', err);
        setError('Erro inesperado ao verificar sessão');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('🔄 Auth state changed:', event, session?.user?.email || 'no user');
      
      try {
        if (session?.user) {
          setUser(session.user);
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            await fetchProfile(session.user.id);
          }
        } else {
          setUser(null);
          setProfile(null);
          setError(null);
        }
      } catch (err) {
        console.error('❌ Error in auth state change:', err);
        setError('Erro ao processar mudança de autenticação');
      } finally {
        setLoading(false);
      }
    });

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    error,
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
