// App.js
import 'react-native-gesture-handler'; // Make sure this is at the top of your file
import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DogOwner from './DogOwner';
import RequestATrip from './RequestATrip';
import DogWalker from './DogWalker';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [counter, setCounter] = React.useState(0);

  const increaseCounter = () => {
    fetch("https://tngapp.azurewebsites.net/api/increasecounter", {
      method: 'GET',
    }).then((response) => {
      return response.text();
    }).then((text) => {
      setCounter(parseInt(text));
    }).catch((error) => {
      console.error(error);
    });
  };

  const decreaseCounter = () => {
    fetch("https://tngapp.azurewebsites.net/api/decreasecounter", {
      method: 'GET',
    }).then((response) => {
      return response.text();
    }).then((text) => {
      setCounter(parseInt(text));
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.counterText}>Counter: {counter}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Dog Walker" onPress={() => navigation.navigate('DogWalker')} />
        <Button title="Dog Owner" onPress={() => navigation.navigate('DogOwner')} />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DogOwner" component={DogOwner} />
        <Stack.Screen name="DogWalker" component={DogWalker} />
        <Stack.Screen name="RequestATrip" component={RequestATrip} />
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
  },
  counterText: {
    fontSize: 32,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});
