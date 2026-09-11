import {
  NativeTabs,
  Label,
} from 'expo-router/unstable-native-tabs';
import { Icon, VectorIcon } from 'expo-router/unstable-native-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor="#0B0F16"
      tintColor="#1877F2"
    >
   <NativeTabs.Trigger name="index">
<Icon src={<VectorIcon family={MaterialIcons} name="home" />} />
  <Label>Home</Label>
</NativeTabs.Trigger>

<NativeTabs.Trigger name="explore">
 <Icon src={<VectorIcon family={MaterialIcons} name="folder" />} />
  <Label>Files</Label>
</NativeTabs.Trigger>

<NativeTabs.Trigger name="upload">
 <Icon src={<VectorIcon family={MaterialIcons} name="upload" />} />
  <Label>Upload</Label>
</NativeTabs.Trigger>

{/* <NativeTabs.Trigger name="profile">
  <Icon src={<VectorIcon family={MaterialIcons} name="person" />}
  />
  <Label>Profile</Label>
</NativeTabs.Trigger> */}

<NativeTabs.Trigger name="settings">
  <Icon src={<VectorIcon family={MaterialIcons} name="settings" />}
  />
  <Label>Settings</Label>
</NativeTabs.Trigger>
    </NativeTabs>
  );
}