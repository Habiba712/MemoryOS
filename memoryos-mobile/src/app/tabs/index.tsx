import * as Device from 'expo-device';
import { Platform, StyleSheet, Text, View, ActivityIndicator, Pressable } from 'react-native';
import LoginScreen from '@/app/auth/login';
 
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { router } from 'expo-router';

import * as  SecureStore from "expo-secure-store";
import { useState, useEffect } from 'react';

 
export default function HomeScreen() {

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const handleLogout = async () => {
    const getToken = await SecureStore.getItemAsync('token');
    console.log('getToken', getToken);
  await SecureStore.deleteItemAsync('token');
  router.replace('/auth/login');
};

  // if (loading){
  //   return(
  //     <View>
  //             <ActivityIndicator/>

  //     </View>
  //   )
  // }
  return (
   <View 
   style={styles.container}
   >  
   {(loading)? 
   <Text style={styles.title}>Welcome to my app please wait :) </Text>
   : 
   <View>
     <Text style={styles.title}>Welcome to my app :) </Text>
   <Pressable 
   
   onPress={()=>handleLogout()}>
     <Text style={styles.logoutButton}>Logout</Text>
   </Pressable>
   
   </View>
  

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
    backgroundColor: 'pink',
   

    
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
  logoutButton:{
    color: 'red',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'red',
  }
});
