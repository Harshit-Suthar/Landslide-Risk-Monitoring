const { createClient } = require('@supabase/supabase-js');
const config = require('./env');

if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
  console.warn(
    '[Supabase Config] WARNING: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured in .env. Database operations will fail until valid credentials are provided.'
  );
}

// Server-side Supabase client using the SERVICE ROLE key
// This client bypasses RLS when needed and must NEVER be exposed to the browser/client.
const supabase = createClient(
  config.supabaseUrl || 'https://placeholder.supabase.co',
  config.supabaseServiceRoleKey || 'placeholder-service-role-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

module.exports = supabase;
