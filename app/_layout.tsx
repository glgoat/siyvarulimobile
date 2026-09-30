import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';

export default function RootLayout() {
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><ThemeProvider><LanguageProvider><AuthProvider><StatusBar style="auto" /><Stack screenOptions={{ headerShown: false }}><Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} /></Stack></AuthProvider></LanguageProvider></ThemeProvider></SafeAreaProvider></GestureHandlerRootView>;
}
