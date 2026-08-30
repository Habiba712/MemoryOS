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
  Image,
} from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
// import { FaInstagram, FaYoutube } from "react-icons/fa";


const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'image', label: 'Images' },
  { key: 'documents', label: 'Documents' },
  { key: 'links', label: 'Links' },
  { key: 'others', label: 'Others' },
];
 function getItemVisual(item: any) {
  if (item.fileType === 'pdf') return { icon: 'document-text', bg: '#3a1a1a', color: '#ff6b6b' };
  if (item.fileType === 'image') return { icon: 'image', bg: '#0f2b2b', color: '#4fd1c5' };
  if (item.fileType === 'video') return { icon: 'play', bg: '#1c1230', color: '#a685ff' };
  if (item.platform === "Instagram") return {icon: 'logo-instagram', bg: '#3a1a33', color: '#e35bb8'};
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

 
export default function FilesScreen() {

  const [userId, setUserId] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    const handleSearchSubmit = () => {
    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query)}`);
  };


  const getFiles = async () =>{
    if (!userId) return;
    console.log('userId', userId)
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/file/filesByUser/${userId}`);
    if (!res.ok) throw new Error('Failed to load files');
    const data = await res.json();
    // console.log('data', data)
    setFiles(data);
    console.log('refreshing', refreshing)
    setLoading(false);
    setRefreshing(false);
  }


   useEffect(() => {
      (async () => {
        const raw = await SecureStore.getItemAsync('sessionData');
        console.log('raw', raw)
        if (raw) setUserId(JSON.parse(raw).userId);
      })();
    }, []);
  const onRefresh = () => {
    setRefreshing(true);
    getFiles();
  };

  useEffect(()=>{
    getFiles();
  },[userId])

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
  
  return (
   <View style={styles.container}>
    <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4d9cff"
            
            />}
          >
             <View style={styles.topBar}>
              <Pressable style={styles.iconButton} onPress={() => router.push('/menu')}>
                <Ionicons name="menu" size={20} color="#fff" />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={18} color="#fff" />
              </Pressable>
            </View>
            <View style={styles.filesContainer}>
                      <Text style={styles.greeting}>Files </Text>
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
              
            </View>
     <FilterTabs active={activeFilter} onChange={setActiveFilter} />

       <View style={[viewMode === "list" ? styles.filesList : styles.fileCol]}>
               {loading
                 ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} style={styles.fileRowSkeleton} />)
                 : files.map((file, i) => {
                   const visual = getItemVisual(file);
                   return (
               <AnimatedEntry key={file._id} index={i}>
                         <Pressy style={[viewMode === "list" ? styles.fileRow : styles.fileColItem]} onPress={() =>
                           router.push({
                             pathname: "/files/[id]",
                             params: { id: file._id, type: "socials" },
                           })
                         }
     
                         >
                           <View style={[viewMode === "grid" ? styles.fileThumbnailContainer : {  
        
         position: "relative",borderWidth:1, borderColor: "#1f2740", borderRadius: 14}]}>
                             <Image
                               style={[viewMode === "grid" ? styles.fileThumbnail : { width: 70, height: 70, borderRadius: 10}]}
                               source={{ uri: file.thumbnailUrl || file.url }}
                               resizeMode="cover"
                             />
                             <View style={[viewMode === "list" ? {opacity: 0.8,width: 20, height: 20,position: "absolute",top: 47, left: 3, right: 10, bottom: 0, borderRadius: 10} : {opacity: 0.8,width: 30, height: 30, position: "absolute", top: 117, left: 5, right: 10, bottom: 0, backgroundColor:visual.bg, borderRadius: 10}]}>
                                <Ionicons name={visual.icon as any} size={viewMode === "list" ? 20 : 30} 
                                style={viewMode === "list"  ? {opacity: 0.8, borderRadius: 5, display:"flex", justifyContent: "center", alignItems: "center"} : {opacity: 0.8,borderRadius: 10, display:"flex", justifyContent: "center", alignItems: "center"}}
                                backgroundColor={visual.bg}
                               
                                 color={visual.color} /> 
                             </View>
                             
                           </View>
                           <View style={[viewMode === "grid" ? styles.fileInfoContainer : {width: "80%", display: "flex", flexDirection: "row", 
                            color:"#fff", justifyContent: "space-between", alignItems: "flex-start", borderRadius: 14, paddingRight:10}]}>
                             <View style={viewMode === "list" ? {display: "flex", flexDirection: "column", justifyContent: "space-between", gap:5,alignItems: "flex-start",} :
                               {display: "flex", flexDirection: "column", justifyContent: "flex-start", gap:5,alignItems: "flex-start", paddingHorizontal: 10, paddingVertical: 15}
                             }>
                                <Text style={styles.fileTitle} numberOfLines={1}>
                               {file.title}
                             </Text>
                             <Text style={styles.fileMeta}>
                               {timeAgo(file.createdAt)} · {file.category}
                             </Text>
                             </View>
                            
                               <Pressable hitSlop={10} style={viewMode === "grid" ? {display: "none"} : {}}>
                             <Ionicons name="ellipsis-vertical" size={16} color="#5c667a" /> 
                           </Pressable>
                           </View>
     
                         </Pressy>
                       </AnimatedEntry>
                   );
                 })}
                   
               <Text style={styles.viewAll}>See all</Text>
             
             </View>
     
          </ScrollView>
     
   </View>
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
    marginBottom: 50,

  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
    marginTop: 40,
  },
  iconButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  greeting: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#141a2b',
    borderWidth: 1, borderColor: '#1f2740', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 9,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontSize: 13.5, color: '#fff' },
filesContainer:{
  paddingVertical: 10,
  
},
tabsWrap: { paddingHorizontal: 10, marginBottom: 18 },
  tabsRow: { flexDirection: 'row', gap: 18 },
  tab: { paddingBottom: 8 },
  tabText: { fontSize: 13, color: '#5c667a', fontWeight: '500' },
  tabTextActive: { color: '#4d9cff', fontWeight: '600' },
  tabUnderline: { position: 'relative', bottom: 0, height: 2, backgroundColor: '#4d9cff', borderRadius: 1 },
   skeleton: { backgroundColor: '#141a2b' },
   quickTileWrap: { flex: 1 },
  quickTileSkeleton: { flex: 1, height: 88, borderRadius: 14 },
  quickTile: {
    flex: 1, backgroundColor: '#141a2b', borderWidth: 1, borderColor: '#1f2740',
    borderRadius: 14, padding: 10, alignItems: 'flex-start',
  },
  quickTileIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  quickTileLabel: { fontSize: 11.5, color: '#c9d3e0', marginBottom: 2 },
  quickTileCount: { fontSize: 15, fontWeight: '700', color: '#fff' },
  fileCol: {
    flexDirection: "row",
    // borderWidth: 1,
    // borderColor: "#1f2740",
    flexWrap: "wrap",
    width: "100%",
    gap: 12,
    justifyContent: "space-between",
    paddingBottom: 50

  },
  fileColItem: {

    borderWidth: 1,
    borderColor: "#1f2740",
    borderRadius: 14,
    display: "flex",
    flexDirection: "column",
    // gap: 12,
    flexGrow: 1,
    width: 180,
    padding: 12,


  },
  fileThumbnailContainer:{
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    position: "relative",
  },
  fileThumbnail: {
  width: 150,
  height: 150,
  borderRadius: 10,
},
  filesList: { gap: 8, paddingBottom: 50 },
  fileRow: {
    flexDirection: 'row', alignItems: 'flex-start',justifyContent:'flex-start', gap: 12, backgroundColor: '#141a2b',
    borderWidth: 1, borderColor: '#1f2740', borderRadius: 14, padding: 12,
  },
 fileTitle: { fontSize: 13.5, fontWeight: '600', color: '#fff', marginBottom: 2 },
  fileInfoContainer:{
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
},
  fileMeta: { fontSize: 11.5, color: '#5c667a' },
});
 