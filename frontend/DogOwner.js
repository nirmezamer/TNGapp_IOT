// DogOwner.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DogOwner = () => {
  const navigation = useNavigation();

  const goToRequestATrip = () => {
    navigation.navigate('RequestATrip');
  };
  
  const goToWhereIsMyDog = () => {
    navigation.navigate('WhereIsMyDog');
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.counterText}>Counter: 0</Text>
      <View style={styles.buttonContainer}>
        <Button title="Where Is My Dog?" onPress={goToWhereIsMyDog} />
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

export default DogOwner;
