// DogOwner.js
import React from 'react';
import { StyleSheet, View, Text, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const dogImage = require('./dog_pic.jpg'); // Path to your image

const DogOwner = () => {
  const navigation = useNavigation();

  const goToRequestATrip = () => {
    navigation.navigate('RequestATrip');
  };
  
  const goToGetAllUserJobs = () => {
    navigation.navigate('GetAllUserJobs');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Dog Owner!</Text>
      <Image source={dogImage} style={styles.dogImage} />

      <Text style={styles.nontitle}>What would you like to do?</Text>

      <View style={styles.buttonContainer}>
        <Button title="All my Jobs" onPress={goToGetAllUserJobs} />
        <Button title="Request A Trip" onPress={goToRequestATrip} />
      </View>
    </View>
  );
};

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

export default DogOwner;
