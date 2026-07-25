import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://qajvraejccvodszunczs.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_cdKrN0dytpZ_yxZ_gwUVtg_uE9j89ho';

export const supabaseServer = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: false
  }
});

export const SUPABASE_CONFIG = {
  projectId: 'qajvraejccvodszunczs',
  url: SUPABASE_URL,
  apiKey: SUPABASE_KEY
};

// Helper function to safely insert or update data to Supabase
export async function syncToSupabase(tableName: string, data: any) {
  try {
    const { data: result, error } = await supabaseServer
      .from(tableName)
      .upsert(data, { onConflict: 'id' });
      
    if (error) {
      console.warn(`[Supabase Sync Warning] Table '${tableName}': ${error.message} (code: ${error.code})`);
      return { success: false, error };
    }
    return { success: true, result };
  } catch (err: any) {
    console.error(`[Supabase Error] ${tableName}:`, err?.message || err);
    return { success: false, error: err };
  }
}

// Helper to fetch table data from Supabase
export async function fetchFromSupabase(tableName: string) {
  try {
    const { data, error } = await supabaseServer
      .from(tableName)
      .select('*');
      
    if (error) {
      console.warn(`[Supabase Fetch Warning] Table '${tableName}': ${error.message}`);
      return null;
    }
    return data;
  } catch (err: any) {
    console.error(`[Supabase Fetch Error] ${tableName}:`, err?.message || err);
    return null;
  }
}
