import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEMO_ADMIN_KEY = 'ner_admin_demo_session';
const DEMO_CITIZEN_KEY = 'ner_citizen_demo_session';

export const authService = {
  isSupabaseConfigured,

  /**
   * Sign up a new citizen user
   */
  async signUp(email, password, { name, phone = '', district = 'Shillong' }) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            name: name,
            phone: phone,
            district: district,
            role: 'Citizen',
            preferences: {
              sms: true,
              email: true,
              push: true,
              language: 'English',
            },
          },
        },
      });
      if (error) throw error;
      return data;
    }

    // Demo fallback sign up
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const citizenSession = {
      user: {
        id: 'citizen-' + Date.now().toString(36),
        email,
        user_metadata: {
          full_name: name || email.split('@')[0],
          name: name || email.split('@')[0],
          phone: phone || '',
          district: district || 'Shillong',
          role: 'Citizen',
          preferences: {
            sms: true,
            email: true,
            push: true,
            language: 'English',
          },
        },
      },
      access_token: 'mock-jwt-token-ner-citizen-' + Date.now(),
    };

    localStorage.setItem(DEMO_CITIZEN_KEY, JSON.stringify(citizenSession));
    window.dispatchEvent(new Event('auth-state-change'));
    return citizenSession;
  },

  /**
   * Sign in existing user (admin or citizen)
   */
  async signIn(email, password, role = 'auto') {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      const detectedRole = data.user?.user_metadata?.role || 
        (email.toLowerCase().includes('admin') || email.toLowerCase().includes('gov.in') ? 'Admin' : 'Citizen');
      return { ...data, role: detectedRole };
    }

    // Fallback demo authentication for immediate evaluation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const isCitizen = role === 'Citizen' || 
      (role !== 'Admin' && !email.toLowerCase().includes('admin') && !email.toLowerCase().includes('gov.in'));

    if (isCitizen) {
      const existing = localStorage.getItem(DEMO_CITIZEN_KEY);
      let sessionData;
      if (existing) {
        sessionData = JSON.parse(existing);
        sessionData.user.email = email;
      } else {
        sessionData = {
          user: {
            id: 'citizen-demo-001',
            email: email,
            user_metadata: {
              full_name: email.split('@')[0].replace(/[._]/g, ' ').toUpperCase() || 'Priya Sharma',
              name: email.split('@')[0].replace(/[._]/g, ' ').toUpperCase() || 'Priya Sharma',
              phone: '+91 98621 55432',
              district: 'Shillong',
              role: 'Citizen',
              preferences: {
                sms: true,
                email: true,
                push: true,
                language: 'English',
              },
            },
          },
          access_token: 'mock-jwt-token-ner-citizen',
        };
      }
      localStorage.setItem(DEMO_CITIZEN_KEY, JSON.stringify(sessionData));
      window.dispatchEvent(new Event('auth-state-change'));
      return { ...sessionData, role: 'Citizen' };
    }

    // Admin demo session
    const adminSession = {
      user: {
        id: 'demo-admin-uuid-001',
        email: email,
        user_metadata: {
          full_name: email.split('@')[0].replace(/[._]/g, ' ').toUpperCase() || 'Dr. Arindam Sarmah',
          role: 'Admin',
        },
      },
      access_token: 'mock-jwt-token-ner-dashboard',
    };

    localStorage.setItem(DEMO_ADMIN_KEY, JSON.stringify(adminSession));
    window.dispatchEvent(new Event('auth-state-change'));
    return { ...adminSession, role: 'Admin' };
  },

  /**
   * Sign out current session
   */
  async signOut(type = 'all') {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    if (type === 'all' || type === 'admin') {
      localStorage.removeItem(DEMO_ADMIN_KEY);
    }
    if (type === 'all' || type === 'citizen') {
      localStorage.removeItem(DEMO_CITIZEN_KEY);
    }
    window.dispatchEvent(new Event('auth-state-change'));
    return true;
  },

  /**
   * Get active session (prefers Supabase, then citizen, then admin)
   */
  async getSession(preferredRole = null) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('Supabase getSession error:', error.message);
        return null;
      }
      return data.session;
    }

    if (preferredRole === 'Citizen') {
      const citizen = localStorage.getItem(DEMO_CITIZEN_KEY);
      if (citizen) return JSON.parse(citizen);
    } else if (preferredRole === 'Admin') {
      const admin = localStorage.getItem(DEMO_ADMIN_KEY);
      if (admin) return JSON.parse(admin);
    }

    // Default fallback check: citizen session first if looking at citizen routes, else admin
    const citizen = localStorage.getItem(DEMO_CITIZEN_KEY);
    if (citizen) return JSON.parse(citizen);

    const admin = localStorage.getItem(DEMO_ADMIN_KEY);
    return admin ? JSON.parse(admin) : null;
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

  /**
   * Update Citizen profile data (name, phone, district, preferences)
   */
  async updateProfile(updates) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });
      if (error) throw error;
      return data.user;
    }

    // Demo fallback update
    const sessionStr = localStorage.getItem(DEMO_CITIZEN_KEY) || localStorage.getItem(DEMO_ADMIN_KEY);
    if (sessionStr) {
      const session = JSON.parse(sessionStr);
      session.user.user_metadata = {
        ...session.user.user_metadata,
        ...updates,
      };
      if (updates.name) session.user.user_metadata.full_name = updates.name;
      const key = localStorage.getItem(DEMO_CITIZEN_KEY) ? DEMO_CITIZEN_KEY : DEMO_ADMIN_KEY;
      localStorage.setItem(key, JSON.stringify(session));
      window.dispatchEvent(new Event('auth-state-change'));
      return session.user;
    }

    return null;
  },

  onAuthStateChange(callback) {
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
      });
      return () => subscription.unsubscribe();
    }

    const handler = () => {
      const session = JSON.parse(
        localStorage.getItem(DEMO_CITIZEN_KEY) || localStorage.getItem(DEMO_ADMIN_KEY) || 'null'
      );
      callback(session ? 'SIGNED_IN' : 'SIGNED_OUT', session);
    };

    window.addEventListener('auth-state-change', handler);
    return () => window.removeEventListener('auth-state-change', handler);
  }
};

export default authService;
