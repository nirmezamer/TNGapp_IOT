// SignIn.js
import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Dimensions } from 'react-native';

export default function SignIn({ navigation }) {
  const handleSignIn = () => {
    // Perform sign-in logic here
    navigation.navigate('GoodEntrance'); // Navigate to GoodEntrance after sign in
  };

  // Get screen width
  const screenWidth = Dimensions.get('window').width;
  // Set input width to 1/3 of screen width
  const inputWidth = screenWidth / 3;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.nontitle}>Please enter your email and password</Text>
      <TextInput placeholder="Email" style={[styles.input, { width: inputWidth }]} />
      <TextInput placeholder="Password" secureTextEntry style={[styles.input, { width: inputWidth }]} />
      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={handleSignIn} />
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
