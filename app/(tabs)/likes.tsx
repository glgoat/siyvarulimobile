import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import type { Profile } from '@/types';
import { AppText } from '@/components/AppText';
import { MatchCard } from '@/components/MatchCard';
import { EmptyState, ErrorState, LoadingState, Screen } from '@/components/Screen';

export default function LikesScreen() {
  const router = useRouter(); const { user } = useAuth(); const [profiles, setProfiles] = useState<Profile[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { if (!user) return; setLoading(true); const { data: likes, error: likesError } = await supabase.from('likes').select('liker_id').eq('liked_id', user.id).order('created_at', { ascending: false }); const ids = (likes || []).map((like) => like.liker_id); if (likesError) setError(likesError.message); else if (ids.length) { const { data } = await supabase.from('profiles').select('*').in('id', ids); setProfiles((data || []) as Profile[]); } else setProfiles([]); setLoading(false); }, [user]);
  useEffect(() => { void load(); }, [load]);
  if (loading) return <LoadingState />; if (error) return <ErrorState message={error} />;
  return <Screen><AppText style={styles.title}>მოწონებები</AppText><AppText style={styles.sub}>ადამიანები, რომლებმაც შენ მოგიწონეს.</AppText>{profiles.length ? profiles.map((profile) => <MatchCard key={profile.id} profile={profile} onPress={() => router.push({ pathname: '/profile/[id]', params: { id: profile.id } })} />) : <EmptyState title="ჯერ არავინ გამოჩენილა" body="შენი ახალი მოწონებები აქ გამოჩნდება." />}</Screen>;
}
const styles = StyleSheet.create({ title: { fontSize: 29, fontWeight: '800' }, sub: { color: colors.muted, marginTop: 5, marginBottom: 15, fontSize: 14 } });
