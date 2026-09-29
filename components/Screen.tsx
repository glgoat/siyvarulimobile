import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, type ScrollViewProps, type ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/constants/theme';
import { AppText } from './AppText';

export function Screen({ children, scroll = true, ...props }: { children: React.ReactNode; scroll?: boolean } & ViewProps) {
  const body = scroll ? <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>{children}</ScrollView> : children;
  return <SafeAreaView style={styles.safe}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><View {...props} style={[styles.flex, props.style]}>{body}</View></KeyboardAvoidingView></SafeAreaView>;
}
export function LoadingState() { return <View style={styles.center}><ActivityIndicator color={colors.rose} size="large" /></View>; }
export function EmptyState({ title, body }: { title: string; body: string }) { return <View style={styles.empty}><AppText style={styles.emptyTitle}>{title}</AppText><AppText style={styles.emptyBody}>{body}</AppText></View>; }
export function ErrorState({ message }: { message: string }) { return <View style={styles.empty}><AppText style={styles.emptyTitle}>რაღაც შეფერხდა</AppText><AppText style={styles.emptyBody}>{message}</AppText></View>; }
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.paper }, flex: { flex: 1 }, content: { padding: spacing.md, paddingBottom: 42 }, center: { flex: 1, minHeight: 300, alignItems: 'center', justifyContent: 'center' }, empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 70, paddingHorizontal: 28 }, emptyTitle: { fontSize: 21, fontWeight: '700', marginBottom: 8, textAlign: 'center' }, emptyBody: { fontSize: 15, lineHeight: 23, color: colors.muted, textAlign: 'center' } });
