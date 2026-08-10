import { NativeTabs, Label , Icon} from 'expo-router/unstable-native-tabs';
import { StyleSheet} from 'react-native';

export default function AppTabs() {
  return (
    <NativeTabs 
    backgroundColor={'pink'}
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
         {/* <Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          
        /> */}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <Label>Files</Label>
        {/* <Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          
        /> */}
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="upload">
        <Label>Upload</Label>
        {/* <Icon
          src={require('@/assets/images/tabIcons/explore.png')}
          
        /> */}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

 