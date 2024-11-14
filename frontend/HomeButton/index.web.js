// HomeButton.js
import React from 'react';
import { Button, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeButton() {
  const navigation = useNavigation();

  return (
    <View style={styles.buttonContainer}>
      <Button
        onPress={() => navigation.navigate('GoodEntrance')}
        title="Home"
        color="#000"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginRight: 10, // Add margin to the right
  },
});
