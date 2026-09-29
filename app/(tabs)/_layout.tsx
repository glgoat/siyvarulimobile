import { Redirect, Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useLanguage } from '@/providers/LanguageProvider';

export default function TabLayout() {
  const { session, loading } = useAuth();
  const { palette } = useTheme();
  const { language } = useLanguage();
  const router = useRouter();
  if (loading) return null;
  if (!session) return <Redirect href="/auth" />;
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = { discover: 'sparkles-outline', likes: 'heart-outline', matches: 'people-outline', messages: 'chatbubbles-outline', profile: 'person-outline' };
  return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: palette.rose, tabBarInactiveTintColor: palette.muted, tabBarStyle: { height: 82, paddingTop: 8, borderTopColor: palette.line, backgroundColor: palette.surface }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }, tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name] || 'ellipse-outline'} size={size} color={color} /> })}>
    <Tabs.Screen name="discover" listeners={{ tabPress: () => router.replace('/(tabs)/discover') }} options={{ title: language === 'en' ? 'Discover' : 'აღმოჩენა', popToTopOnBlur: true }} />
    <Tabs.Screen name="likes" listeners={{ tabPress: () => router.replace('/(tabs)/likes') }} options={{ title: language === 'en' ? 'Likes' : 'მოწონებები', popToTopOnBlur: true }} />
    <Tabs.Screen name="matches" listeners={{ tabPress: () => router.replace('/(tabs)/matches') }} options={{ title: language === 'en' ? 'Matches' : 'მატჩები', popToTopOnBlur: true }} />
    <Tabs.Screen name="messages" listeners={{ tabPress: () => router.replace('/(tabs)/messages') }} options={{ title: language === 'en' ? 'Messages' : 'შეტყობინებები', popToTopOnBlur: true }} />
    <Tabs.Screen name="profile" listeners={{ tabPress: () => router.replace('/(tabs)/profile') }} options={{ title: language === 'en' ? 'Profile' : 'პროფილი', popToTopOnBlur: true }} />
  </Tabs>;
}
