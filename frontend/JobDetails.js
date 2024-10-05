import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Modal, TouchableOpacity } from 'react-native';
import * as SignalR from '@microsoft/signalr';
import MapComponent from './MapComponent'; // Import the MapComponent
import config from './config';

export default function JobDetails({ route , navigation}) {
  const { id } = route.params; // Get the job ID from the route parameters
  const [job, setJob] = useState(null);
  const [takeJobModalVisible, setTakeJobModalVisible] = useState(false);
  const [startJobModalVisible, setStartJobModalVisible] = useState(false);
  const [walkerName, setWalkerName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [connection, setConnection] = useState(null);

    const fetchJobDetails = () => {
      fetch(`${config.getBaseUrl()}/api/GetJob/${id}`)
        .then((response) => response.json())
        .then((data) => setJob(data))
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
      // TODO: check what happens when you disable this flag!
    })// Note we don't call the Negotiate directly, it will be called by the Client SDK
    .withAutomaticReconnect()
    .configureLogging(SignalR.LogLevel.Information)
    .build();

    signalrConnection.on('jobUpdated', (message) => {
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
    setTakeJobModalVisible(true);
  };

  const handleConfirmTakeJob = () => {
    fetch(`${config.getBaseUrl()}/api/UpdateJob/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PartitionKey: job.Owner,
        Status: 'pending',
        Walker: walkerName
      }),
    })
    .then((response) => response.json())
    .then((updatedJob) => {
      setJob(updatedJob);
      setTakeJobModalVisible(false);
    })
    .catch((error) => console.error('Error updating job status:', error));
    setTakeJobModalVisible(false);
  };

  const handleReleaseJob = () => {
    fetch(`${config.getBaseUrl()}/api/UpdateJob/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PartitionKey: job.Owner,
        Status: 'Available',
        Walker: 'None'
      }),
    })
    .then((response) => response.json())
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
      fetch(`${config.getBaseUrl()}/api/UpdateJob/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PartitionKey: job.Owner,
          Status: 'active'
        }),
      })
      .then((response) => response.json())
      .then((updatedJob) => {
        setJob(updatedJob);
        setStartJobModalVisible(false);
        setPassword('');
        setErrorMessage('');
      })
      .catch((error) => console.error('Error updating job status:', error));
      setStartJobModalVisible(false);
    } else {
      setErrorMessage('Incorrect password, please try again.');
      setStartJobModalVisible(false);
    }
  };

  const handleEndJob = () => {
    fetch(`${config.getBaseUrl()}/api/UpdateJob/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PartitionKey: job.Owner,
        Status: 'Terminate',
        Walker: 'None'
      }),
    })
    .then((response) => response.json())
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

  const takeOrReleaseButton = job.Status === 'pending' ? (
    <TouchableOpacity style={styles.button} onPress={handleReleaseJob}>
      <Text style={styles.buttonText}>Release the Job</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.button} onPress={handleTakeJob} disabled={job.Status !== 'Available'}>
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
      <MapComponent latitude={parseFloat(job.Latitude)} longitude={parseFloat(job.Longitude)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={takeJobModalVisible}
        onRequestClose={() => setTakeJobModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Enter your name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Dog Walker Name"
            value={walkerName}
            onChangeText={setWalkerName}
          />
          <Button title="Confirm" onPress={handleConfirmTakeJob} />
          <Button title="Cancel" onPress={() => setTakeJobModalVisible(false)} />
        </View>
      </Modal>

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
