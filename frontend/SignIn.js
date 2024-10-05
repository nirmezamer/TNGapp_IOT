// SignIn.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import config from './config';

export default function SignIn() {
  const handleGoogleSignIn = () => {
    // Navigate to the backend endpoint for Google OAuth
    window.location.href = `${config.getBaseUrl()}/api/auth/google`; // Update to match your Azure Function URL
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://your-logo-url.com/logo.png' }} // Replace with your logo URL
          style={styles.logo}
        />
      </View>
      <Text style={styles.title}>Sign In with Google</Text>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png' }}
          style={styles.googleLogo}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  googleLogo: {
    width: 40,  
    height: 40, 
    resizeMode: 'contain',
  },
});
