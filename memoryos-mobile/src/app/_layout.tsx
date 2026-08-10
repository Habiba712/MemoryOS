
import AppTabs from '@/components/app-tabs';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import LoginScreen from './auth/login';
 

export default function RootLayout() {

  const [token, setToken] = useState("");

 useEffect(()=>{

 const checkAuth = async ()=> {
        const getToken = await SecureStore.getItemAsync('token');
        if(!getToken){
          router.replace('/auth/login')
        }
        setToken(getToken as string)
 }
 },[]);
  return (
    
   token ? <AppTabs /> : <LoginScreen />
  );
}