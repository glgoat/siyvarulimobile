import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import mobileAds, { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useTheme } from '@/providers/ThemeProvider';

// Test unit IDs are intentionally used until production AdMob IDs are supplied.
export function AdBanner() {
  const { palette } = useTheme();
  useEffect(() => { void mobileAds().initialize(); }, []);
  return <View style={[styles.wrap, { backgroundColor: palette.paper, borderTopColor: palette.line }]}><BannerAd unitId={TestIds.BANNER} size={BannerAdSize.BANNER} requestOptions={{ requestNonPersonalizedAdsOnly: true }} /></View>;
}

const styles = StyleSheet.create({ wrap: { minHeight: 58, alignItems: 'center', justifyContent: 'center', borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 4 } });
