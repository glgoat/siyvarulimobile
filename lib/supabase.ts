import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

function getProductionConfig(): { url: string; key: string } {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
  const key = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY)?.trim();
  if (!url || !key) {
    throw new Error('Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY (or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY) to siyvaruli-mobile/.env, then restart Expo.');
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('EXPO_PUBLIC_SUPABASE_URL must be a valid HTTPS URL.');
  }
  if (parsed.protocol !== 'https:' || parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1' || parsed.hostname.includes('placeholder')) {
    throw new Error('EXPO_PUBLIC_SUPABASE_URL must point to the production Supabase project, not a local or placeholder host.');
  }
  return { url, key };
}

const { url, key } = getProductionConfig();

const storage = Platform.OS === 'web' && typeof window === 'undefined' ? undefined : AsyncStorage;

export const supabase = createClient(url, key, {
  auth: { storage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false, flowType: 'pkce' },
  realtime: { params: { eventsPerSecond: 10 } },
});
