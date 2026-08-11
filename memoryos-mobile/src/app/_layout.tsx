import AppTabs from '@/components/app-tabs';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import LoginScreen from './auth/login';

export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const storedToken = await SecureStore.getItemAsync('token');

      setToken(storedToken);
      setChecking(false);
    }

    checkAuth();
  }, []);

  if (checking) {
    return null;
  }

  if (!token) {
    return <LoginScreen />;
  }

  return <AppTabs />;
}