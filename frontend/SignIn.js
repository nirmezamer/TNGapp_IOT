// SignIn.js
import React from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

export default function SignIn() {
  const handleGoogleSignIn = () => {
    // Navigate to the backend endpoint for Google OAuth
    window.location.href = 'http://localhost:7071/api/auth/google'; // Update to match your Azure Function URL
  };

  // Get screen width
  const screenWidth = Dimensions.get('window').width;
  // Set input width to 1/3 of screen width
  const inputWidth = screenWidth / 3;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} />
      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={handleSignIn} />
      </View>
      <Text style={styles.title}>Sign In with Google</Text>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png' }}
          style={styles.googleLogo}
        />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
  },
});
