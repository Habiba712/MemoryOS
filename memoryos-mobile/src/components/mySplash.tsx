import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';

export default function MemoryOSSplash() {
  return (
    <View style={styles.container}>

     
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/brain.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* App name */}
      <Text style={styles.title}>
        MemoryOS
      </Text>

      <Text style={styles.subtitle}>
        Your second brain
      </Text>

      {/* Loading */}
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="small"
          color="#4D9CFF"
        />

        <Text style={styles.loadingText}>
          Loading...
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: '#07111F',

    alignItems: 'center',
    justifyContent: 'center',

    zIndex: 9999,
  },

  logoContainer: {
    width: 82,
    height: 82,

    borderRadius: 22,

    backgroundColor: '#174B91',

    borderWidth: 1,
    borderColor: '#3978C9',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 16,
  },

  logo: {
    width: 58,
    height: 58,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',

    color: '#FFFFFF',

    marginTop: 2,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: '400',

    color: '#FFFFFF',

    marginTop: 4,
  },

  loadingContainer: {
    position: 'absolute',

    bottom: 50,

    alignItems: 'center',
  },

  loadingText: {
    marginTop: 8,

    fontSize: 11,

    color: '#FFFFFF',
  },
});