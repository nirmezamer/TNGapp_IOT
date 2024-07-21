// WorkAJob.js
import React from 'react';
import { StyleSheet, View, Text, Button, Image } from 'react-native';

const dogImage = require('./dog_pic.jpg'); // Path to your image


export default function WorkAJob({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job page</Text>
      <Image source={dogImage} style={styles.dogImage} />
      <Text style={styles.nontitle}>What would you like to do?</Text>
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
  nontitle: {
    fontSize: 20,
    fontWeight: 'normal',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    maxWidth: 400,
  },
  dogImage: {
    width: 400, // Increased width
    height: 400, // Increased height
    resizeMode: 'contain',
    marginBottom: 20,
  },
});
