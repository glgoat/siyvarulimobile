import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';

export default function TabLayout() {
  const { session, loading } = useAuth();
  const { palette } = useTheme();
  if (loading) return null;
  if (!session) return <Redirect href="/auth" />;
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = { discover: 'sparkles-outline', likes: 'heart-outline', matches: 'people-outline', messages: 'chatbubbles-outline', profile: 'person-outline' };
  return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: palette.rose, tabBarInactiveTintColor: palette.muted, tabBarStyle: { height: 82, paddingTop: 8, borderTopColor: palette.line, backgroundColor: palette.surface }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }, tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name] || 'ellipse-outline'} size={size} color={color} /> })}>
    <Tabs.Screen name="discover" options={{ title: 'აღმოჩენა' }} />
    <Tabs.Screen name="likes" options={{ title: 'მოწონებები' }} />
    <Tabs.Screen name="matches" options={{ title: 'მატჩები' }} />
    <Tabs.Screen name="messages" options={{ title: 'შეტყობინებები' }} />
    <Tabs.Screen name="profile" options={{ title: 'პროფილი' }} />
  </Tabs>;
}
