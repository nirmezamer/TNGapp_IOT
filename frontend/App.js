// App.js
import 'react-native-gesture-handler'; // Make sure this is at the top of your file
import React from 'react';
import { StyleSheet, View, Text, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DogOwner from './DogOwner';
import RequestATrip from './RequestATrip';
import DogWalker from './DogWalker';
import WhereIsMyDog from './WhereIsMyDog';
import SignIn from './SignIn'; // Import SignIn
import SignUp from './SignUp'; // Import SignUp
import GoodEntrance from './GoodEntrance'; // Import GoodEntrance
import WorkAJob from './WorkAJob'; // Import GoodEntrance

const dogImage = require('./dog_pic.jpg'); // Path to your image

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Dog Walking App</Text>
      <Image source={dogImage} style={styles.dogImage} />
      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={() => navigation.navigate('SignIn')} />
        <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="GoodEntrance" component={GoodEntrance} />
        <Stack.Screen name="DogOwner" component={DogOwner} />
        <Stack.Screen name="DogWalker" component={DogWalker} />
        <Stack.Screen name="WhereIsMyDog" component={WhereIsMyDog} />
        <Stack.Screen name="RequestATrip" component={RequestATrip} />
        <Stack.Screen name="WorkAJob" component={WorkAJob} />
      </Stack.Navigator>
    </NavigationContainer>
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  dogImage: {
    width: 400, // Increased width
    height: 400, // Increased height
    resizeMode: 'contain',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Changed from space-between to space-around
    width: '100%',
    maxWidth: 400,
  },
});
