import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Animated,
  Easing,
  LayoutChangeEvent,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
// UI filter keys differ slightly from your backend's `type` param —
// see the note above this file about "links" and "others" not having
// real backend support yet. Mapped explicitly below in runSearch().
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'image', label: 'Images' },
  { key: 'documents', label: 'Documents' },
  { key: 'links', label: 'Links' },
  { key: 'others', label: 'Others' },
];
 

function AnimatedEntry({ children, index = 0, style }: { children: React.ReactNode; index?: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 320, delay: index * 45, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 320, delay: index * 45, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [index]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

function Pressy({ children, onPress, style }: { children: React.ReactNode; onPress?: () => void; style?: any }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.timing(scale, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
  const pressOut = () => Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

function Skeleton({ style }: { style?: any }) {
  const pulse = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 650, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[styles.skeleton, style, { opacity: pulse }]} />;
}

function getItemVisual(item: any) {
  if (item.fileType === 'pdf') return { icon: 'document-text', bg: '#3a1a1a', color: '#ff6b6b' };
  if (item.fileType === 'image') return { icon: 'image', bg: '#0f2b2b', color: '#4fd1c5' };
  if (item.fileType === 'video') return { icon: 'play', bg: '#1c1230', color: '#a685ff' };
  if (item.videoUrl || item.platform) return { icon: 'link', bg: '#0f2b2b', color: '#4fd1c5' };
  return { icon: 'document', bg: '#1a1f2e', color: '#9aa4b8' };
}

function timeAgo(dateStr: string) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

 
function FilterTabs({ active, onChange }: { active: string; onChange: (key: string) => void }) {
  const layouts = useRef<Record<string, { x: number; width: number }>>({});
  const underlineX = useRef(new Animated.Value(0)).current;
  const underlineW = useRef(new Animated.Value(0)).current;

  const measure = (key: string) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    layouts.current[key] = { x, width };
    if (key === active) {
      underlineX.setValue(x);
      underlineW.setValue(width);
    }
  };

  const selectTab = (key: string) => {
    onChange(key);
    const l = layouts.current[key];
    if (l) {
      Animated.parallel([
        Animated.timing(underlineX, { toValue: l.x, duration: 250, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
        Animated.timing(underlineW, { toValue: l.width, duration: 250, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      ]).start();
    }
  };

  return (
    <View style={styles.tabsWrap}>
      <View style={styles.tabsRow}>
        {FILTERS.map((f) => (
          <Pressable key={f.key} onLayout={measure(f.key)} onPress={() => selectTab(f.key)} style={styles.tab}>
            <Text style={[styles.tabText, active === f.key && styles.tabTextActive]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>
      <Animated.View style={[styles.tabUnderline, { left: underlineX, width: underlineW }]} />
    </View>
  );
}

 
export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q || '');
  const [activeFilter, setActiveFilter] = useState('all');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runSearch = useCallback(async (q: string, filter: string) => {
    setLoading(true);
    try {
      let files: any[] = [];
      let links: any[] = [];

      if (filter === 'links') {
        
        const res = await fetch(`${API_URL}/api/url/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        links = data.urls || [];
      } else {
        const type = filter === 'documents' ? 'pdf' : filter === 'others' ? '' : filter === 'all' ? '' : filter;
        const res = await fetch(`${API_URL}/api/file/search?q=${encodeURIComponent(q)}&type=${type}`);
        if (!res.ok) throw new Error('Search failed');
        files = await res.json();

        if (filter === 'others') {
          files = files.filter((f: any) => !['image', 'pdf', 'video'].includes(f.fileType));
        }

        if (filter === 'all') {
          const res02 = await fetch(`${API_URL}/api/url/search?q=${encodeURIComponent(q)}`).catch(() => null);
          if (res02?.ok) {
            const data02 = await res02.json();
            links = data02.urls || [];
          }
        }
      }

      setResults([...files, ...links]);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(() => runSearch(query, activeFilter), 350);
    return () => clearTimeout(timeout);
  }, [query, activeFilter, runSearch]);

   const topResults = results.filter((r) => r.matchScore === undefined || r.matchScore >= 80);
  const otherResults = results.filter((r) => r.matchScore !== undefined && r.matchScore < 80);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchRow}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </Pressable>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#5c667a" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search anything..."
            placeholderTextColor="#5c667a"
            style={styles.searchInput}
            autoFocus
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close" size={16} color="#5c667a" />
            </Pressable>
          )}
          <Pressable hitSlop={8}>
            <Ionicons name="options-outline" size={18} color="#4d9cff" />
          </Pressable>
        </View>
      </View>

      <FilterTabs active={activeFilter} onChange={setActiveFilter} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading && (
          <View style={{ gap: 8 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} style={styles.rowSkeleton} />
            ))}
          </View>
        )}

        {!loading && query.trim().length > 0 && results.length === 0 && (
          <Text style={styles.emptyText}>No results for "{query}".</Text>
        )}

        {!loading && topResults.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Top Results</Text>
            <View style={styles.resultsList}>
              {topResults.map((item, i) => (
                <ResultRow key={item._id} item={item} index={i} />
              ))}
            </View>
          </>
        )}

        {!loading && otherResults.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Other Results</Text>
            <View style={styles.resultsList}>
              {otherResults.map((item, i) => (
                <ResultRow key={item._id} item={item} index={topResults.length + i} muted />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ResultRow({ item, index, muted = false }: { item: any; index: number; muted?: boolean }) {
  const visual = getItemVisual(item);
  console.log('item', item.thumbnailUrl)
  return (
    <AnimatedEntry index={index}>
      <Pressy style={[styles.fileRow, muted && styles.fileRowMuted]} onPress={() =>{
        console.log('item', item.title)
        router.push(`/files/${item._id}`)}}>
        <View style={[styles.fileIcon]}>
          {
            item.url || item.thumbnailUrl ?   <Image source={{ uri: item.thumbnailUrl || item.url }}
                          resizeMode="cover" style={{width:45, height:45, borderRadius: 10}}/>
                          : <Ionicons name={visual.icon as any} size={17} color={visual.color} /> 
          }
        
          
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.fileTitle, muted && styles.fileTitleMuted]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.fileMeta}>
            {timeAgo(item.createdAt)} · {item.category}
          </Text>
        </View>
        <Pressable hitSlop={10}>
          <Ionicons name="ellipsis-vertical" size={16} color="#5c667a" />
        </Pressable>
      </Pressy>
    </AnimatedEntry>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F16', paddingTop: 40 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 4, paddingBottom: 50 },

  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 18, paddingTop: 8, paddingBottom: 14 },
  backButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#141a2b',
    borderWidth: 1, borderColor: '#1f2740', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11,
  },
  searchInput: { flex: 1, fontSize: 13.5, color: '#fff' },

  tabsWrap: { paddingHorizontal: 18, marginBottom: 18 },
  tabsRow: { flexDirection: 'row', gap: 18 },
  tab: { paddingBottom: 8 },
  tabText: { fontSize: 13, color: '#5c667a', fontWeight: '500' },
  tabTextActive: { color: '#4d9cff', fontWeight: '600' },
  tabUnderline: { position: 'relative', bottom: 0, height: 2, backgroundColor: '#4d9cff', borderRadius: 1 },

  sectionLabel: { fontSize: 12.5, fontWeight: '600', color: '#4d9cff', marginBottom: 10 },
  resultsList: { gap: 8 },
  rowSkeleton: { height: 62, borderRadius: 14 },

  fileRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#141a2b',
    borderWidth: 1, borderColor: '#1f2740', borderRadius: 14, padding: 12,
  },
  fileRowMuted: { opacity: 0.6, borderColor: '#161c2c' },
  fileIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  fileTitle: { fontSize: 13.5, fontWeight: '600', color: '#fff', marginBottom: 2 },
  fileTitleMuted: { color: '#9aa4b8', fontWeight: '500' },
  fileMeta: { fontSize: 11.5, color: '#5c667a' },

  emptyText: { color: '#5c667a', fontSize: 13, textAlign: 'center', marginTop: 60 },
  skeleton: { backgroundColor: '#141a2b' },
});