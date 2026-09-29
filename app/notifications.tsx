import { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import type { Notification } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';

const iconByType: Record<Notification['type'], keyof typeof Ionicons.glyphMap> = { match: 'heart', message: 'chatbubble', like: 'thumbs-up', verification: 'shield-checkmark', report: 'flag', account: 'checkmark-circle' };

export default function NotificationsScreen() {
  const router = useRouter(); const { user } = useAuth(); const [items, setItems] = useState<Notification[]>([]); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { if (!user) return; const { data, error } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50); if (error) Alert.alert('შეტყობინებები ვერ ჩაიტვირთა', error.message); setItems((data || []) as Notification[]); setLoading(false); }, [user]);
  useEffect(() => { void load(); }, [load]);
  async function markAllRead() { if (!user) return; await supabase.from('notifications').update({ read: true, read_at: new Date().toISOString() }).eq('user_id', user.id).eq('read', false); setItems((current) => current.map((item) => ({ ...item, read: true }))); }
  async function open(item: Notification) { if (!item.read) { await supabase.from('notifications').update({ read: true, read_at: new Date().toISOString() }).eq('id', item.id); setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, read: true } : entry)); } const matchId = typeof item.data?.match_id === 'string' ? item.data.match_id : null; if ((item.type === 'match' || item.type === 'message') && matchId) router.push(`/chat/${matchId}`); else if (item.type === 'like') router.push('/(tabs)/likes'); }
  return <><Stack.Screen options={{ headerShown: true, title: 'შეტყობინებები', headerTintColor: colors.rose }} /><Screen><View style={styles.heading}><AppText style={styles.title}>შეტყობინებები</AppText>{items.some((item) => !item.read) && <Pressable onPress={markAllRead}><AppText style={styles.mark}>ყველას წაკითხვა</AppText></Pressable>}</View>{loading ? <AppText style={styles.empty}>იტვირთება...</AppText> : items.length === 0 ? <View style={styles.emptyWrap}><Ionicons name="notifications-off-outline" size={36} color={colors.muted} /><AppText style={styles.empty}>ჯერ შეტყობინებები არ გაქვს.</AppText></View> : <View style={styles.list}>{items.map((item) => <Pressable key={item.id} onPress={() => void open(item)} style={[styles.item, !item.read && styles.unread]}><View style={styles.icon}><Ionicons name={iconByType[item.type]} size={19} color={colors.rose} /></View><View style={styles.copy}><AppText style={[styles.itemTitle, !item.read && styles.bold]}>{item.title || 'siyvaruli.ge'}</AppText>{item.body ? <AppText style={styles.body}>{item.body}</AppText> : null}<AppText style={styles.date}>{new Date(item.created_at).toLocaleDateString('ka-GE')}</AppText></View>{!item.read && <View style={styles.dot} />}</Pressable>)}</View>}</Screen></>;
}

const styles = StyleSheet.create({ heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }, title: { fontSize: 28, fontWeight: '800' }, mark: { color: colors.rose, fontWeight: '700', fontSize: 13 }, list: { gap: 8 }, item: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, padding: 13, borderRadius: radius.md, backgroundColor: colors.surface }, unread: { backgroundColor: colors.roseSoft }, icon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.roseSoft, alignItems: 'center', justifyContent: 'center' }, copy: { flex: 1 }, itemTitle: { fontSize: 14 }, bold: { fontWeight: '800' }, body: { color: colors.muted, marginTop: 3, lineHeight: 20 }, date: { color: colors.muted, fontSize: 11, marginTop: 5 }, dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.rose, marginTop: 7 }, emptyWrap: { alignItems: 'center', gap: 10, paddingTop: 80 }, empty: { color: colors.muted, textAlign: 'center' } });
