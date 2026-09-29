import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/constants/theme';
import { calculateAge, displayIntention } from '@/lib/helpers';
import type { DiscoveryProfile } from '@/types';
import { AppText } from './AppText';

export function ProfileCard({ profile, onPress }: { profile: DiscoveryProfile; onPress?: () => void }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = profile.photos || [];
  const photo = photos[photoIndex]?.url;
  const age = profile.age ?? calculateAge(profile.date_of_birth);
  function movePhoto(index: number) { setPhotoIndex(Math.max(0, Math.min(photos.length - 1, index))); }
  return <Pressable onPress={onPress} style={styles.card}>
    {photo ? <Image source={{ uri: photo }} style={styles.photo} /> : <View style={[styles.photo, styles.fallback]}><Ionicons name="heart" size={58} color={colors.roseSoft} /></View>}
    {photos.length > 1 && <><Pressable onPress={(event) => { event.stopPropagation(); movePhoto(photoIndex - 1); }} style={styles.previous} /><Pressable onPress={(event) => { event.stopPropagation(); movePhoto(photoIndex + 1); }} style={styles.next} /><View pointerEvents="none" style={styles.indicators}>{photos.map((item, index) => <View key={item.id} style={[styles.indicator, index === photoIndex && styles.activeIndicator]} />)}</View></>}
    <View style={styles.scrim} />
    <View style={styles.info}><View style={styles.nameRow}><AppText style={styles.name}>{profile.first_name || 'Siyvaruli'}</AppText>{age ? <AppText style={styles.age}>{age}</AppText> : null}{profile.is_verified ? <Ionicons name="checkmark-circle" size={22} color="#7dd3fc" /> : null}</View><View style={styles.meta}><Ionicons name="location-outline" size={15} color={colors.white} /><AppText style={styles.metaText}>{profile.city || 'საქართველო'}</AppText>{profile.relationship_intention ? <AppText style={styles.metaText}>· {displayIntention(profile.relationship_intention)}</AppText> : null}</View>{profile.bio ? <AppText numberOfLines={2} style={styles.bio}>{profile.bio}</AppText> : null}</View>
  </Pressable>;
}
const styles = StyleSheet.create({ card: { height: 500, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#302730', shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 7 }, photo: { ...StyleSheet.absoluteFill, width: '100%', height: '100%', resizeMode: 'cover' }, fallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.rose }, previous: { position: 'absolute', left: 0, top: 0, bottom: 70, width: '28%', zIndex: 3 }, next: { position: 'absolute', right: 0, top: 0, bottom: 70, width: '28%', zIndex: 3 }, indicators: { position: 'absolute', top: 12, left: 14, right: 14, flexDirection: 'row', gap: 4, zIndex: 4 }, indicator: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' }, activeIndicator: { backgroundColor: colors.white }, scrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(10, 5, 10, 0.12)' }, info: { position: 'absolute', left: 20, right: 20, bottom: 22 }, nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, name: { fontSize: 30, fontWeight: '800', color: colors.white }, age: { fontSize: 26, color: colors.white }, meta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }, metaText: { color: colors.white, fontSize: 14 }, bio: { color: 'rgba(255,255,255,0.92)', fontSize: 15, lineHeight: 21, marginTop: 9 } });
