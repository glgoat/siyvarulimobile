import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { useTheme } from '@/providers/ThemeProvider';

// Test unit IDs are intentionally used until production AdMob IDs are supplied.
export function AdBanner() {
  const { palette } = useTheme();
  const isExpoGo = Constants.appOwnership === 'expo';
  const ads = isExpoGo ? null : require('react-native-google-mobile-ads');
  useEffect(() => { if (ads) void ads.default().initialize(); }, [ads]);
  if (!ads) return null;
  const BannerAd = ads.BannerAd;
  return <View style={[styles.wrap, { backgroundColor: palette.paper, borderTopColor: palette.line }]}><BannerAd unitId={ads.TestIds.BANNER} size={ads.BannerAdSize.BANNER} requestOptions={{ requestNonPersonalizedAdsOnly: true }} /></View>;
}

const styles = StyleSheet.create({ wrap: { minHeight: 58, alignItems: 'center', justifyContent: 'center', borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 4 } });
