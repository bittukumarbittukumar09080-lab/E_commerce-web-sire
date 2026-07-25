import { createClient } from '@supabase/supabase-js';

const meta = import.meta as any;

const SUPABASE_URL = 
  meta.env?.VITE_SUPABASE_URL || 
  'https://qajvraejccvodszunczs.supabase.co';

const SUPABASE_ANON_KEY = 
  meta.env?.VITE_SUPABASE_ANON_KEY || 
  'sb_publishable_cdKrN0dytpZ_yxZ_gwUVtg_uE9j89ho';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

