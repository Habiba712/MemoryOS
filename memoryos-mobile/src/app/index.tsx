import * as Device from 'expo-device';
import { Platform, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import LoginScreen from '@/app/auth/login';
 
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { router } from 'expo-router';

import * as  SecureStore from "expo-secure-store";
import { useState, useEffect } from 'react';

 
export default function HomeScreen() {

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  useEffect(()=>{

    const checkAuth = async ()=> {
        const getToken = await SecureStore.getItemAsync('token');
        if(!getToken){
          router.replace('/auth/login')
        }
        setToken(getToken as string)
        setLoading(false)

       
    }

    checkAuth()
  },[])

  if (loading){
    return(
      <View>
              <ActivityIndicator/>

      </View>
    )
  }
  return (
   <View 
   style={styles.container}
   >  
   {(!loading && token )? 
   <Text style={styles.title}>Welcome to my app :) </Text>
   : (!loading && !token) &&
<LoginScreen />
   }
     
     {/* <LoginScreen /> */}
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: 50,
   

    
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: { 
    textAlign: 'center',
    color: 'pink',
     fontFamily: 'sans',
    fontSize: 30,

  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
