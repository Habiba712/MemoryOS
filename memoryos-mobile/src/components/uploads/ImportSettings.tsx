
import { StyleSheet, Text, View } from "react-native";

export default function ImportSettings(){
    return(
        <View style={styles.wrap}>
            <Text>Import Settings</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B0F16',
        padding: 50
    },
      wrap: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
})