import { Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

export default function Index() {
  const { session, profile, loading } = useAuth();
  if (loading || (session && !profile)) return null;
  return <Redirect href={session ? (profile && !profile.profile_completed ? '/onboarding' : '/(tabs)/discover') : '/auth'} />;
}
