import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';



export default function LoginScreen() {

    const handleLogin = () => {
        console.log('login')
        
      }
  return (
    <View style={styles.container}>
        
      <Text style={styles.title}>Login Screen</Text>
      <View>
        <Text style={styles.inputText}>Email</Text>
        <TextInput style={styles.input} />
      </View>
      <Pressable 
      style={styles.buttonContainer}
      onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
    width: '100vw',
    height: '100%',
  },
    title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer:{
    backgroundColor: 'navy',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonText:{
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 4,
    paddingLeft: 4,
    paddingTop: 2,
    paddingBottom: 2,
  },
  inputText:{
    color: 'black',
    fontSize: 18,
    fontWeight: 'semibold',
  },
  input:{
    borderWidth: 1,
    borderRadius: 20,
    borderColor: 'gray',
  }
});