import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  RefreshControl,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

const CURRENT_USER = { name: 'Habiba' };
const API_URL = process.env.EXPO_PUBLIC_API_URL;


function AnimatedEntry({ children, index = 0, style }: { children: React.ReactNode; index?: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 380, delay: index * 60, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 380, delay: index * 60, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}

function Pressy({ children, onPress, style }: { children: React.ReactNode; onPress?: () => void; style?: any }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.timing(scale, { toValue: 0.96, duration: 100, useNativeDriver: true }).start();
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

 
// A "link" item (from the urls collection) has no fileType — it has videoUrl/platform instead.
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
  return `${days}d ago`;
}

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [quickAccess, setQuickAccess] = useState({ images: 0, documents: 0, links: 0, others: 0 });
  const [userName, setUserName] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!userId) return;
    try {

      const getUser = await fetch(`${API_URL}/api/user/getUserById/${userId}`);
      const dataUser = await getUser.json();
      console.log('getUser', dataUser.userBase.username || '');
      const res01 = await fetch(`${API_URL}/api/file/filesByUser/${userId}`);
      if (!res01.ok) throw new Error('Failed to load dashboard');
      const data = await res01.json();

      const res02 = await fetch(`${API_URL}/api/url/getUrlsByUser/${userId}`);
      if (!res02.ok) throw new Error('Failed to load dashboard');
      const data02 = await res02.json();

      const images = data.filter((f: any) => f.fileType === 'image').length;
      const documents = data.filter((f: any) => f.fileType === 'pdf' || f.fileType === 'word' || f.fileType === 'excel' || f.fileType === 'powerpoint' || f.fileType === 'text' || f.fileType === 'doc').length;
      const links = data02.urls.length;
      const others = data.length - images - documents;

      setQuickAccess({ images, documents, links, others });
      setRecentFiles([...data, ...data02.urls]);
      setUserName(dataUser.userBase.username || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    (async () => {
      const raw = await SecureStore.getItemAsync('sessionData');
      if (raw) setUserId(JSON.parse(raw).userId);
    })();
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [userId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const handleSearchSubmit = () => {
    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const sortedFiles = [...recentFiles].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const QUICK_ACCESS_TILES = [
    { key: 'images', label: 'Images', icon: 'image', bg: '#0f2b2b', color: '#4fd1c5', count: quickAccess.images },
    { key: 'documents', label: 'Documents', icon: 'document-text', bg: '#241a3a', color: '#a685ff', count: quickAccess.documents },
    { key: 'links', label: 'Links', icon: 'link', bg: '#0f2b2b', color: '#4fd1c5', count: quickAccess.links },
    { key: 'others', label: 'Others', icon: 'grid', bg: '#1a1f2e', color: '#8b93a7', count: quickAccess.others },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4d9cff" />}
      >
        {/* Top bbar */}
        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={() => router.push('/menu')}>
            <Ionicons name="menu" size={20} color="#fff" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={18} color="#fff" />
          </Pressable>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>Hi, {userName} 👋</Text>
        <Text style={styles.subGreeting}>What are we looking for today?</Text>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#5c667a" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            placeholder="Search anything..."
            placeholderTextColor="#5c667a"
            style={styles.searchInput}
            returnKeyType="search"
          />
          <Ionicons name="sparkles" size={16} color="#4d9cff" />
        </View>

        {/* Quick Access */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <Pressable onPress={() => router.push('/tabs/files')}>
            <Text style={styles.viewAll}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.quickAccessRow}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} style={styles.quickTileSkeleton} />)
            : QUICK_ACCESS_TILES.map((tile, i) => (
              <AnimatedEntry key={tile.key} index={i} style={styles.quickTileWrap}>
                <Pressy style={styles.quickTile} onPress={() => router.push(`/tabs/files/${tile.key}`)}>
                  <View style={[styles.quickTileIcon, { backgroundColor: tile.bg }]}>
                    <Ionicons name={tile.icon as any} size={18} color={tile.color} />
                  </View>
                  <Text style={styles.quickTileLabel}>{tile.label}</Text>
                  <Text style={styles.quickTileCount}>{tile.count}</Text>
                </Pressy>
              </AnimatedEntry>
            ))}
        </View>

        {/* Recent Files */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Files</Text>
          <Pressable onPress={() => router.push('/tabs/files')}>
            <Text style={styles.viewAll}>See all</Text>
          </Pressable>
        </View>

        <View style={styles.filesList}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} style={styles.fileRowSkeleton} />)
            : sortedFiles.slice(0,5).map((file, i) => {
              const visual = getItemVisual(file);
              return (
                <AnimatedEntry key={file._id} index={i}>
                  <Pressy style={styles.fileRow} onPress={() => router.push(`/tabs/files/${file._id}`)}>
                    <View style={[styles.fileIcon, { backgroundColor: visual.bg }]}>
                      <Ionicons name={visual.icon as any} size={17} color={visual.color} />
                    </View>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.fileTitle} numberOfLines={1}>
                        {file.title}
                      </Text>
                      <Text style={styles.fileMeta}>
                        {timeAgo(file.createdAt)} · {file.category}
                      </Text>
                    </View>
                    <Pressable hitSlop={10}>
                      <Ionicons name="ellipsis-vertical" size={16} color="#5c667a" />
                    </Pressable>
                  </Pressy>
                </AnimatedEntry>
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F16',
    paddingBottom: 50,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 40,

  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 40,
  },
  iconButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },

  greeting: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subGreeting: { fontSize: 13.5, color: '#8b93a7', marginBottom: 18 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#141a2b',
    borderWidth: 1, borderColor: '#1f2740', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13,
    marginBottom: 24,
  },
  searchInput: { flex: 1, fontSize: 13.5, color: '#fff' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#fff' },
  viewAll: { fontSize: 12, color: '#4d9cff' },

  quickAccessRow: { flexDirection: 'row', gap: 8, marginBottom: 26 },
  quickTileWrap: { flex: 1 },
  quickTileSkeleton: { flex: 1, height: 88, borderRadius: 14 },
  quickTile: {
    flex: 1, backgroundColor: '#141a2b', borderWidth: 1, borderColor: '#1f2740',
    borderRadius: 14, padding: 10, alignItems: 'flex-start',
  },
  quickTileIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  quickTileLabel: { fontSize: 11.5, color: '#c9d3e0', marginBottom: 2 },
  quickTileCount: { fontSize: 15, fontWeight: '700', color: '#fff' },

  filesList: { gap: 8, paddingBottom: 50 },
  fileRowSkeleton: { height: 62, borderRadius: 14 },
  fileRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#141a2b',
    borderWidth: 1, borderColor: '#1f2740', borderRadius: 14, padding: 12,
  },
  fileIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  fileTitle: { fontSize: 13.5, fontWeight: '600', color: '#fff', marginBottom: 2 },
  fileMeta: { fontSize: 11.5, color: '#5c667a' },

  skeleton: { backgroundColor: '#141a2b' },
});