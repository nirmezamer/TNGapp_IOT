// GoodEntrance.js
import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

export default function GoodEntrance({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App!</Text>
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
});