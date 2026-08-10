import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import AppTabs from '@/components/app-tabs';

 

export default function RootLayout() {
 
  return (
    <AppTabs />
  );
}