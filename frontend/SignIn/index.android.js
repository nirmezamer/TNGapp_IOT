// SignIn.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import config from '../config';

const CLIENT_ID = 'your-google-client-id'; // Replace with your Google Client ID
const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy: true });

export default function SignIn({ navigation }) {
  const handleGoogleSignIn = async () => {
    navigation.navigate('GoodEntrance')
    // const authUrl = `${config.getBaseUrl()}/api/auth/google`;
    // const result = await AuthSession.startAsync({ authUrl });

    // if (result.type === 'success') {
    //   // Handle successful sign-in, such as storing token
    //   Alert.alert('Success', 'Signed in successfully!');
    // } else {
    //   Alert.alert('Error', 'Failed to sign in with Google');
    // }
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
