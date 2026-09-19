import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEMO_USER_KEY = 'ner_admin_demo_session';

export const authService = {
  isSupabaseConfigured,

  async signIn(email, password) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    }

    // Fallback demo authentication for immediate evaluation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Default mock admin check or accept any valid email in demo mode
    const demoSession = {
      user: {
        id: 'demo-admin-uuid-001',
        email: email,
        user_metadata: {
          full_name: email.split('@')[0].replace('.', ' ').toUpperCase() || 'Dr. Arindam Sarmah',
          role: 'Admin',
        },
      },
      access_token: 'mock-jwt-token-ner-dashboard',
    };

    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoSession));
    window.dispatchEvent(new Event('auth-state-change'));
    return demoSession;
  },

  async signOut() {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    localStorage.removeItem(DEMO_USER_KEY);
    window.dispatchEvent(new Event('auth-state-change'));
    return true;
  },

  async getSession() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('Supabase getSession error:', error.message);
        return null;
      }
      return data.session;
    }

    const saved = localStorage.getItem(DEMO_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  async getCurrentUser() {
    if (isSupabaseConfigured && supabase) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return user;
    }

    const session = await this.getSession();
    return session ? session.user : null;
  },

  onAuthStateChange(callback) {
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
      });
      return () => subscription.unsubscribe();
    }

    const handler = () => {
      const session = JSON.parse(localStorage.getItem(DEMO_USER_KEY) || 'null');
      callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
    };

    window.addEventListener('auth-state-change', handler);
    return () => window.removeEventListener('auth-state-change', handler);
  }
};

export default authService;
