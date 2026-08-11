import { NativeTabs, Label, Icon } from 'expo-router/unstable-native-tabs';

export default function AppTabs() {
  return (
    <NativeTabs
      backgroundColor="#0B0F16"
      tintColor="#1877F2"
      labelStyle={{
        color: '#8A93A3',
        fontSize: 11,
      }}
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>

        <Icon
          sf="house"
          drawable="home"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <Label>Files</Label>

        <Icon
          sf="folder"
          drawable="folder"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="upload">
        <Label>Upload</Label>

        <Icon
          sf="square.and.arrow.up"
          drawable="square.and.arrow.up"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}