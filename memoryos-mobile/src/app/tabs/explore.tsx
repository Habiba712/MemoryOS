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



export default function FilesScreen() {

  const [userId, setUserId] = useState<string | null>(null);
  const [files, setFiles] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);


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
    loadDashboard();
  };

  useEffect(()=>{
    getFiles();
  },[userId])
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
    
     <Text>My fileiis</Text>
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
    marginBottom: 18,
    marginTop: 40,
  },
  iconButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },

});
 