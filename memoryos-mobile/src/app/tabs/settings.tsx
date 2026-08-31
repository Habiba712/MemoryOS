import {View, Text, Pressable, StyleSheet, Image, ScrollView} from 'react-native';


export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topBar}>
        
          <Text style={styles.greeting}>Hi, John</Text>
         
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F16', paddingBottom: 40 },
  scrollContent: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 40 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 40,
  },
  iconButton: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 34, height: 34, borderRadius: 10 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  subGreeting: { fontSize: 13.5, color: '#8b93a7', marginBottom: 18 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#141a2b',
    borderWidth: 1, borderColor: '#1f2740', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13,
    marginBottom: 24,
  },
  searchInput: { flex: 1, fontSize: 13.5, color: '#fff' },
});