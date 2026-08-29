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
 

export default function FilesScreen() {

  const [userId, setUserId] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

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
    setFiles(data);
  }


  useEffect(()=>{
    (
      async () => {
        const raw = await SecureStore.getItemAsync('sessionData');
        if (raw) setUserId(JSON.parse(raw).userId);
      }
    )
  },[])
  const onRefresh = () => {
    setRefreshing(true);
    // loadDashboard();
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
                      <Text style={styles.greeting}>Files</Text>
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

});
 