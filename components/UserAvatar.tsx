import { Image, StyleSheet, View } from 'react-native';
import { colors, radius } from '@/constants/theme';
import { AppText } from './AppText';

export function UserAvatar({ uri, name, size = 54 }: { uri?: string | null; name?: string; size?: number }) { return <View style={[styles.wrap, { width: size, height: size, borderRadius: size / 2 }]}>{uri ? <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} /> : <AppText style={{ color: colors.rose, fontSize: size * 0.38, fontWeight: '800' }}>{name?.slice(0, 1)?.toUpperCase() || 'S'}</AppText>}</View>; }
const styles = StyleSheet.create({ wrap: { backgroundColor: colors.roseSoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } });
