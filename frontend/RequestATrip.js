// RequestATrip.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const cities = [
  { label: 'Tel Aviv', value: 'Tel Aviv' },
  { label: 'Jerusalem', value: 'Jerusalem' },
  { label: 'Haifa', value: 'Haifa' },
  { label: 'Ashdod', value: 'Ashdod' },
  { label: 'Beersheba', value: 'Beersheba' },
  // Add more cities as needed
];

const RequestATrip = () => {
  const [ownerName, setQwnerName] = useState('');
  const [dogName, setDogName] = useState('');
  const [city, setCity] = useState('Tel Aviv');
  const [address, setAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [phone, setPhone] = useState('+972');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    setDate(date.toLocaleDateString());
    setDatePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    setTime(time.toLocaleTimeString());
    setTimePickerVisibility(false);
  };

  const handleSubmit = () => {
    if (houseNumber > 300 || apartmentNumber > 300) {
      Alert.alert('Error', 'House Number and Apartment Number must be between 1 and 300');
      return;
    }

    const phoneRegex = /^\+972[2-9][0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Error', 'Phone number must be in the format +972XXXXXXXXX');
      return;
    }

    // Handle form submission logic here
    Alert.alert('Success', 'Trip Request Submitted');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.label}>Owner Name:</Text>
      <TextInput
        style={styles.input}
        value={ownerName}
        onChangeText={setQwnerName}
      />

      <Text style={styles.label}>Dog Name:</Text>
      <TextInput
        style={styles.input}
        value={dogName}
        onChangeText={setDogName}
      />

      <Text style={styles.label}>City:</Text>
      <RNPickerSelect
        style={pickerSelectStyles}
        onValueChange={(value) => setCity(value)}
        items={cities}
        value={city}
      />

      <Text style={styles.label}>Address:</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>House Number:</Text>
      <TextInput
        style={styles.input}
        keyboardType='numeric'
        value={houseNumber}
        onChangeText={(value) => setHouseNumber(Number(value))}
      />

      <Text style={styles.label}>Apartment Number:</Text>
      <TextInput
        style={styles.input}
        keyboardType='numeric'
        value={apartmentNumber}
        onChangeText={(value) => setApartmentNumber(Number(value))}
      />

      <Text style={styles.label}>Phone:</Text>
      <TextInput
        style={styles.input}
        keyboardType='phone-pad'
        value={phone}
        onChangeText={setPhone}
      />

      <Text style={styles.label}>Date:</Text>
      <Button title="Select Date" onPress={() => setDatePickerVisibility(true)} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />

      <Text style={styles.label}>Time:</Text>
      <Button title="Select Time" onPress={() => setTimePickerVisibility(true)} />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisibility(false)}
      />

      <Button title="Submit Request" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  inputAndroid: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});

export default RequestATrip;
