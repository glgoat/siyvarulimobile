import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/theme';

type Theme = 'light' | 'dark';
type ThemeValue = { theme: Theme; dark: boolean; toggleTheme: () => void; palette: typeof colors };
const ThemeContext = createContext<ThemeValue>({ theme: 'light', dark: false, toggleTheme: () => {}, palette: colors });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => { AsyncStorage.getItem('siyvaruli-theme').then((value) => { if (value === 'dark' || value === 'light') setTheme(value); }); }, []);
  const toggleTheme = () => setTheme((current) => { const next = current === 'light' ? 'dark' : 'light'; void AsyncStorage.setItem('siyvaruli-theme', next); return next; });
  const palette = useMemo(() => theme === 'dark' ? { ...colors, ink: '#fff8f6', muted: '#b7adb0', paper: '#151216', surface: '#211b20', line: '#3b3035', roseSoft: '#512632' } : colors, [theme]);
  return <ThemeContext.Provider value={{ theme, dark: theme === 'dark', toggleTheme, palette }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
