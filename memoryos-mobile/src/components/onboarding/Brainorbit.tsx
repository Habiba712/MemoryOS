import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RADIUS = 105;

 const ORBIT_ITEMS = [
  { angle: -70, icon: 'document-text', bg: '#3a1a1a', color: '#ff6b6b' },  
  { angle: -10, icon: 'document-outline', bg: '#12253a', color: '#5aa9ff' }, 
  { angle: 55, icon: 'image-outline', bg: '#12321f', color: '#4fd18b' },   
  { angle: 130, icon: 'play', bg: '#1c1230', color: '#a685ff' },           
  { angle: -140, icon: 'link', bg: '#101a2e', color: '#4d9cff' },         
] as const;

export default function BrainOrbit() {
  const rotation = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 24000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotation, pulse]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const spinBack = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });
  const glowScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const glowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.9] });

  return (
    <View style={styles.wrap}>
      <View style={styles.orbitRing} />

      <Animated.View style={[styles.orbitContainer, { transform: [{ rotate: spin }] }]}>
        {ORBIT_ITEMS.map((item, i) => {
          const rad = (item.angle * Math.PI) / 180;
          const x = RADIUS * Math.cos(rad);
          const y = RADIUS * Math.sin(rad);
          return (
            <Animated.View
              key={i}
              style={[
                styles.orbitIconWrap,
                { transform: [{ translateX: x }, { translateY: y }, { rotate: spinBack }] },
              ]}
            >
              <View style={[styles.orbitIcon, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
            </Animated.View>
          );
        })}
      </Animated.View>

      <Animated.View
        style={[
          styles.glow,
          { transform: [{ scale: glowScale }], opacity: glowOpacity },
        ]}
      />

      <View style={styles.brainCore}>
        <Ionicons name="body-outline" size={46} color="#5aa9ff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitRing: {
    position: 'absolute',
    width: RADIUS * 2 + 20,
    height: RADIUS * 2 + 20,
    borderRadius: RADIUS + 10,
    borderWidth: 1,
    borderColor: 'rgba(90,169,255,0.15)',
    borderStyle: 'dashed',
  },
  orbitContainer: {
    width: 1,
    height: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitIconWrap: {
    position: 'absolute',
  },
  orbitIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#1c4a8a',
  },
  brainCore: {
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