// Base API service utility
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const api = {
  supabase,
  isConfigured: isSupabaseConfigured,
  
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }
};

export default api;
