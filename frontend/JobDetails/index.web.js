import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Modal, TouchableOpacity } from 'react-native';
import * as SignalR from '@microsoft/signalr';
import MapComponent from '../MapComponent'; // Import the MapComponent
import config from '../config';

export default function JobDetails({ route , navigation}) {
  const { id } = route.params; // Get the job ID from the route parameters
  const [job, setJob] = useState(null);
  const [startJobModalVisible, setStartJobModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [connection, setConnection] = useState(null);
  const [clientLocation, setClientLocation] = useState(null); // Add state for client location
  const [watchId, setWatchId] = useState(null); // Store the geolocation watch ID

  const fetchJobDetails = () => {
    fetch(`${config.getBaseUrl()}/api/GetJob/${id}?authToken=${localStorage.getItem('authToken')}`) 
        .then((response) => {
          if (response.status === 401) {
            // Navigate to the SignIn page if status is 401
            navigation.navigate('SignIn');
          } else {
            return response.json(); // Only parse JSON if response is not 401
          }
        })
      .then((data) => {
        setJob(data);
        if (data.Latitude && data.Longitude) { // Check if location data is available
          console.log(data.Latitude, data.Longitude)
          setClientLocation({
              latitude: data.Latitude, 
              longitude: data.Longitude
          })
        }
        
      })
      
      .catch((error) => console.error('Error fetching job details:', error));
  };

  useEffect(() => {
    // Fetch the job details using the ID
    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    const signalrConnection = new SignalR.HubConnectionBuilder()
      .withUrl(`${config.getBaseUrl()}/api`, {
        withCredentials: false, // We disable the credential for simplicity.
      })
      .withAutomaticReconnect()
      .configureLogging(SignalR.LogLevel.Information)
      .build();

    signalrConnection.on(`jobUpdated_${id}`, (message) => {
      fetchJobDetails();
    });


    signalrConnection.onclose(() => {
      console.log('Connection closed.');
    });

    setConnection(signalrConnection);

    // Start the connection
    const startConnection = async () => {
      try {
        await signalrConnection.start();
        console.log('SignalR connected.');
        setConnection(signalrConnection);
      } catch (err) {
        console.log('SignalR connection error:', err);
        setTimeout(startConnection, 5000); // Retry connection after 5 seconds
      }
    };

    startConnection();
  }, []);

  const handleTakeJob = () => {
    fetch(`${config.getBaseUrl()}/api/UpdateJob/${id}?authToken=${localStorage.getItem('authToken')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PartitionKey: job.Owner,
        Status: 'pending',
        TakeJob: true,
      }),
    })
    .then((response) => {
      if (response.status === 401) {
        // Navigate to the SignIn page if status is 401
        navigation.navigate('SignIn');
      } else {
        return response.json(); // Only parse JSON if response is not 401
      }
    })
      .then((updatedJob) => {
        setJob(updatedJob);
      })
      .catch((error) => console.error('Error updating job status:', error));
  };

  const handleReleaseJob = () => {
    fetch(`${config.getBaseUrl()}/api/UpdateJob/${id}?authToken=${localStorage.getItem('authToken')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PartitionKey: job.Owner,
        Status: 'Available',
        Walker: 'None',
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          // Navigate to the SignIn page if status is 401
          navigation.navigate('SignIn');
        } else {
          return response.json(); // Only parse JSON if response is not 401
        }
      })
      .then((updatedJob) => {
        setJob(updatedJob);
      })
      .catch((error) => console.error('Error updating job status:', error));
  };

  const handleStartJob = () => {
    setStartJobModalVisible(true);
  };

  const handleConfirmStartJob = () => {
    if (password === job.Password) {
      // Start watching the client's position when the job starts
      const navigatorId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('New Position:', { latitude, longitude });
          // setClientLocation({ latitude, longitude }); // Update the client's location locally
          // Send the updated location to the server
          fetch(`${config.getBaseUrl()}/api/UpdateJob/${id}?authToken=${localStorage.getItem('authToken')}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              PartitionKey: job.Owner,
              Status: 'active',
              Latitude: latitude,
              Longitude: longitude,
            }),
          })
          .then((response) => {
            if (response.status === 401) {
              // Navigate to the SignIn page if status is 401
              navigation.navigate('SignIn');
            } else {
              return response.json(); // Only parse JSON if response is not 401
            }
          })
          .then((updatedJob) => {
            setJob(updatedJob); // Update the job state with the new job data
          })
          .catch((error) => console.error('Error updating job status:', error));
        },
        (error) => {
          console.error('Error fetching location:', error);
          setErrorMessage('Unable to fetch location. Please try again.');
        },
        {
          enableHighAccuracy: true, // Request high accuracy for better precision
          timeout: 1000,
          maximumAge: 0,
        }
      );
  
      setWatchId(navigatorId); // Store the watch ID so you can clear it later
      setStartJobModalVisible(false);
      setPassword('');
      setErrorMessage('');
    } else {
      setErrorMessage('Incorrect password, please try again.');
    }
  };
  
  const handleEndJob = () => {
    // Stop watching the client's position
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null); // Reset watch ID
    }
  
    // Update the job status to "Terminate"
    fetch(`${config.getBaseUrl()}/api/UpdateJob/${id}?authToken=${localStorage.getItem('authToken')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PartitionKey: job.Owner,
        Status: 'Terminate',
        Walker: 'None',
      }),
    })
      .then((response) => {
        if (response.status === 401) {
          // Navigate to the SignIn page if status is 401
          navigation.navigate('SignIn');
        } else {
          return response.json(); // Only parse JSON if response is not 401
        }
      })
      .then((updatedJob) => {
        setJob(updatedJob);
      })
      .catch((error) => console.error('Error updating job status:', error));
  };
  
  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const takeOrReleaseButton =
  job.Status === 'pending' ? (
    <TouchableOpacity style={styles.button} onPress={handleReleaseJob}>
      <Text style={styles.buttonText}>Release the Job</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={[
        styles.button,
        (job.Status === 'active' || job.Status === 'Terminate') && styles.buttonDisabled,
      ]}
      onPress={handleTakeJob}
      disabled={job.Status !== 'Available'} // Ensure it is disabled when the job is active
    >
      <Text style={styles.buttonText}>Take the Job</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.detailsContainer}>
        <View style={styles.detailsText}>
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
          <Text style={styles.detail}>Valid Location: {job.validLocation} </Text>
        </View>
        <View style={styles.buttonContainer}>
          {takeOrReleaseButton}
          <TouchableOpacity
            style={[styles.button, job.Status !== 'pending' && styles.buttonDisabled]}
            onPress={handleStartJob}
            disabled={job.Status !== 'pending'}
          >
            <Text style={styles.buttonText}>Start the Job</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, job.Status !== 'active' && styles.buttonDisabled]}
            onPress={handleEndJob}
            disabled={job.Status !== 'active'}
          >
            <Text style={styles.buttonText}>End the Job</Text>
          </TouchableOpacity>
        </View>
      </View>
      <MapComponent 
          latitude={clientLocation ? parseFloat(clientLocation.latitude) : parseFloat(job.Latitude)} 
          longitude={clientLocation ? parseFloat(clientLocation.longitude) : parseFloat(job.Longitude)} />

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
  detailsText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonDisabled: {
    backgroundColor: '#d3d3d3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
