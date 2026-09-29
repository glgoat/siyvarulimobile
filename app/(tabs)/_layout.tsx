import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useLanguage } from '@/providers/LanguageProvider';

export default function TabLayout() {
  const { session, loading } = useAuth();
  const { palette } = useTheme();
  const { language } = useLanguage();
  if (loading) return null;
  if (!session) return <Redirect href="/auth" />;
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = { discover: 'sparkles-outline', likes: 'heart-outline', matches: 'people-outline', messages: 'chatbubbles-outline', profile: 'person-outline' };
  return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: palette.rose, tabBarInactiveTintColor: palette.muted, tabBarStyle: { height: 82, paddingTop: 8, borderTopColor: palette.line, backgroundColor: palette.surface }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }, tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name] || 'ellipse-outline'} size={size} color={color} /> })}>
    <Tabs.Screen name="discover" options={{ title: language === 'en' ? 'Discover' : 'აღმოჩენა', popToTopOnBlur: true }} />
    <Tabs.Screen name="likes" options={{ title: language === 'en' ? 'Likes' : 'მოწონებები', popToTopOnBlur: true }} />
    <Tabs.Screen name="matches" options={{ title: language === 'en' ? 'Matches' : 'მატჩები', popToTopOnBlur: true }} />
    <Tabs.Screen name="messages" options={{ title: language === 'en' ? 'Messages' : 'შეტყობინებები', popToTopOnBlur: true }} />
    <Tabs.Screen name="profile" options={{ title: language === 'en' ? 'Profile' : 'პროფილი', popToTopOnBlur: true }} />
  </Tabs>;
}
