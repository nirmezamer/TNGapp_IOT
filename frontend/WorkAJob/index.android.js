// WorkAJob.js
import React from 'react';
import { StyleSheet, View, Text, Button, Image, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const dogImage = require('../dog_pic.jpg'); // Path to your image

export default function WorkAJob() {
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;

  // Define actions for each button
  const startJob = () => {
    if (Platform.OS === 'web') {
      alert("Starting job..."); // Example alert for web; replace with actual function if needed
    } else {
      navigation.navigate('JobDetails'); // Navigate or trigger action on mobile
    }
  };

  const endJob = () => {
    if (Platform.OS === 'web') {
      alert("Ending job..."); // Example alert for web; replace with actual function if needed
    } else {
      navigation.navigate('JobSummary'); // Navigate or trigger action on mobile
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job page</Text>
      <Image source={dogImage} style={[styles.dogImage, { width: screenWidth * 0.8 }]} />
      <Text style={styles.nontitle}>What would you like to do?</Text>
      <View style={styles.buttonContainer}>
        <Button title="Start A Job" onPress={startJob} />
        <Button title="End A Job" onPress={endJob} />
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
    height: 400,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});
