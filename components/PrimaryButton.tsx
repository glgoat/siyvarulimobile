import { ActivityIndicator, Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from './AppText';

export function PrimaryButton({ title, loading, variant = 'primary', style, ...props }: PressableProps & { title: string; loading?: boolean; variant?: 'primary' | 'ghost' | 'soft'; style?: ViewStyle }) {
  return <Pressable {...props} style={({ pressed }) => [styles.base, styles[variant], pressed && { opacity: 0.82 }, style]}><AppText style={[styles.label, variant === 'ghost' && styles.ghostLabel]}>{loading ? <ActivityIndicator color={variant === 'primary' ? colors.white : colors.rose} /> : title}</AppText></Pressable>;
}
const styles = StyleSheet.create({ base: { minHeight: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }, primary: { backgroundColor: colors.rose }, ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line }, soft: { backgroundColor: colors.roseSoft }, label: { color: colors.white, fontSize: 16, fontWeight: '700' }, ghostLabel: { color: colors.rose } });
