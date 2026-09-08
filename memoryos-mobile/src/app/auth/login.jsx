import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    setLoading(true);
    console.log('email',email);
    console.log('password',password);

    try {
      // router.replace('/tabs');

         const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`
          , {
        method: "POST",
        headers: { "content-Type": "application/json" },
        // credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('resss',data);

      if (!res.ok) {
        setError(data.message || 'Invalid email or password.');
        return;
      }
 
  await SecureStore.setItemAsync('sessionData', JSON.stringify(data));
  console.log('data',data);
      await SecureStore.setItemAsync('onboarded', JSON.stringify(true));

      router.replace('/tabs');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const raw = await SecureStore.getItemAsync('onboarded');
      const getSessionData = await SecureStore.getItemAsync('sessionData');
      console.log('rawjjj', raw)
      const getToken = getSessionData ? JSON.parse(getSessionData).token : null;
      console.log('getToken', getToken)
      if (raw && getToken) router.replace('/tabs');
    })();
  },[router]);
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.logo}>
          Memory<Text style={styles.logoAccent}>OS</Text>
        </Text>

        <Text style={styles.subtitle}>
          Your AI-powered second brain.{'\n'}
          Find anything. Instantly.
        </Text>
      </View>

      <View style={styles.card}>

        <Text style={styles.title}>Welcome back 👋</Text>

        <Text style={styles.description}>
          Log in to continue to your MemoryOS
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email address</Text>

          <View style={styles.inputContainer}>
            <Mail size={18} color="#6b7280" />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#6b7280"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.field}>

          <View style={styles.passwordHeader}>
            <Text style={styles.label}>Password</Text>

            <Pressable
              onPress={() => router.push('/auth/forgot-password')}
            >
              <Text style={styles.forgot}>
                Forgot password?
              </Text>
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <Lock size={18} color="#6b7280" />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#6b7280"
              secureTextEntry={!showPassword}
              style={styles.input}
            />

            <Pressable
              onPress={() => setShowPassword((value) => !value)}
            >
              {showPassword ? (
                <EyeOff size={18} color="#6b7280" />
              ) : (
                <Eye size={18} color="#6b7280" />
              )}
            </Pressable>
          </View>
        </View>

        {/* Error */}
        {error !== '' && (
          <Text style={styles.error}>
            {error}
          </Text>
        )}

        {/* Login */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>
              Log in
            </Text>
          )}
        </Pressable>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>
            or continue with
          </Text>
          <View style={styles.divider} />
        </View>

        {/* Google */}
        <Pressable style={styles.googleButton}>
          <Text style={styles.googleText}>
            Continue with Google
          </Text>
        </Pressable>

        {/* Register */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            Don't have an account?{' '}
          </Text>

          <Pressable
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.registerLink}>
              Create one
            </Text>
          </Pressable>
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b14',
    paddingHorizontal: 24,
    paddingTop: 70,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
  },

  logo: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
  },

  logoAccent: {
    color: '#a78bfa',
  },

  subtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 21,
  },

  card: {
    backgroundColor: '#12121f',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
  },

  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },

  description: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 24,
  },

  field: {
    marginBottom: 18,
  },

  label: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 7,
  },

  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  forgot: {
    color: '#a78bfa',
    fontSize: 12,
  },

  inputContainer: {
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },

  input: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },

  error: {
    color: '#f87171',
    fontSize: 13,
    marginBottom: 12,
  },

  loginButton: {
    height: 46,
    borderRadius: 8,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPressed: {
    opacity: 0.8,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  loginText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 24,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  dividerText: {
    color: '#6b7280',
    fontSize: 12,
  },

  googleButton: {
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  googleText: {
    color: '#1f2937',
    fontSize: 14,
    fontWeight: '600',
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  registerText: {
    color: '#9ca3af',
    fontSize: 14,
  },

  registerLink: {
    color: '#a78bfa',
    fontSize: 14,
    fontWeight: '600',
  },
});