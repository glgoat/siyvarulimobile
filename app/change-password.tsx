import { useState } from 'react';
import { Alert, StyleSheet, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/providers/ThemeProvider';
import { supabase } from '@/lib/supabase';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { palette } = useTheme();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);

  async function save() {
    if (password.length < 6) return Alert.alert('პაროლი მოკლეა', 'გამოიყენე მინიმუმ 6 სიმბოლო.');
    if (password !== confirm) return Alert.alert('პაროლები არ ემთხვევა', 'გადაამოწმე ორივე ველი.');
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return Alert.alert('ვერ მოხერხდა', error.message);
    Alert.alert('შენახულია', 'პაროლი შეიცვალა.', [{ text: 'კარგი', onPress: () => router.back() }]);
  }

  return <><Stack.Screen options={{ headerShown: true, title: 'პაროლის შეცვლა', headerTintColor: palette.rose, headerStyle: { backgroundColor: palette.paper }, headerTitleStyle: { color: palette.ink } }} /><Screen><AppText style={styles.title}>ახალი პაროლი</AppText><AppText style={[styles.body, { color: palette.muted }]}>შექმენი ახალი პაროლი შენი ანგარიშისთვის.</AppText><TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="ახალი პაროლი" placeholderTextColor={palette.muted} style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.line, color: palette.ink }]} /><TextInput value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="გაიმეორე პაროლი" placeholderTextColor={palette.muted} style={[styles.input, { backgroundColor: palette.surface, borderColor: palette.line, color: palette.ink }]} /><PrimaryButton title="პაროლის შენახვა" loading={busy} onPress={save} /></Screen></>;
}

const styles = StyleSheet.create({ title: { fontSize: 26, fontWeight: '800', marginBottom: 8 }, body: { fontSize: 15, lineHeight: 22, marginBottom: 22 }, input: { minHeight: 52, borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, fontSize: 16, marginBottom: 12 } });
