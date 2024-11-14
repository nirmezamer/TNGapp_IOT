import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import format from 'date-fns/format';
import config from '../config';

// Conditionally import react-datepicker for web
let DatePicker;
if (Platform.OS === 'web') {
  DatePicker = require('react-datepicker').default;
  require('react-datepicker/dist/react-datepicker.css'); // Import styles for the date picker
}

const cities = [
  { label: 'Tel Aviv', value: 'Tel Aviv' },
  { label: 'Jerusalem', value: 'Jerusalem' },
  { label: 'Haifa', value: 'Haifa' },
  { label: 'Ashdod', value: 'Ashdod' },
  { label: 'Beersheba', value: 'Beersheba' },
];

const durationOptions = [
  { label: '15 minutes', value: '15' },
  { label: '30 minutes', value: '30' },
  { label: '45 minutes', value: '45' },
  { label: '60 minutes', value: '60' },
];

const timeOptions = Array.from({ length: 96 }, (_, index) => {
  const hour = String(Math.floor(index / 4)).padStart(2, '0');
  const minutes = String((index % 4) * 15).padStart(2, '0');
  return { label: `${hour}:${minutes}`, value: `${hour}:${minutes}` };
});

const RequestATrip = () => {
  const [dogName, setDogName] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Tel Aviv');
  const [address, setAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [phone, setPhone] = useState('+972');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('15');

  const navigation = useNavigation();

  const handleSubmit = async () => {
    const formattedDate = format(date, 'dd-MM-yyyy');
    const requestBody = {
      Dog: dogName,
      Password: password,
      City: city,
      Address: address,
      HouseNumber: houseNumber,
      AppartmentNumber: apartmentNumber,
      Phone: phone,
      Date: formattedDate,
      Time: selectedTime,
      Duration: duration,
    };

    const authToken = await AsyncStorage.getItem('authToken');
    fetch(`${config.getBaseUrl()}/api/InsertJob?authToken=${authToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (response.status === 401) {
          navigation.navigate('SignIn');
        }
        if (response.ok) {
          navigation.navigate('DogOwner');
        } else {
          return response.text().then((text) => { throw new Error(text || 'Failed to submit'); });
        }
      })
      .catch((error) => Alert.alert('Error', error.message));
  };

  // Inline style for positioning DatePicker on web
  const datePickerStyle = {
    position: 'relative',
    zIndex: 1,
    alignSelf: 'flex-start', // Aligns to the left
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Dog Name:</Text>
      <TextInput style={styles.input} value={dogName} onChangeText={setDogName} />
      
      <Text style={styles.label}>Job Password:</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} />
      
      <Text style={styles.label}>City:</Text>
      <RNPickerSelect style={pickerSelectStyles} onValueChange={(value) => setCity(value)} items={cities} value={city} />
      
      <Text style={styles.label}>Address:</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />

      <Text style={styles.label}>Date:</Text>
      {Platform.OS === 'web' ? (
        <DatePicker
          selected={date}
          onChange={(selectedDate) => setDate(selectedDate)}
          dateFormat="dd/MM/yyyy"
          className="datepicker-input"
          style={datePickerStyle} // Apply custom inline style for web
        />
      ) : (
        <>
          <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}
        </>
      )}

      <Text style={styles.label}>Time:</Text>
      <RNPickerSelect
        style={pickerSelectStyles}
        onValueChange={(value) => setSelectedTime(value)}
        items={timeOptions}
        value={selectedTime}
        placeholder={{ label: 'Select Time', value: '' }}
      />

      <Text style={styles.label}>Duration:</Text>
      <RNPickerSelect
        style={pickerSelectStyles}
        onValueChange={(value) => setDuration(value)}
        items={durationOptions}
        value={duration}
      />

      <Button title="Submit Request" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, marginVertical: 10 },
  input: { height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginVertical: 10, width: '100%' },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: { height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginVertical: 10, width: '100%' },
  inputAndroid: { height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10, marginVertical: 10, width: '100%' },
});

export default RequestATrip;
