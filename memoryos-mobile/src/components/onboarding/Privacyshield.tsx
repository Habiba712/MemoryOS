import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FLOAT_ITEMS = [
  { icon: 'cloud-outline', top: 20, left: 20 },
  { icon: 'phone-portrait-outline', top: 10, right: 20 },
  { icon: 'folder-outline', bottom: 30, left: 10 },
  { icon: 'lock-closed', bottom: 15, right: 15 },
] as const;

function useFloat(delay: number) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(value, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [value, delay]);

  return value.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
}

function useRing(delay: number) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(value, {
          toValue: 1,
          duration: 2200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [value, delay]);

  return value;
}

export default function PrivacyShield() {
  const ring1 = useRing(0);
  const ring2 = useRing(1100);

  const floats = [useFloat(0), useFloat(300), useFloat(600), useFloat(150)];

  const ringStyle = (ring: Animated.Value) => ({
    transform: [
      { scale: ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] }) },
    ],
    opacity: ring.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.5, 0.15, 0] }),
  });

  return (
    <View style={styles.wrap}>
      {FLOAT_ITEMS.map((item, i) => (
        <Animated.View
          key={i}
          style={[
            styles.floatIcon,
            { top: item.top, left: item.left, right: item.right, bottom: item.bottom },
            { transform: [{ translateY: floats[i] }] },
          ]}
        >
          <Ionicons name={item.icon as any} size={20} color="#5aa9ff" />
        </Animated.View>
      ))}

      <Animated.View style={[styles.ring, ringStyle(ring1)]} />
      <Animated.View style={[styles.ring, ringStyle(ring2)]} />

      <View style={styles.shieldCore}>
        <Ionicons name="shield-checkmark" size={44} color="#5aa9ff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 260,
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatIcon: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#0f1a2e',
    borderWidth: 1,
    borderColor: '#22314d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1.5,
    borderColor: '#4d9cff',
  },
  shieldCore: {
    width: 100,
    height: 100,
    borderRadius: 26,
    backgroundColor: '#0f1d33',
    borderWidth: 1,
    borderColor: '#3978c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});