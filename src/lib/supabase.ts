import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseDisponivel = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = (supabaseDisponivel
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: true } })
  : null) as SupabaseClient;