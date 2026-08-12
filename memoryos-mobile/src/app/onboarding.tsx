import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

import BrainOrbit from '@/components/onboarding/Brainorbit';
import SearchPreview from '@/components/onboarding/Searchpreview';
import PrivacyShield from '@/components/onboarding/Privacyshield';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    key: '1',
    Illustration: BrainOrbit,
    titleWhite: 'Your Second Brain,',
    titleBlue: 'Always with You',
    subtitle: 'MemoryOS helps you save, organize, and find anything — instantly.',
  },
  {
    key: '2',
    Illustration: SearchPreview,
    titleWhite: 'Find Anything',
    titleBluePrefix: 'with ',
    titleBlue2: 'Natural Language',
    subtitle: 'Ask like you think. Our AI understands and finds what you need.',
  },
  {
    key: '3',
    Illustration: PrivacyShield,
    titleWhite: 'Your Data. Your Rules.',
    titleBlue: '100% Private.',
    subtitle: 'Everything you save is encrypted and stays under your control.',
  },
];

function AnimatedSlideText({ slide }: { slide: (typeof SLIDES)[number] }) {
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    fade.setValue(0);
    translateY.setValue(16);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [slide.key, fade, translateY]);

  return (
    <Animated.View style={{ opacity: fade, transform: [{ translateY }] }}>
      <Text style={styles.title}>
        {slide.titleWhite}
        {'\n'}
        {slide.titleBluePrefix ? (
          <>
            <Text style={styles.titleWhiteInline}>{slide.titleBluePrefix}</Text>
            <Text style={styles.titleBlue}>{slide.titleBlue2}</Text>
          </>
        ) : (
          <Text style={styles.titleBlue}>{slide.titleBlue}</Text>
        )}
      </Text>
      <Text style={styles.subtitle}>{slide.subtitle}</Text>
    </Animated.View>
  );
}

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  const finishOnboarding = async () => {
    await SecureStore.setItemAsync('hasOnboarded', 'true');
    router.replace('/auth/login');
  };

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      finishOnboarding();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => {
          const Illustration = item.Illustration;
          return (
            <View style={[styles.slide, { width }]}>
              <View style={styles.illustrationWrap}>
                <Illustration />
              </View>
              <AnimatedSlideText slide={item} />
            </View>
          );
        }}
      />

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable onPress={finishOnboarding}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
        <Pressable style={styles.nextButton} onPress={next}>
          <Text style={styles.nextText}>
            {index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07111F', paddingBottom: 40 },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  illustrationWrap: { marginBottom: 36, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 34,
  },
  titleWhiteInline: { color: '#fff' },
  titleBlue: { color: '#4d9cff' },
  subtitle: {
    fontSize: 14.5,
    color: '#8a94a8',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 8,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22314d', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#4d9cff', width: 20 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  skip: { color: '#6a7488', fontSize: 14 },
  nextButton: {
    backgroundColor: '#4d9cff',
    paddingHorizontal: 26,
    paddingVertical: 13,
    borderRadius: 14,
  },
  nextText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});