import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QUERY = 'that man dancing in pink shoes';
 
const RESULTS = [
  {
    icon: 'logo-instagram',
    bg: '#3a1a33',
    color: '#e35bb8',
    title: 'Man dancing in pink sneakers',
    meta: 'Reel · 0:14',
    strong: true,
  },
  {
    icon: 'logo-pinterest',
    bg: '#101a2e',
    color: '#4d9cff',
    title: 'Pink sneaker outfit ideas',
    meta: 'Pin',
    strong: false,
  },
  {
    icon: 'document-text',
    bg: '#12321f',
    color: '#4fd18b',
    title: 'Dance class notes.pdf',
    meta: 'Last month',
    strong: false,
  },
] as const;

const TYPE_SPEED = 55;
const PAUSE_AFTER_TYPE = 500;
const HOLD_DURATION = 2600;
const RESET_FADE = 400;

export default function SearchPreview() {
  const [typed, setTyped] = useState('');
  const cursorBlink = useRef(new Animated.Value(1)).current;
  const rowAnims = useRef(RESULTS.map(() => new Animated.Value(0))).current;
  const barGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let mounted = true;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, delay: number) => {
      const id = setTimeout(() => mounted && fn(), delay);
      timeouts.push(id);
    };

    // cursor blink, runs the whole time
    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorBlink, { toValue: 0, duration: 450, useNativeDriver: true }),
        Animated.timing(cursorBlink, { toValue: 1, duration: 450, useNativeDriver: true }),
      ])
    );
    blinkLoop.start();

    function runCycle() {
      // reset
      setTyped('');
      rowAnims.forEach((v) => v.setValue(0));
      barGlow.setValue(0);

      // type letter by letter
      QUERY.split('').forEach((_, i) => {
        t(() => setTyped(QUERY.slice(0, i + 1)), i * TYPE_SPEED);
      });

      const typingDone = QUERY.length * TYPE_SPEED;

      // glow the search bar once typing finishes
      t(() => {
        Animated.timing(barGlow, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      }, typingDone + 100);

      // reveal results: strong match first, then weaker ones staggered after
      t(() => {
        Animated.timing(rowAnims[0], {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();
      }, typingDone + PAUSE_AFTER_TYPE);

      RESULTS.slice(1).forEach((_, idx) => {
        t(() => {
          Animated.timing(rowAnims[idx + 1], {
            toValue: 1,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start();
        }, typingDone + PAUSE_AFTER_TYPE + 260 * (idx + 1));
      });

      const revealEnd =
        typingDone + PAUSE_AFTER_TYPE + 260 * RESULTS.length + HOLD_DURATION;

      // fade everything out, then loop
      t(() => {
        Animated.timing(barGlow, {
          toValue: 0,
          duration: RESET_FADE,
          useNativeDriver: false,
        }).start();
        Animated.parallel(
          rowAnims.map((v) =>
            Animated.timing(v, { toValue: 0, duration: RESET_FADE, useNativeDriver: true })
          )
        ).start();
      }, revealEnd);

      t(() => runCycle(), revealEnd + RESET_FADE + 300);
    }

    runCycle();

    return () => {
      mounted = false;
      timeouts.forEach(clearTimeout);
      blinkLoop.stop();
    };
  }, [barGlow, cursorBlink, rowAnims]);

  const borderColor = barGlow.interpolate({
    inputRange: [0, 1],
    outputRange: ['#22314d', '#4d9cff'],
  });

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.searchBar, { borderColor }]}>
        <Text style={styles.searchText} numberOfLines={1}>
          {typed || ' '}
          <Animated.Text style={{ opacity: cursorBlink, color: '#4d9cff' }}>|</Animated.Text>
        </Text>
        <Ionicons name="sparkles" size={18} color="#4d9cff" />
      </Animated.View>

      <View style={styles.results}>
        {RESULTS.map((item, i) => {
          const translateY = rowAnims[i].interpolate({
            inputRange: [0, 1],
            outputRange: [14, 0],
          });
          return (
            <Animated.View
              key={item.title}
              style={[
                styles.row,
                item.strong ? styles.rowStrong : styles.rowWeak,
                { opacity: rowAnims[i], transform: [{ translateY }] },
              ]}
            >
              <View style={[styles.rowIcon, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon as any} size={16} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={item.strong ? styles.rowTitleStrong : styles.rowTitleWeak}>
                  {item.title}
                </Text>
                <Text style={styles.rowMeta}>{item.meta}</Text>
              </View>
              {item.strong && (
                <View style={styles.matchTag}>
                  <Text style={styles.matchTagText}>Best match</Text>
                </View>
              )}
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 400, paddingHorizontal: 24 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#11182a',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
  },
  searchText: { color: '#c9d3e0', fontSize: 14, flex: 1, marginRight: 8 },
  results: { gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 10,
  },
  rowStrong: {
    backgroundColor: '#151f33',
    borderWidth: 1,
    borderColor: '#3a5fa0',
  },
  rowWeak: {
    backgroundColor: '#0c1220',
    borderWidth: 1,
    borderColor: '#1c2740',
    opacity: 0.85,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitleStrong: { color: '#fff', fontSize: 13.5, fontWeight: '600', marginBottom: 2 },
  rowTitleWeak: { color: '#9aa4b8', fontSize: 12.5, fontWeight: '500', marginBottom: 2 },
  rowMeta: { color: '#5c667a', fontSize: 11 },
  matchTag: {
    backgroundColor: '#1d3a6e',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  matchTagText: { color: '#8ab6ff', fontSize: 9.5, fontWeight: '600' },
});