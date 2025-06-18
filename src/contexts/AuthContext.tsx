
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  theme: string;
  is_verified: boolean;
  role: string;
  plan?: string;
  plan_expires?: string;
  stripe_customer_id?: string;
  subscription_id?: string;
  is_founder?: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: string }>;
  isMasterAdmin: () => boolean;
  isMaiconRocha: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// IDs dos administradores master - Maicon Rocha
const MAICON_IDS = [
  '14e72f7f-759d-426a-9573-5ef6f5afaf35', // ID antigo
  'bb2d39b1-7a98-4ea3-aff2-ee2523cb485b'  // ID novo
];

const MAICON_EMAILS = [
  'maicons.rocha@hotmail.com',
  'maiconrochadsb@gmail.com'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔄 AuthProvider: Inicializando autenticação...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        setError(null);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            await fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      if (sessionError) {
        console.error('❌ Erro ao obter sessão:', sessionError);
        setError('Erro ao verificar sessão existente');
      }
      
      console.log('📋 Sessão existente:', session?.user?.email || 'Nenhuma');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('👤 Buscando perfil para:', userId);
      
      const timeoutId = setTimeout(() => {
        console.warn('⚠️ Timeout ao buscar perfil, continuando sem perfil');
        setProfile(null);
        setLoading(false);
      }, 10000);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      clearTimeout(timeoutId);

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
        
        // Se é um dos Maicons, criar perfil de emergência
        if (MAICON_IDS.includes(userId)) {
          console.log('🛡️ Criando perfil de emergência para Maicon');
          const emergencyProfile: Profile = {
            id: userId,
            name: 'Maicon Rocha',
            username: 'maicon',
            theme: 'default',
            is_verified: true,
            role: 'master_admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          setProfile(emergencyProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
        return;
      }

      console.log('✅ Perfil carregado:', data.name, '- Role:', data.role);
      setProfile(data);
      setLoading(false);
    } catch (error) {
      console.error('❌ Erro inesperado ao buscar perfil:', error);
      setProfile(null);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Tentando login para:', email);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Erro no login:', error.message);
        return { error: error.message };
      }

      console.log('✅ Login realizado com sucesso:', data.user?.email);
      return {};
    } catch (error) {
      console.error('❌ Erro inesperado no login:', error);
      return { error: 'Erro inesperado ao fazer login' };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('📝 Tentando cadastro para:', email);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('❌ Erro no cadastro:', error.message);
        return { error: error.message };
      }

      console.log('✅ Cadastro realizado com sucesso:', data.user?.email);
      return {};
    } catch (error) {
      console.error('❌ Erro inesperado no cadastro:', error);
      return { error: 'Erro inesperado ao criar conta' };
    }
  };

  const signOut = async () => {
    console.log('🚪 Fazendo logout...');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Erro no logout:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive"
      });
    } else {
      console.log('✅ Logout realizado com sucesso');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Usuário não autenticado' };

    try {
      console.log('✏️ Atualizando perfil:', updates);
      
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Erro ao atualizar perfil:', error);
        return { error: error.message };
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
      
      console.log('✅ Perfil atualizado com sucesso');
      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
      
      return {};
    } catch (error) {
      console.error('❌ Erro inesperado ao atualizar perfil:', error);
      return { error: 'Erro inesperado ao atualizar perfil' };
    }
  };

  const isMasterAdmin = () => {
    return profile?.role === 'master_admin' || isMaiconRocha();
  };

  const isMaiconRocha = () => {
    return MAICON_IDS.includes(user?.id || '') || MAICON_EMAILS.includes(user?.email || '');
  };

  const value = {
    user,
    profile,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isMasterAdmin,
    isMaiconRocha
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
