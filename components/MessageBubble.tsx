import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';
import { formatTime } from '@/lib/helpers';
import type { Message } from '@/types';
import { AppText } from './AppText';

export function MessageBubble({ message, own }: { message: Message; own: boolean }) { return <View style={[styles.wrap, own ? styles.ownWrap : styles.otherWrap]}><View style={[styles.bubble, own ? styles.own : styles.other]}><AppText style={own ? styles.ownText : undefined}>{message.content}</AppText><AppText style={[styles.time, own && styles.ownTime]}>{formatTime(message.created_at)}</AppText></View></View>; }
const styles = StyleSheet.create({ wrap: { marginVertical: 4, flexDirection: 'row' }, ownWrap: { justifyContent: 'flex-end' }, otherWrap: { justifyContent: 'flex-start' }, bubble: { maxWidth: '82%', borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 10 }, own: { backgroundColor: colors.rose, borderBottomRightRadius: 4 }, other: { backgroundColor: colors.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.line }, ownText: { color: colors.white }, time: { color: colors.muted, fontSize: 10, marginTop: 4, textAlign: 'right' }, ownTime: { color: 'rgba(255,255,255,0.75)' } });
