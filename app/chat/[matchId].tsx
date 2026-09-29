import { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { colors, spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import type { Message } from '@/types';
import { ChatInput } from '@/components/ChatInput';
import { MessageBubble } from '@/components/MessageBubble';
import { LoadingState } from '@/components/Screen';

export default function ChatScreen() {
  const { matchId, name } = useLocalSearchParams<{ matchId: string; name?: string }>(); const { user } = useAuth(); const [messages, setMessages] = useState<Message[]>([]); const [input, setInput] = useState(''); const [loading, setLoading] = useState(true); const list = useRef<FlatList<Message>>(null);
  useEffect(() => { if (!matchId || !user) return; let mounted = true; supabase.from('messages').select('*').eq('match_id', matchId).is('deleted_at', null).order('created_at', { ascending: true }).then(({ data }) => { if (mounted) setMessages((data || []) as Message[]); setLoading(false); }); const channel = supabase.channel(`mobile-chat-${matchId}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` }, (payload) => setMessages((current) => current.some((message) => message.id === payload.new.id) ? current : [...current, payload.new as Message])).subscribe(); return () => { mounted = false; void supabase.removeChannel(channel); }; }, [matchId, user]);
  async function send() { const content = input.trim(); if (!content || !user || !matchId) return; setInput(''); const { error } = await supabase.from('messages').insert({ match_id: matchId, sender_id: user.id, content }); if (error) { setInput(content); Alert.alert('ვერ გაიგზავნა', error.message); } }
  if (loading) return <LoadingState />;
  return <View style={styles.root}><Stack.Screen options={{ headerShown: true, title: name || 'საუბარი', headerTintColor: colors.rose }} /><FlatList ref={list} data={messages} keyExtractor={(message) => message.id} contentContainerStyle={styles.list} renderItem={({ item }) => <MessageBubble message={item} own={item.sender_id === user?.id} />} onContentSizeChange={() => list.current?.scrollToEnd({ animated: false })} /><ChatInput value={input} onChangeText={setInput} onSend={send} disabled={!input.trim()} /></View>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.paper }, list: { padding: spacing.md, paddingBottom: 20 } });
