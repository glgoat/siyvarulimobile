import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { useAuth } from '@/providers/AuthProvider';

export default function TabLayout() {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Redirect href="/auth" />;
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = { discover: 'sparkles-outline', likes: 'heart-outline', matches: 'people-outline', messages: 'chatbubbles-outline', profile: 'person-outline' };
  return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.rose, tabBarInactiveTintColor: colors.muted, tabBarStyle: { height: 82, paddingTop: 8, borderTopColor: colors.line, backgroundColor: colors.surface }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' }, tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name] || 'ellipse-outline'} size={size} color={color} /> })}>
    <Tabs.Screen name="discover" options={{ title: 'აღმოჩენა' }} />
    <Tabs.Screen name="likes" options={{ title: 'მოწონებები' }} />
    <Tabs.Screen name="matches" options={{ title: 'მატჩები' }} />
    <Tabs.Screen name="messages" options={{ title: 'შეტყობინებები' }} />
    <Tabs.Screen name="profile" options={{ title: 'პროფილი' }} />
  </Tabs>;
}
