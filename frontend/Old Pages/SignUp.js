// SignUp.js
import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Dimensions } from 'react-native';

export default function SignUp({ navigation }) {
  const handleSignUp = () => {
    // Perform sign-up logic here
    navigation.navigate('Home'); // Navigate to Home page (landing page) after sign up
  };

  const screenWidth = Dimensions.get('window').width;
  const inputWidth = screenWidth / 3; // 1/3 of the page width

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Come join us!</Text>
      <Text style={styles.nontitle}>Please register below</Text>
      <TextInput placeholder="First Name" style={[styles.input, { width: inputWidth }]} />
      <TextInput placeholder="Last Name" style={[styles.input, { width: inputWidth }]} />
      <TextInput placeholder="Email" style={[styles.input, { width: inputWidth }]} />
      <TextInput placeholder="Password" secureTextEntry style={[styles.input, { width: inputWidth }]} />
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleSignUp} />
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
