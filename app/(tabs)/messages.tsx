import { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import type { Match, Message, Profile } from '@/types';
import { AppText } from '@/components/AppText';
import { MatchCard } from '@/components/MatchCard';
import { EmptyState, ErrorState, LoadingState, Screen } from '@/components/Screen';

export default function MessagesScreen() {
  const router = useRouter(); const { user } = useAuth(); const [rows, setRows] = useState<Array<{ match: Match; profile: Profile; message?: Message }>>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const load = useCallback(async () => { if (!user) return; setLoading(true); const { data: matches, error: matchError } = await supabase.from('matches').select('*').or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`).order('created_at', { ascending: false }); const matchRows = (matches || []) as Match[]; const ids = matchRows.map((match) => match.user1_id === user.id ? match.user2_id : match.user1_id); const [{ data: profiles }, { data: messages }] = await Promise.all([ids.length ? supabase.from('profiles').select('*').in('id', ids) : Promise.resolve({ data: [] as Profile[] }), matchRows.length ? supabase.from('messages').select('*').in('match_id', matchRows.map((match) => match.id)).order('created_at', { ascending: false }) : Promise.resolve({ data: [] as Message[] })]); const mapped = matchRows.map((match) => ({ match, profile: (profiles || []).find((profile) => profile.id === (match.user1_id === user.id ? match.user2_id : match.user1_id)) as Profile | undefined, message: (messages || []).find((message) => message.match_id === match.id) as Message | undefined })); setRows(mapped.filter((item) => item.profile) as Array<{ match: Match; profile: Profile; message?: Message }>); if (matchError) setError(matchError.message); setLoading(false); }, [user]);
  useEffect(() => { void load(); }, [load]);
  if (loading) return <LoadingState />; if (error) return <ErrorState message={error} />;
  return <Screen><AppText style={styles.title}>შეტყობინებები</AppText><AppText style={styles.sub}>გააგრძელე ის საუბრები, რომლებიც შენთვის მნიშვნელოვანია.</AppText>{rows.length ? rows.map(({ match, profile, message }) => <MatchCard key={match.id} profile={profile} subtitle={message?.content || 'ახალი საუბარი'} onPress={() => router.push({ pathname: '/chat/[matchId]', params: { matchId: match.id, name: profile.first_name } })} />) : <EmptyState title="საუბრები ჯერ არ გაქვს" body="მატჩის შემდეგ აქ შეძლებ საუბრის დაწყებას." />}</Screen>;
}
const styles = StyleSheet.create({ title: { fontSize: 29, fontWeight: '800' }, sub: { color: colors.muted, marginTop: 5, marginBottom: 15, fontSize: 14 } });
