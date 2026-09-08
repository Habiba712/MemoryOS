import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';

import {
  User,
  Lock,
  LogOut,
  ChevronLeft,
  Eye,
  EyeOff,
} from 'lucide-react-native';

import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';


export default function SettingsScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('John');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

const handleLogout = async () => {
 await SecureStore.deleteItemAsync('sessionData');

  router.replace('/auth/login');

  
};
  const getUser = async () =>{
    console.log('userId', userId)
    if (!userId) return;
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/user/getUserById/${userId}`);
    if (!res.ok) throw new Error('Failed to load user');
    const data = await res.json();
    console.log('data', data)
    setUsername(data.userBase.username);
  }
  useEffect(()=>{
    (async () => {
      const raw = await SecureStore.getItemAsync('sessionData');
      console.log('raw', raw)
      if (raw) setUserId(JSON.parse(raw).userId);
    })();
  },[]);

  useEffect(()=>{
    getUser();
  },[userId]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.topBar}>
          {/* <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft
              size={24}
              color="#FFFFFF"
            />
          </Pressable> */}

          <Text style={styles.title}>
            Settings
          </Text>
        </View>


       
        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <View style={styles.card}>

          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Full Name
            </Text>

            <View style={styles.inputWrapper}>
              <User
                size={19}
                color="#7F899E"
              />

              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor="#596276"
                style={styles.input}
                autoCapitalize="none"
              />
            </View>
          </View>


        
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              New Password
            </Text>

            <View style={styles.inputWrapper}>
              <Lock
                size={19}
                color="#7F899E"
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter new password"
                placeholderTextColor="#596276"
                style={styles.input}
                secureTextEntry={!showPassword}
              />

              <Pressable
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff
                    size={19}
                    color="#7F899E"
                  />
                ) : (
                  <Eye
                    size={19}
                    color="#7F899E"
                  />
                )}
              </Pressable>
            </View>
          </View>

             <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Confirm New Password
            </Text>

            <View style={styles.inputWrapper}>
              <Lock
                size={19}
                color="#7F899E"
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter new password"
                placeholderTextColor="#596276"
                style={styles.input}
                secureTextEntry={!showPassword}
              />

              <Pressable
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff
                    size={19}
                    color="#7F899E"
                  />
                ) : (
                  <Eye
                    size={19}
                    color="#7F899E"
                  />
                )}
              </Pressable>
            </View>
          </View>


          {/* Save */}
          <Pressable style={styles.saveButton}>
            <Text style={styles.saveText}>
              Save changes
            </Text>
          </Pressable>

        </View>


        {/* Logout */}
        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
          
        >
          <LogOut
            size={20}
            color="#FF6B6B"
          />

          <Text style={styles.logoutText}>
            Log out
          </Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F16',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },


  /* Header */

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,

    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: '#141A2B',

    borderWidth: 1,
    borderColor: '#1F2740',

    marginRight: 12,
  },

  title: {
    fontSize: 25,
    fontWeight: '700',
    color: '#FFFFFF',
  },


  /* Sections */

  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',

    marginBottom: 12,
    marginLeft: 2,
  },


  /* Account card */

  card: {
    backgroundColor: '#141A2B',

    borderWidth: 1,
    borderColor: '#1F2740',

    borderRadius: 18,

    padding: 16,

    marginBottom: 30,
  },


  /* Inputs */

  inputGroup: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#AAB2C3',

    marginBottom: 8,
  },

  inputWrapper: {
    height: 50,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#0F1522',

    borderWidth: 1,
    borderColor: '#252E45',

    borderRadius: 13,

    paddingHorizontal: 13,

    gap: 10,
  },

  input: {
    flex: 1,

    fontSize: 14,
    color: '#FFFFFF',

    paddingVertical: 0,
  },


  /* Save */

  saveButton: {
    height: 48,

    borderRadius: 13,

    backgroundColor: '#1877F2',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 2,
  },

  saveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },


 

  logoutButton: {
    height: 56,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#141A2B',

    borderWidth: 1,
    borderColor: '#2A2632',

    borderRadius: 15,

    paddingHorizontal: 16,

    gap: 12,
  },

  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
});