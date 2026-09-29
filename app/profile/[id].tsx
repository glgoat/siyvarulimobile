import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { calculateAge, displayIntention } from '@/lib/helpers';
import type { Photo, Profile } from '@/types';
import { AppText } from '@/components/AppText';
import { LoadingState, Screen } from '@/components/Screen';

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const [profile, setProfile] = useState<Profile | null>(null); const [photos, setPhotos] = useState<Photo[]>([]);
  useEffect(() => { if (!id) return; Promise.all([supabase.from('profiles').select('*').eq('id', id).single(), supabase.from('photos').select('*').eq('user_id', id).order('position')]).then(([profileResult, photoResult]) => { setProfile(profileResult.data as Profile); setPhotos((photoResult.data || []) as Photo[]); }); }, [id]);
  if (!profile) return <LoadingState />;
  return <><Stack.Screen options={{ headerShown: true, title: profile.first_name, headerTintColor: colors.rose }} /><Screen><View style={styles.photoRow}>{photos.map((photo) => <Image key={photo.id} source={{ uri: photo.url }} style={styles.photo} />)}</View><AppText style={styles.name}>{profile.first_name}{calculateAge(profile.date_of_birth) ? ` ${calculateAge(profile.date_of_birth)}` : ''}</AppText><AppText style={styles.meta}>{profile.city}{profile.relationship_intention ? ` · ${displayIntention(profile.relationship_intention)}` : ''}</AppText>{profile.bio ? <AppText style={styles.bio}>{profile.bio}</AppText> : null}{profile.occupation ? <AppText style={styles.detail}>💼 {profile.occupation}</AppText> : null}{profile.education ? <AppText style={styles.detail}>🎓 {profile.education}</AppText> : null}</Screen></>;
}
const styles = StyleSheet.create({ photoRow: { flexDirection: 'row', gap: 8, overflow: 'hidden', marginBottom: spacing.lg }, photo: { width: 220, height: 320, borderRadius: 18, resizeMode: 'cover' }, name: { fontSize: 30, fontWeight: '800' }, meta: { color: colors.muted, marginTop: 6 }, bio: { fontSize: 16, lineHeight: 24, marginTop: spacing.lg }, detail: { fontSize: 15, marginTop: 13 } });
