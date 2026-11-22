const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabaseClient = null;

function isSupabaseConfigured() {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_KEY && 
    !SUPABASE_URL.includes('your-project-id') &&
    !SUPABASE_KEY.includes('your-supabase')
  );
}

if (isSupabaseConfigured()) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('⚡ Connected to Supabase Cloud Database successfully.');
  } catch (error) {
    console.warn('⚠️ Could not initialize Supabase client:', error.message);
  }
} else {
  // Graceful fallback to file-backed database engine
  supabaseClient = null;
}

/**
 * Get the Supabase client instance or null
 */
function getSupabase() {
  return supabaseClient;
}

/**
 * Helper to sync local db records to Supabase when enabled
 */
async function syncToSupabase(table, record) {
  if (!supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient.from(table).upsert(record);
    if (error) console.error(`Supabase upsert error on table [${table}]:`, error);
    return data;
  } catch (err) {
    console.error(`Supabase sync failed on [${table}]:`, err);
    return null;
  }
}

module.exports = {
  isSupabaseConfigured,
  getSupabase,
  syncToSupabase,
  supabase: supabaseClient
};
