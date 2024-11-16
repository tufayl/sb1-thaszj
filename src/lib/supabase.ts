import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Validate configuration
const isValidConfig = Boolean(supabaseUrl && supabaseAnonKey);

// Debug configuration issues
const debugSupabaseConfig = () => {
  console.log('Supabase Configuration Status:', {
    hasUrl: Boolean(supabaseUrl),
    urlValue: supabaseUrl?.substring(0, 10) + '...',
    hasKey: Boolean(supabaseAnonKey),
    keyValue: supabaseAnonKey?.substring(0, 10) + '...',
    isValidConfig
  });
};

// Create client only if configuration is valid
export const supabase = isValidConfig 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'architect-auth-token',
        flowType: 'pkce'
      }
    })
  : null;

// Helper to check if Supabase is properly configured
export const isSupabaseEnabled = () => {
  debugSupabaseConfig();
  return isValidConfig && Boolean(supabase);
};

// Validate Supabase connection and user session
export const validateSupabaseConnection = async () => {
  if (!supabase) {
    return {
      success: false,
      error: 'Supabase client not initialized'
    };
  }

  try {
    // First check if we have a valid session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    // Then try to access the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role')
      .limit(1);

    if (error) throw error;
    
    return {
      success: true,
      data: {
        hasSession: Boolean(session),
        canAccessDB: Boolean(data)
      }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      details: {
        code: error.code,
        hint: error.hint
      }
    };
  }
};