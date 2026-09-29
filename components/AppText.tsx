import { Text, type TextProps } from 'react-native';
import { colors } from '@/constants/theme';
import { useTheme } from '@/providers/ThemeProvider';

export function AppText({ style, ...props }: TextProps) { const { palette } = useTheme(); return <Text {...props} style={[{ color: palette.ink, fontFamily: 'System' }, style]} />; }
