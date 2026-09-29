import { useRef } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { DiscoveryProfile } from '@/types';
import { ProfileCard } from './ProfileCard';

export function SwipeDeck({ profiles, onSwipe, onOpen }: { profiles: DiscoveryProfile[]; onSwipe: (profile: DiscoveryProfile, liked: boolean) => void; onOpen: (profile: DiscoveryProfile) => void }) {
  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({ inputRange: [-260, 0, 260], outputRange: ['-12deg', '0deg', '12deg'] });
  const responder = PanResponder.create({ onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8, onPanResponderMove: (_, g) => position.setValue({ x: g.dx, y: g.dy }), onPanResponderRelease: (_, g) => { if (Math.abs(g.dx) > 120) { const liked = g.dx > 0; Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); Animated.timing(position, { toValue: { x: liked ? 500 : -500, y: g.dy }, duration: 220, useNativeDriver: true }).start(() => { position.setValue({ x: 0, y: 0 }); onSwipe(profiles[0], liked); }); } else Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start(); } });
  if (!profiles.length) return null;
  return <View style={styles.deck}>{profiles.slice(0, 2).reverse().map((profile, index) => index === 1 ? <Animated.View key={profile.id} style={[styles.top, { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }]} {...responder.panHandlers}><ProfileCard profile={profile} onPress={() => onOpen(profile)} /></Animated.View> : <View key={profile.id} style={[styles.back, { transform: [{ scale: 0.96 }] }]}><ProfileCard profile={profile} /></View>)}</View>;
}
const styles = StyleSheet.create({ deck: { height: 510 }, top: { ...StyleSheet.absoluteFill, zIndex: 2 }, back: { ...StyleSheet.absoluteFill, zIndex: 1 } });
