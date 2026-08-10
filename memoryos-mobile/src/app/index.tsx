import * as Device from 'expo-device';
import { Platform, StyleSheet, Text, View } from 'react-native';
import LoginScreen from '@/app/auth/login';
 
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

 
export default function HomeScreen() {
  return (
   <View 
   style={styles.container}
   >  
     <Text style={styles.title}>Welcome to my app :)</Text>
     <LoginScreen />
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
