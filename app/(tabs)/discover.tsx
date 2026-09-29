import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { calculateAge } from '@/lib/helpers';
import { useAuth } from '@/providers/AuthProvider';
import type { DiscoveryProfile, Photo, Profile } from '@/types';
import { AppText } from '@/components/AppText';
import { EmptyState, ErrorState, LoadingState, Screen } from '@/components/Screen';
import { SwipeDeck } from '@/components/SwipeDeck';

export default function DiscoverScreen() {
  const router = useRouter();
  const { user, settings } = useAuth();
  const [profiles, setProfiles] = useState<DiscoveryProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastSwipe, setLastSwipe] = useState<{ profile: DiscoveryProfile; liked: boolean } | null>(null);
  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true); setError('');
    const [{ data: swipes, error: swipeError }, { data: blocks }, { data: matches }, { data: candidates, error: profileError }] = await Promise.all([
      supabase.from('likes').select('liked_id').eq('liker_id', user.id),
      supabase.from('blocks').select('blocker_id, blocked_id').or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`),
      supabase.from('matches').select('user1_id,user2_id').or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`),
      supabase.from('profiles').select('*').eq('profile_completed', true).eq('is_paused', false).eq('is_suspended', false).limit(60),
    ]);
    if (swipeError || profileError) { setError(swipeError?.message || profileError?.message || 'პროფილების ჩატვირთვა ვერ მოხერხდა.'); setLoading(false); return; }
    const excluded = new Set<string>([...(swipes || []).map((row) => row.liked_id), ...(matches || []).flatMap((row) => [row.user1_id, row.user2_id]), ...(blocks || []).map((row) => row.blocker_id === user.id ? row.blocked_id : row.blocker_id), user.id]);
    const visible = ((candidates || []) as Profile[]).filter((profile) => !excluded.has(profile.id)).filter((profile) => {
      const age = calculateAge(profile.date_of_birth); const min = settings?.discovery_age_min ?? 18; const max = settings?.discovery_age_max ?? 99; const city = settings?.discovery_city;
      return (age == null || (age >= min && age <= max)) && (!city || profile.city === city);
    });
    const ids = visible.map((profile) => profile.id);
    const { data: photos } = ids.length ? await supabase.from('photos').select('*').in('user_id', ids).order('position') : { data: [] as Photo[] };
    setProfiles(visible.map((profile) => ({ ...profile, age: calculateAge(profile.date_of_birth), photos: (photos || []).filter((photo) => photo.user_id === profile.id) })));
    setLoading(false);
  }, [user, settings]);
  useEffect(() => { void load(); }, [load]);
  async function swipe(profile: DiscoveryProfile, liked: boolean) {
    if (!user) return;
    const table = liked ? 'likes' : 'passes';
    const payload = liked ? { liker_id: user.id, liked_id: profile.id } : { passer_id: user.id, passed_id: profile.id };
    const { error: swipeError } = await supabase.from(table).insert(payload as never);
    if (swipeError && !swipeError.message.includes('duplicate')) Alert.alert('ვერ მოხერხდა', swipeError.message);
    else if (liked) {
      const { data: match } = await supabase.from('matches').select('id').or(`and(user1_id.eq.${user.id},user2_id.eq.${profile.id}),and(user1_id.eq.${profile.id},user2_id.eq.${user.id})`).maybeSingle();
      if (match) Alert.alert('მატჩი!', `შენ და ${profile.first_name} ერთმანეთს მოეწონეთ.`);
    }
    setProfiles((current) => current.filter((item) => item.id !== profile.id));
    setLastSwipe({ profile, liked });
  }
  async function undo() {
    if (!user || !lastSwipe) return;
    const table = lastSwipe.liked ? 'likes' : 'passes';
    const filter = lastSwipe.liked ? { liker_id: user.id, liked_id: lastSwipe.profile.id } : { passer_id: user.id, passed_id: lastSwipe.profile.id };
    await supabase.from(table).delete().match(filter);
    setProfiles((current) => [lastSwipe.profile, ...current]);
    setLastSwipe(null);
  }
  if (loading) return <LoadingState />;
  if (error) return <Screen scroll={false}><ErrorState message={error} /><Pressable onPress={load}><AppText style={styles.retry}>ხელახლა ცდა</AppText></Pressable></Screen>;
  return <Screen scroll={false}><View style={styles.header}><View><AppText style={styles.eyebrow}>siyvaruli.ge</AppText><AppText style={styles.title}>იპოვე შენი ადამიანი</AppText></View><Pressable onPress={() => router.push('/settings')}><Ionicons name="options-outline" size={25} color={colors.ink} /></Pressable></View>{profiles.length ? <><SwipeDeck profiles={profiles} onSwipe={swipe} onOpen={(profile) => router.push({ pathname: '/profile/[id]', params: { id: profile.id } })} /><View style={styles.actions}><Pressable disabled={!lastSwipe} onPress={() => void undo()} style={[styles.action, !lastSwipe && styles.disabled]}><Ionicons name="arrow-undo" size={24} color="#c69214" /></Pressable><Pressable onPress={() => void swipe(profiles[0], false)} style={styles.action}><Ionicons name="close" size={31} color={colors.muted} /></Pressable><Pressable onPress={() => void swipe(profiles[0], true)} style={[styles.action, styles.like]}><Ionicons name="heart" size={29} color={colors.white} /></Pressable></View><AppText style={styles.hint}>მარჯვნივ მოწონება · მარცხნივ გამოტოვება</AppText></> : <EmptyState title="ახალი პროფილები მალე გამოჩნდება" body="შეცვალე ფილტრები ან მოგვიანებით დაბრუნდი." />}</Screen>;
}
const styles = StyleSheet.create({ header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg }, eyebrow: { color: colors.rose, fontWeight: '800', fontSize: 14 }, title: { fontSize: 26, fontWeight: '800', marginTop: 3 }, actions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 14, marginTop: 20 }, action: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, elevation: 3 }, disabled: { opacity: 0.4 }, like: { backgroundColor: colors.rose, borderColor: colors.rose }, hint: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 12 }, retry: { color: colors.rose, textAlign: 'center', fontWeight: '700' } });
