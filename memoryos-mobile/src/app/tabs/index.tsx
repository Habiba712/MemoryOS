import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  RefreshControl,
  SafeAreaView,
  Animated,
  Easing,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

 const CURRENT_USER = { name: 'Habiba', initial: 'H' };

const API_URL = 'http://192.168.0.239:4000';

 
function AnimatedEntry({ children, index = 0, style }: { children: React.ReactNode; index?: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 380,
        delay: index * 60,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 380,
        delay: index * 60,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
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

  const pressIn = () =>
    Animated.timing(scale, { toValue: 0.96, duration: 100, useNativeDriver: true }).start();
  const pressOut = () =>
    Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }).start();

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

 
function categoryVisual(category: string) {
  switch (category) {
    case 'Work':
      return { icon: 'briefcase', color: '#6b7280', bg: '#f3f4f6' };
    case 'School':
      return { icon: 'school', color: '#db2777', bg: '#fdf2f8' };
    case 'Travel':
      return { icon: 'airplane', color: '#0284c7', bg: '#f0f9ff' };
    case 'Research':
      return { icon: 'flask', color: '#059669', bg: '#ecfdf5' };
    case 'Food':
      return { icon: 'restaurant', color: '#ea580c', bg: '#fff7ed' };
    case 'Invoices':
      return { icon: 'receipt', color: '#d97706', bg: '#fffbeb' };
    case 'Design':
      return { icon: 'color-palette', color: '#db2777', bg: '#fdf2f8' };
    case 'Programming':
      return { icon: 'code-slash', color: '#2563eb', bg: '#eff6ff' };
    default:
      return { icon: 'sparkles', color: '#7c3aed', bg: '#f5f3ff' };
  }
}

function fileTypeBadge(type: string) {
  switch (type) {
    case 'pdf':
      return { label: 'PDF', bg: '#fee2e2', color: '#dc2626' };
    case 'video':
      return { label: 'MP4', bg: '#ede9fe', color: '#7c3aed' };
    case 'image':
      return { label: 'PNG', bg: '#dbeafe', color: '#2563eb' };
    default:
      return { label: 'DOC', bg: '#f3f4f6', color: '#4b5563' };
  }
}

function timeAgo(dateStr: string) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

 

export default function DashboardScreen() {
  const [query, setQuery] = useState('');
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [collectionFiles, setCollectionFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>({});

  const loadDashboard = useCallback(async () => {
    if (!userId) return;
    try {
      const res01 = await fetch(`${API_URL}/api/file/filesByUser/${userId}`);
      console.log('res01',res01);
      if (!res01.ok) throw new Error('Failed to load dashboard');
      const data = await res01.json();

      const res02 = await fetch(`${API_URL}/api/url/getUrlsByUser/${userId}`);
      console.log('res02',res02);
      if (!res02.ok) throw new Error('Failed to load dashboard');
      const data02 = await res02.json();

      const totalFiles = data.length + data02.urls.length;
      const newThisWeek = data.filter(
        (file: any) => file.createdAt > Date.now() - 1000 * 60 * 60 * 24 * 7
      ).length;
      const storageUsedGb = (
        data.reduce((res: number, item: any) => res + item.size, 0) / 1024 / 1024 / 1024 +
        data02.urls.reduce((res: number, item: any) => res + item.contentSize, 0) / 1024 / 1024 / 1024
      ).toFixed(2);

      const collectionsMap: Record<string, any> = {};

      data.forEach((file: any) => {
        if (!collectionsMap[file.category]) {
          collectionsMap[file.category] = {
            name: file.category,
            slug: file.category.toLowerCase().replaceAll(' ', '-'),
            fileCount: 1,
          };
        } else {
          collectionsMap[file.category].fileCount++;
        }
      });

      data02.urls.forEach((url: any) => {
        if (!collectionsMap[url.category]) {
          collectionsMap[url.category] = {
            name: url.category,
            slug: url.category.toLowerCase().replaceAll(' ', '-'),
            fileCount: 1,
          };
        } else {
          collectionsMap[url.category].fileCount++;
        }
      });

      const collectionsList = Object.values(collectionsMap);

      setCollectionFiles(collectionsList);
      setStats({
        totalFiles,
        newThisWeek,
        storageUsedGb,
        storageLimitGb: 20,
        collectionsCount: collectionsList.length,
        favoritesCount: 0,
      });
      setRecentFiles([...data, ...data02.urls]);
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
      if (raw) {
        const session = JSON.parse(raw);
        setUserId(session.userId);
      }
    })();
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const handleSearchSubmit = () => {
    if (!query.trim()) return;
    router.replace(`/tabs/search?q=${encodeURIComponent(query)}`);
  };

  const sortedFiles = [...recentFiles].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7c3aed" />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning, {CURRENT_USER.name} 👋</Text>
            <Text style={styles.subGreeting}>Here's what's happening with your memory.</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={18} color="#6b7280" />
            </Pressable>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{CURRENT_USER.initial}</Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#9ca3af" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            placeholder="Search anything you've ever saved..."
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} style={styles.statCard} />)
          ) : (
            <>
              <AnimatedEntry index={0} style={styles.statCardWrap}>
                <StatCard icon="folder-outline" label="Total Files" value={stats.totalFiles} sub={`+${stats.newThisWeek} this week`} />
              </AnimatedEntry>
              <AnimatedEntry index={1} style={styles.statCardWrap}>
                <StatCard icon="cloud-outline" label="Storage Used" value={`${stats.storageUsedGb} GB`} sub={`of ${stats.storageLimitGb} GB`} />
              </AnimatedEntry>
              <AnimatedEntry index={2} style={styles.statCardWrap}>
                <StatCard icon="layers-outline" label="Collections" value={stats.collectionsCount} sub="AI generated" />
              </AnimatedEntry>
              <AnimatedEntry index={3} style={styles.statCardWrap}>
                <StatCard icon="heart-outline" label="Favorites" value={stats.favoritesCount} sub="Your saved items" />
              </AnimatedEntry>
            </>
          )}
        </View>

        {/* Recent uploads — horizontal scroll */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Uploads</Text>
          <Pressable onPress={() => router.replace('/tabs/explore')}>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filesRow}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} style={styles.fileCardSkeleton} />)
            : sortedFiles.map((file, i) => (
                <AnimatedEntry key={file._id} index={i}>
                  <FileCard file={file} />
                </AnimatedEntry>
              ))}
        </ScrollView>

        {/* Smart collections — 2-column wrap */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Smart Collections</Text>
          <Pressable onPress={() => router.replace('/tabs/explore')}>
            <Text style={styles.viewAll}>View all</Text>
          </Pressable>
        </View>

        <View style={styles.collectionsGrid}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} style={styles.collectionSkeleton} />)
            : collectionFiles.map((c, i) => (
                <AnimatedEntry key={c.name} index={i} style={styles.collectionCardWrap}>
                  <CollectionCard collection={c} />
                </AnimatedEntry>
              ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- sub-components ----------

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: any; sub: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardTop}>
        <View>
          <Text style={styles.statLabel}>{label}</Text>
          <Text style={styles.statValue}>{value}</Text>
        </View>
        <View style={styles.statIcon}>
          <Ionicons name={icon as any} size={16} color="#7c3aed" />
        </View>
      </View>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

function FileCard({ file }: { file: any }) {
  const badge = fileTypeBadge(file.fileType);
  const thumb = file.thumbnailUrl || file.url;

  return (
    <Pressy onPress={() => router.push(`/tabs/explore/${file._id}`)} style={styles.fileCard}>
      <View style={styles.fileThumb}>
        {thumb ? (
          <Image source={{ uri: thumb }} style={styles.fileThumbImage} resizeMode="cover" />
        ) : (
          <Ionicons name="document-text-outline" size={26} color="#d1d5db" />
        )}

        <View style={[styles.fileBadge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.fileBadgeText, { color: badge.color }]}>{badge.label}</Text>
        </View>

        {file.fileType === 'video' && (
          <View style={styles.playOverlay}>
            <Ionicons name="play" size={14} color="#fff" />
          </View>
        )}
      </View>
      <Text style={styles.fileTitle} numberOfLines={1}>
        {file.title}
      </Text>
      <Text style={styles.fileMeta}>{file.uploadedAgo || timeAgo(file.createdAt)}</Text>
    </Pressy>
  );
}

function CollectionCard({ collection }: { collection: any }) {
  const visual = categoryVisual(collection.name);
  return (
    <Pressy
      onPress={() => router.push(`/tabs/explore/${collection.slug}`)}
      style={styles.collectionCard}
    >
      <View style={[styles.collectionIcon, { backgroundColor: visual.bg }]}>
        <Ionicons name={visual.icon as any} size={16} color={visual.color} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={styles.collectionName} numberOfLines={1}>
          {collection.name}
        </Text>
        <Text style={styles.collectionCount}>{collection.fileCount} files</Text>
      </View>
    </Pressy>
  );
}

// ---------- styles ----------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greeting: { fontSize: 17, fontWeight: '600', color: '#111827' },
  subGreeting: { fontSize: 12.5, color: '#6b7280', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconButton: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center',
  },
  avatar: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: '#7c3aed',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, paddingHorizontal: 14,
    paddingVertical: 12, marginBottom: 18,
  },
  searchInput: { flex: 1, fontSize: 13.5, color: '#111827' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  statCardWrap: { width: '48%' },
  statCard: {
    width: '48%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 14, padding: 12, minHeight: 84,
  },
  statCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statLabel: { fontSize: 11, color: '#6b7280', marginBottom: 3 },
  statValue: { fontSize: 19, fontWeight: '700', color: '#111827' },
  statIcon: {
    width: 26, height: 26, borderRadius: 8, backgroundColor: '#f5f3ff',
    alignItems: 'center', justifyContent: 'center',
  },
  statSub: { fontSize: 10.5, color: '#9ca3af', marginTop: 6 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 13.5, fontWeight: '600', color: '#111827' },
  viewAll: { fontSize: 11.5, color: '#7c3aed' },

  filesRow: { gap: 10, paddingBottom: 22 },
  fileCard: { width: 120 },
  fileCardSkeleton: { width: 120, height: 130, borderRadius: 12, marginRight: 10 },
  fileThumb: {
    width: 120, height: 88, borderRadius: 12, backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 6,
  },
  fileThumbImage: { width: '100%', height: '100%' },
  fileBadge: { position: 'absolute', top: 6, left: 6, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2 },
  fileBadgeText: { fontSize: 9, fontWeight: '700' },
  playOverlay: {
    position: 'absolute', width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center',
  },
  fileTitle: { fontSize: 12, fontWeight: '500', color: '#111827' },
  fileMeta: { fontSize: 10.5, color: '#9ca3af', marginTop: 1 },

  collectionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  collectionCardWrap: { width: '48%' },
  collectionCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, padding: 11,
  },
  collectionSkeleton: { width: '48%', height: 54, borderRadius: 14 },
  collectionIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  collectionName: { fontSize: 12, fontWeight: '500', color: '#111827' },
  collectionCount: { fontSize: 10.5, color: '#9ca3af' },

  skeleton: { backgroundColor: '#e5e7eb', borderRadius: 12 },
});