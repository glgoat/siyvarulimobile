import { ActivityIndicator, Pressable, StyleSheet, type PressableProps, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { AppText } from './AppText';
import { useTheme } from '@/providers/ThemeProvider';

export function PrimaryButton({ title, loading, variant = 'primary', style, ...props }: PressableProps & { title: string; loading?: boolean; variant?: 'primary' | 'ghost' | 'soft'; style?: ViewStyle }) {
  const { palette } = useTheme(); return <Pressable {...props} style={({ pressed }) => [styles.base, styles[variant], variant === 'ghost' && { borderColor: palette.line }, variant === 'soft' && { backgroundColor: palette.roseSoft }, pressed && { opacity: 0.82 }, style]}><AppText style={[styles.label, variant !== 'primary' && { color: palette.rose }]}>{loading ? <ActivityIndicator color={variant === 'primary' ? palette.white : palette.rose} /> : title}</AppText></Pressable>;
}
const styles = StyleSheet.create({ base: { minHeight: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg }, primary: { backgroundColor: colors.rose }, ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.line }, soft: { backgroundColor: colors.roseSoft }, label: { color: colors.white, fontSize: 16, fontWeight: '700' }, ghostLabel: { color: colors.rose } });
