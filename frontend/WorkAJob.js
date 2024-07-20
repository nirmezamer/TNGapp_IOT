// WorkAJob.js
import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

export default function WorkAJob({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Work A Job Page</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Start A Job" 
          onPress={() => {/* Add navigation or function here */}} 
        />
        <Button 
          title="End A Job" 
          onPress={() => {/* Add navigation or function here */}} 
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
