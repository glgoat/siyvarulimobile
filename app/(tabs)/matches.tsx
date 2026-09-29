import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import type { Match, Profile } from '@/types';
import { AppText } from '@/components/AppText';
import { MatchCard } from '@/components/MatchCard';
import { EmptyState, ErrorState, LoadingState, Screen } from '@/components/Screen';

export default function MatchesScreen() {
  const router = useRouter(); const { user } = useAuth(); const [matches, setMatches] = useState<Array<{ match: Match; profile: Profile }>>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { if (!user) return; setLoading(true); const { data, error: matchError } = await supabase.from('matches').select('*').or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`).order('created_at', { ascending: false }); const rows = (data || []) as Match[]; const ids = rows.map((match) => match.user1_id === user.id ? match.user2_id : match.user1_id); const { data: profiles } = ids.length ? await supabase.from('profiles').select('*').in('id', ids) : { data: [] as Profile[] }; setMatches(rows.map((match) => ({ match, profile: (profiles || []).find((profile) => profile.id === (match.user1_id === user.id ? match.user2_id : match.user1_id)) })).filter((item): item is { match: Match; profile: Profile } => Boolean(item.profile))); if (matchError) setError(matchError.message); setLoading(false); }, [user]);
  useEffect(() => { void load(); }, [load]);
  if (loading) return <LoadingState />; if (error) return <ErrorState message={error} />;
  return <Screen><AppText style={styles.title}>მატჩები</AppText><AppText style={styles.sub}>ურთიერთმოწონებები, რომლებსაც გაგრძელება შეუძლია.</AppText>{matches.length ? matches.map(({ match, profile }) => <MatchCard key={match.id} profile={profile} subtitle="დაიწყე საუბარი" onPress={() => router.push({ pathname: '/chat/[matchId]', params: { matchId: match.id, name: profile.first_name } })} />) : <EmptyState title="ჯერ მატჩები არ გაქვს" body="მოიწონე ის, ვინც დაგაინტერესებს." />}</Screen>;
}
const styles = StyleSheet.create({ title: { fontSize: 29, fontWeight: '800' }, sub: { color: colors.muted, marginTop: 5, marginBottom: 15, fontSize: 14 } });
