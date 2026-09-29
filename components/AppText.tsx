import { Text, type TextProps } from 'react-native';
import { colors } from '@/constants/theme';

export function AppText({ style, ...props }: TextProps) { return <Text {...props} style={[{ color: colors.ink, fontFamily: 'System' }, style]} />; }
