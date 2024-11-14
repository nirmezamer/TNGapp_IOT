import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Modal, TouchableOpacity } from 'react-native';
import * as SignalR from '@microsoft/signalr';
import * as Location from 'expo-location'; // Import expo-location
import MapComponent from '../MapComponent';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JobDetails({ route, navigation }) {
  const { id } = route.params;
  const [job, setJob] = useState(null);
  const [startJobModalVisible, setStartJobModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [connection, setConnection] = useState(null);
  const [clientLocation, setClientLocation] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);

  const fetchJobDetails = async () => {
    const authToken = await AsyncStorage.getItem('authToken');
    fetch(`${config.getBaseUrl()}/api/GetJob/${id}?authToken=${authToken}`)
      .then((response) => {
        if (response.status === 401) {
          navigation.navigate('SignIn');
        } else {
          return response.json();
        }
      })
      .then((data) => {
        setJob(data);
        if (data.Latitude && data.Longitude) { // Check if location data is available
          setClientLocation({
              latitude: data.Latitude, 
              longitude: data.Longitude
          })
        }
        
      })
      .catch((error) => console.error('Error fetching job details:', error));
  };

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    const signalrConnection = new SignalR.HubConnectionBuilder()
      .withUrl(`${config.getBaseUrl()}/api`, { withCredentials: false })
      .withAutomaticReconnect()
      .configureLogging(SignalR.LogLevel.Information)
      .build();

    signalrConnection.on('jobUpdated', (message) => {fetchJobDetails();});

    signalrConnection.onclose(() => console.log('Connection closed.'));
    setConnection(signalrConnection);

    const startConnection = async () => {
      try {
        await signalrConnection.start();
        console.log('SignalR connected.');
        signalrConnection.on('jobUpdated', (message) => {fetchJobDetails();});
        setConnection(signalrConnection);
      } catch (err) {
        console.log('SignalR connection error:', err);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();
  }, []);

  const handleTakeJob = async () => {
    const authToken = await AsyncStorage.getItem('authToken');
    fetch(`${config.getBaseUrl()}/api/UpdateJob/${id}?authToken=${authToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        PartitionKey: job.Owner,
        Status: 'pending',
        TakeJob: true,
      }),
    })
      .then((response) => (response.status === 401 ? navigation.navigate('SignIn') : response.json()))
      .then((updatedJob) => setJob(updatedJob))
      .catch((error) => console.error('Error updating job status:', error));
  };

  const handleReleaseJob = async () => {
    const authToken = await AsyncStorage.getItem('authToken');
    fetch(`${config.getBaseUrl()}/api/UpdateJob/${id}?authToken=${authToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        PartitionKey: job.Owner,
        Status: 'Available',
        Walker: 'None',
      }),
    })
      .then((response) => (response.status === 401 ? navigation.navigate('SignIn') : response.json()))
      .then((updatedJob) => setJob(updatedJob))
      .catch((error) => console.error('Error updating job status:', error));
  };

  const handleStartJob = () => {
    setStartJobModalVisible(true);
  };

  const handleConfirmStartJob = async () => {
    if (password === job.Password) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Location permission denied');
        return;
      }

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        async (position) => {
          const { latitude, longitude } = position.coords;
          // setClientLocation({ latitude, longitude });

          const authToken = await AsyncStorage.getItem('authToken');
          fetch(`${config.getBaseUrl()}/api/UpdateJob/${id}?authToken=${authToken}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              PartitionKey: job.Owner,
              Status: 'active',
              Latitude: latitude,
              Longitude: longitude,
            }),
          })
            .then((response) => (response.status === 401 ? navigation.navigate('SignIn') : response.json()))
            .then((updatedJob) => setJob(updatedJob))
            .catch((error) => console.error('Error updating job status:', error));
        }
      );
      setLocationSubscription(locationSubscription);
      setStartJobModalVisible(false);
      setPassword('');
      setErrorMessage('');
    } else {
      setErrorMessage('Incorrect password, please try again.');
    }
  };

  const handleEndJob = async () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }

    const authToken = await AsyncStorage.getItem('authToken');
    fetch(`${config.getBaseUrl()}/api/UpdateJob/${id}?authToken=${authToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        PartitionKey: job.Owner,
        Status: 'Terminate',
        Walker: 'None',
      }),
    })
      .then((response) => (response.status === 401 ? navigation.navigate('SignIn') : response.json()))
      .then((updatedJob) => setJob(updatedJob))
      .catch((error) => console.error('Error updating job status:', error));
  };

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{job.City}</Text>
        <Text style={styles.detail}>Address: {job.Address} {job.HouseNumber}, {job.AppartmentNumber}</Text>
        <Text style={styles.detail}>Owner: {job.Owner}</Text>
        <Text style={styles.detail}>Dog Name: {job.Dog}</Text>
        <Text style={styles.detail}>Phone: {job.Phone}</Text>
        <Text style={styles.detail}>Date: {job.Date}</Text>
        <Text style={styles.detail}>Time: {job.Time}</Text>
        <Text style={styles.detail}>Duration: {job.Duration}</Text>
        <Text style={styles.detail}>Status: {job.Status}</Text>
        <Text style={styles.detail}>Walker: {job.Walker}</Text>
        <Button title="Take Job" onPress={handleTakeJob} />
        <Button title="Release Job" onPress={handleReleaseJob} />
        <Button title="Start Job" onPress={handleStartJob} />
        <Button title="End Job" onPress={handleEndJob} />
      </View>
      <MapComponent 
        latitude={clientLocation ? parseFloat(clientLocation.latitude) : parseFloat(job.Latitude)} 
        longitude={clientLocation ? parseFloat(clientLocation.longitude) : parseFloat(job.Longitude)} 
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={startJobModalVisible}
        onRequestClose={() => setStartJobModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Please enter job password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <Button title="Confirm" onPress={handleConfirmStartJob} />
          <Button title="Cancel" onPress={() => setStartJobModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    padding: 35,
    alignItems: 'center',
    borderRadius: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    width: 200,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
