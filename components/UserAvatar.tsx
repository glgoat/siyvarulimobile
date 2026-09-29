import { Image, StyleSheet, View } from 'react-native';
import { colors, radius } from '@/constants/theme';
import { AppText } from './AppText';
import { useTheme } from '@/providers/ThemeProvider';

export function UserAvatar({ uri, name, size = 54 }: { uri?: string | null; name?: string; size?: number }) { const { palette } = useTheme(); return <View style={[styles.wrap, { backgroundColor: palette.roseSoft, width: size, height: size, borderRadius: size / 2 }]}>{uri ? <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} /> : <AppText style={{ color: palette.rose, fontSize: size * 0.38, fontWeight: '800' }}>{name?.slice(0, 1)?.toUpperCase() || 'S'}</AppText>}</View>; }
const styles = StyleSheet.create({ wrap: { backgroundColor: colors.roseSoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' } });
