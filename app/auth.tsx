import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, radius, spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';

export default function AuthScreen() {
  const router = useRouter(); const [mode, setMode] = useState<'login' | 'signup'>('login'); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [firstName, setFirstName] = useState(''); const [busy, setBusy] = useState(false);
  async function submit() {
    if (!email || password.length < 6 || (mode === 'signup' && !firstName.trim())) { Alert.alert('შეავსე ველები', 'ელფოსტა, პაროლი და სახელი აუცილებელია.'); return; }
    setBusy(true);
    const result = mode === 'login' ? await supabase.auth.signInWithPassword({ email: email.trim(), password }) : await supabase.auth.signUp({ email: email.trim(), password, options: { data: { first_name: firstName.trim() } } });
    setBusy(false);
    if (result.error) Alert.alert('ვერ მოხერხდა', result.error.message);
    else if (mode === 'signup' && !result.data.session) Alert.alert('შეამოწმე ელფოსტა', 'დადასტურების ბმული გამოგიგზავნეთ.');
    else router.replace('/(tabs)/discover');
  }
  return <Screen scroll={false}><KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><View style={styles.brandMark}><AppText style={styles.heart}>♥</AppText></View><AppText style={styles.brand}>siyvaruli.ge</AppText><AppText style={styles.hero}>{mode === 'login' ? 'კარგია, რომ დაბრუნდი.' : 'შენი ადამიანი აქ გელოდება.'}</AppText><AppText style={styles.sub}>{mode === 'login' ? 'შედი შენს პროფილზე და განაგრძე გაცნობა.' : 'შექმენი პროფილი და გაიცანი ადამიანები საქართველოში.'}</AppText><View style={styles.form}>{mode === 'signup' && <TextInput value={firstName} onChangeText={setFirstName} placeholder="სახელი" placeholderTextColor={colors.muted} style={styles.input} autoCapitalize="words" />}<TextInput value={email} onChangeText={setEmail} placeholder="ელფოსტა" placeholderTextColor={colors.muted} style={styles.input} keyboardType="email-address" autoCapitalize="none" /><TextInput value={password} onChangeText={setPassword} placeholder="პაროლი" placeholderTextColor={colors.muted} style={styles.input} secureTextEntry /><PrimaryButton title={mode === 'login' ? 'შესვლა' : 'რეგისტრაცია'} loading={busy} onPress={submit} /><Pressable onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}><AppText style={styles.switch}>{mode === 'login' ? 'ახალი ხარ? შექმენი ანგარიში' : 'უკვე გაქვს ანგარიში? შედი'}</AppText></Pressable>{mode === 'login' && <Pressable onPress={() => Alert.alert('პაროლის აღდგენა', 'შეიყვანე ელფოსტა და დაგვეკონტაქტე პაროლის აღსადგენად.')}><AppText style={styles.forgot}>დაგავიწყდა პაროლი?</AppText></Pressable>}</View></KeyboardAvoidingView></Screen>;
}
const styles = StyleSheet.create({ wrap: { flex: 1, justifyContent: 'center', padding: spacing.lg }, brandMark: { width: 58, height: 58, borderRadius: 18, backgroundColor: colors.rose, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }, heart: { color: colors.white, fontSize: 31 }, brand: { color: colors.rose, fontWeight: '800', fontSize: 18 }, hero: { fontSize: 31, fontWeight: '800', lineHeight: 39, marginTop: 26 }, sub: { color: colors.muted, fontSize: 15, lineHeight: 23, marginTop: 10 }, form: { gap: 12, marginTop: 28 }, input: { height: 54, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 16, color: colors.ink, backgroundColor: colors.surface, fontSize: 16 }, switch: { textAlign: 'center', color: colors.rose, fontWeight: '700', marginTop: 8 }, forgot: { textAlign: 'center', color: colors.muted, fontSize: 13, marginTop: 7 } });
