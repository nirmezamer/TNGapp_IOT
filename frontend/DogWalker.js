// DogWalker.js
import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

export default function DogWalker({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dog Walker Page</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Find A Job" 
          onPress={() => {/* Add navigation or function here */}} 
        />
        <Button 
          title="Work A Job" 
          onPress={() => navigation.navigate('WorkAJob')} // Navigate to WorkAJob page
        />
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 400,
  },
});
