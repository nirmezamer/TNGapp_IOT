// GoodEntrance.js
import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Button, Image } from 'react-native';

const dogImage = require('./dog_pic.jpg'); // Path to your image


export default function GoodEntrance({ navigation }) {

  useEffect(() => {
    const storeToken = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');  // Get the token from URL parameters

      if (token) {
        // Store token in localStorage
        localStorage.setItem('authToken', token);

        // Optionally, navigate the user somewhere after storing the token
        // e.g., to the homepage or dashboard
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
    width: 400, // Increased width
    height: 400, // Increased height
    resizeMode: 'contain',
    marginBottom: 20,
  },
});
