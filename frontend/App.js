import 'react-native-gesture-handler'; // Make sure this is at the top of your file
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import DogOwner from './DogOwner';
import RequestATrip from './RequestATrip';
import DogWalker from './DogWalker';
import WhereIsMyDog from './WhereIsMyDog';
import SignIn from './SignIn'; // Import SignIn
import SignUp from './SignUp'; // Import SignUp
import GoodEntrance from './GoodEntrance'; // Import GoodEntrance
import WorkAJob from './WorkAJob'; // Import WorkAJob
import JobDetails from './JobDetails'; // Import JobDetails (new page)
import HomeButton from './HomeButton'; // Import HomeButton
import UserJobList from './UserJobList'; // Import UserJobList
import "./app.css";

const dogImage = require('./dog_pic.jpg'); // Path to your image

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Dog Walking App</Text>
      <Image source={dogImage} style={styles.dogImage} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  dogImage: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  signInButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center', // Ensure content is centered horizontally
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    width: 150, // You can adjust this width to your needs
  },
  signInButtonText: {
    color: '#333',
    fontSize: 16,
    textAlign: 'center', // Center the text inside the button
  },
});

export default function App() {
  const linking = {
    prefixes: [Linking.createURL('/')],
    config: {
      screens: {
        Home: '',
        SignIn: 'signin',
        SignUp: 'signup',
        GoodEntrance: 'GoodEntrance',
        DogOwner: 'DogOwner',
        DogWalker: 'DogWalker',
        RequestATrip: 'RequestATrip',
        WhereIsMyDog: 'WhereIsMyDog',
        WorkAJob: 'WorkAJob',
        JobDetails: 'jobs/:id', // Add dynamic job details screen
        UserJobList: 'GetAllUserJobs/:user_name',
      },
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerRight: () =>
            route.name !== 'Home' && route.name !== 'SignIn' ? <HomeButton /> : null,
        })}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="GoodEntrance" component={GoodEntrance} />
        <Stack.Screen name="DogOwner" component={DogOwner} />
        <Stack.Screen name="DogWalker" component={DogWalker} />
        <Stack.Screen name="WhereIsMyDog" component={WhereIsMyDog} />
        <Stack.Screen name="RequestATrip" component={RequestATrip} />
        <Stack.Screen name="WorkAJob" component={WorkAJob} />
        <Stack.Screen name="JobDetails" component={JobDetails} />
        <Stack.Screen name="UserJobList" component={UserJobList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
