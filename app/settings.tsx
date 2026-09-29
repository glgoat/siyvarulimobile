import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Stack } from 'expo-router';
import { colors, radius, spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProvider';
import { AppText } from '@/components/AppText';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';

export default function SettingsScreen() {
  const { user, settings, refresh } = useAuth(); const [min, setMin] = useState(String(settings?.discovery_age_min ?? 18)); const [max, setMax] = useState(String(settings?.discovery_age_max ?? 99)); const [city, setCity] = useState(settings?.discovery_city || ''); const [saving, setSaving] = useState(false);
  async function save() { if (!user) return; setSaving(true); const { error } = await supabase.from('user_settings').upsert({ user_id: user.id, discovery_age_min: Number(min) || 18, discovery_age_max: Number(max) || 99, discovery_city: city.trim() || null }); setSaving(false); if (error) Alert.alert('ვერ მოხერხდა', error.message); else { await refresh(); Alert.alert('შენახულია', 'ფილტრები განახლდა.'); } }
  return <><Stack.Screen options={{ headerShown: true, title: 'ფილტრები და პარამეტრები', headerTintColor: colors.rose }} /><Screen><AppText style={styles.heading}>აღმოჩენის ფილტრები</AppText><AppText style={styles.sub}>აირჩიე ვის ნახავ აღმოჩენის გვერდზე.</AppText><View style={styles.row}><View style={styles.half}><AppText style={styles.label}>მინ. ასაკი</AppText><TextInput value={min} onChangeText={setMin} keyboardType="number-pad" style={styles.input} /></View><View style={styles.half}><AppText style={styles.label}>მაქს. ასაკი</AppText><TextInput value={max} onChangeText={setMax} keyboardType="number-pad" style={styles.input} /></View></View><AppText style={styles.label}>ქალაქი</AppText><TextInput value={city} onChangeText={setCity} placeholder="მაგ. თბილისი" placeholderTextColor={colors.muted} style={styles.input} /><PrimaryButton title="შენახვა" loading={saving} onPress={save} /><Pressable style={styles.help} onPress={() => Alert.alert('siyvaruli.ge', 'შენი ანგარიში და მონაცემები გაზიარებულია web და mobile აპებს შორის.') }><AppText style={styles.link}>კონფიდენციალურობა და დახმარება</AppText></Pressable></Screen></>;
}
const styles = StyleSheet.create({ heading: { fontSize: 28, fontWeight: '800' }, sub: { color: colors.muted, marginTop: 5, marginBottom: spacing.xl }, row: { flexDirection: 'row', gap: 12, marginBottom: 18 }, half: { flex: 1 }, label: { color: colors.muted, fontSize: 13, fontWeight: '700', marginBottom: 7 }, input: { height: 52, borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingHorizontal: 15, color: colors.ink, backgroundColor: colors.surface, fontSize: 16, marginBottom: 18 }, help: { alignItems: 'center', paddingVertical: 26 }, link: { color: colors.rose, fontWeight: '700' } });
