import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Profile, UserSettings } from '@/types';

type AuthValue = { session: Session | null; user: User | null; profile: Profile | null; settings: UserSettings | null; loading: boolean; refresh: () => Promise<void>; signOut: () => Promise<void> };
const AuthContext = createContext<AuthValue>({ session: null, user: null, profile: null, settings: null, loading: true, refresh: async () => {}, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const user = session?.user ?? null;

  const refresh = useCallback(async () => {
    if (!user) { setProfile(null); setSettings(null); return; }
    const [{ data: nextProfile }, { data: nextSettings }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('user_settings').select('*').eq('user_id', user.id).maybeSingle(),
    ]);
    setProfile(nextProfile as Profile | null);
    setSettings(nextSettings as UserSettings | null);
  }, [user]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession) { setProfile(null); setSettings(null); }
      setLoading(false);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  useEffect(() => { if (user) void refresh(); }, [user, refresh]);
  const signOut = useCallback(async () => { await supabase.auth.signOut(); setSession(null); setProfile(null); setSettings(null); }, []);
  return <AuthContext.Provider value={{ session, user, profile, settings, loading, refresh, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
