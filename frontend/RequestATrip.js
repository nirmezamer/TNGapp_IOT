// RequestATrip.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';

const cities = [
  { label: 'Tel Aviv', value: 'Tel Aviv' },
  { label: 'Jerusalem', value: 'Jerusalem' },
  { label: 'Haifa', value: 'Haifa' },
  { label: 'Ashdod', value: 'Ashdod' },
  { label: 'Beersheba', value: 'Beersheba' },
  // Add more cities as needed
];

const RequestATrip = () => {
  const [ownerName, setOwnerName] = useState('');
  const [dogName, setDogName] = useState('');
  const [city, setCity] = useState('Tel Aviv');
  const [address, setAddress] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [phone, setPhone] = useState('+972');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(setHours(setMinutes(new Date(), 0), 0));
  const [duration, setDuration] = useState(setHours(setMinutes(new Date(), 0), 0));

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

  // Limit duration to be between 00:00 and 01:00
  const filterTime = (time) => {
    const currentHour = time.getHours();
    return currentHour < 1;
  };

  return (
    <View style={styles.container}>

      <Text style={styles.label}>Owner Name:</Text>
      <TextInput
        style={styles.input}
        value={ownerName}
        onChangeText={setOwnerName}
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
      <DatePicker
        selected={date}
        onChange={(date) => setDate(date)}
        dateFormat="dd/MM/yyyy"
        className="datepicker-input"
      />

      <Text style={styles.label}>Time:</Text>
      <DatePicker
        selected={time}
        onChange={(time) => setTime(time)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="HH:mm"
        timeFormat="HH:mm"
        className="timepicker-input"
        minTime={setHours(setMinutes(new Date(), 0), 0)}
        maxTime={setHours(setMinutes(new Date(), 59), 23)}
      />

      <Text style={styles.label}>Duration:</Text>
      <DatePicker
        selected={duration}
        onChange={(time) => setDuration(time)}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="Duration"
        dateFormat="HH:mm"
        timeFormat="HH:mm"
        className="timepicker-input"
        filterTime={filterTime}
        minTime={setHours(setMinutes(new Date(), 0), 0)}
        maxTime={setHours(setMinutes(new Date(), 0), 1)}
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
    marginVertical: 10,
    width: '100%',
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
    width: '100%',
  },
  inputAndroid: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
  },
});

export default RequestATrip;
