// GoodEntrance.js
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Button, Image, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

const dogImage = require('../dog_pic.jpg'); // Path to your image

export default function GoodEntrance({ navigation }) {
  useEffect(() => {
    const storeToken = async () => {
      if (Platform.OS === 'web') {
        // Web: Get the token from URL parameters and store it in localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const user_name = urlParams.get('user_name');
        if (token) {
          localStorage.setItem('authToken', token);
        }
        if (user_name) {
          localStorage.setItem('user_name', user_name);
        }
      } else {
        // Mobile (Android/iOS): Use deep linking with AsyncStorage
        const url = await Linking.getInitialURL();
        if (url) {
          const urlParams = new URLSearchParams(url.split('?')[1]);
          const token = urlParams.get('token');
          const user_name = urlParams.get('user_name');
          if (token) {
            await AsyncStorage.setItem('authToken', token);
          }
          if (user_name) {
            await AsyncStorage.setItem('user_name', user_name);
          }
        }
      }
    };

    storeToken();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
      <Image source={dogImage} style={styles.dogImage} />

      <Text style={styles.nontitle}>Who are you today?</Text>
      <View style={styles.buttonContainer}>
        <Button title="Dog Owner" onPress={() => navigation.navigate('DogOwner')} />
        <Button title="Dog Walker" onPress={() => navigation.navigate('DogWalker')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  nontitle: {
    fontSize: 20,
    fontWeight: 'normal',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    maxWidth: 300,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dogImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});
