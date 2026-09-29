import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/constants/theme';
import { calculateAge, displayIntention } from '@/lib/helpers';
import type { DiscoveryProfile } from '@/types';
import { AppText } from './AppText';

export function ProfileCard({ profile, onPress }: { profile: DiscoveryProfile; onPress?: () => void }) {
  const photo = profile.photos?.[0]?.url;
  const age = profile.age ?? calculateAge(profile.date_of_birth);
  return <Pressable onPress={onPress} style={styles.card}>
    {photo ? <Image source={{ uri: photo }} style={styles.photo} /> : <View style={[styles.photo, styles.fallback]}><Ionicons name="heart" size={58} color={colors.roseSoft} /></View>}
    <View style={styles.scrim} />
    <View style={styles.info}><View style={styles.nameRow}><AppText style={styles.name}>{profile.first_name || 'Siyvaruli'}</AppText>{age ? <AppText style={styles.age}>{age}</AppText> : null}{profile.is_verified ? <Ionicons name="checkmark-circle" size={22} color="#7dd3fc" /> : null}</View><View style={styles.meta}><Ionicons name="location-outline" size={15} color={colors.white} /><AppText style={styles.metaText}>{profile.city || 'საქართველო'}</AppText>{profile.relationship_intention ? <AppText style={styles.metaText}>· {displayIntention(profile.relationship_intention)}</AppText> : null}</View>{profile.bio ? <AppText numberOfLines={2} style={styles.bio}>{profile.bio}</AppText> : null}</View>
  </Pressable>;
}
const styles = StyleSheet.create({ card: { height: 500, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: '#302730', shadowColor: '#000', shadowOpacity: 0.16, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 7 }, photo: { ...StyleSheet.absoluteFill, width: '100%', height: '100%', resizeMode: 'cover' }, fallback: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.rose }, scrim: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(10, 5, 10, 0.12)' }, info: { position: 'absolute', left: 20, right: 20, bottom: 22 }, nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 }, name: { fontSize: 30, fontWeight: '800', color: colors.white }, age: { fontSize: 26, color: colors.white }, meta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 }, metaText: { color: colors.white, fontSize: 14 }, bio: { color: 'rgba(255,255,255,0.92)', fontSize: 15, lineHeight: 21, marginTop: 9 } });
