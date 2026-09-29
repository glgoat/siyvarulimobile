import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import type { Profile } from '@/types';
import { AppText } from './AppText';
import { UserAvatar } from './UserAvatar';

export function MatchCard({ profile, subtitle, onPress }: { profile: Profile; subtitle?: string; onPress: () => void }) { return <Pressable onPress={onPress} style={styles.row}><UserAvatar name={profile.first_name} size={60} /><View style={styles.copy}><AppText style={styles.name}>{profile.first_name}</AppText><AppText numberOfLines={1} style={styles.subtitle}>{subtitle || profile.city || 'საქართველო'}</AppText></View></Pressable>; }
const styles = StyleSheet.create({ row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line }, copy: { flex: 1, marginLeft: spacing.md }, name: { fontSize: 17, fontWeight: '700' }, subtitle: { color: colors.muted, fontSize: 14, marginTop: 4 } });
