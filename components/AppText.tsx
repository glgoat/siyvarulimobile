import { Text, type TextProps } from 'react-native';
import { useTheme } from '@/providers/ThemeProvider';
import { translateText, useLanguage } from '@/providers/LanguageProvider';

export function AppText({ style, ...props }: TextProps) { const { palette } = useTheme(); const { language } = useLanguage(); const children = typeof props.children === 'string' ? translateText(props.children, language) : props.children; return <Text {...props} style={[{ color: palette.ink, fontFamily: 'System' }, style]}>{children}</Text>; }
