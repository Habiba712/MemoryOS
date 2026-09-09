import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
 import * as SplashScreen from 'expo-splash-screen';
import * as SecureStore from 'expo-secure-store';
import MemoryOSSplash from '@/components/mySplash';
import { storage } from '../services/storage';
import { router } from 'expo-router';


SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    async function prepare() {
     await SplashScreen.hideAsync(); 
      await new Promise(resolve => setTimeout(resolve, 3000));
      const hasOnboarded = await storage.getItem('onboarded');
      
      if(!hasOnboarded){
        router.replace('/onboarding');
      }
      await SplashScreen.hideAsync();

      setShowSplash(false);
    }

    prepare();
  }, []);
  return (
    <>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="tabs" />
    </Stack>
    {showSplash && <MemoryOSSplash />}
    </>
    
  );
}