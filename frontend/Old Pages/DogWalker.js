import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Platform, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SignalR from '@microsoft/signalr';
import config from '../config';

const screenWidth = Dimensions.get('window').width;

export default function DogWalker({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [connection, setConnection] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${config.getBaseUrl()}/api/GetAllJobs?authToken=${authToken}`);
        
        if (response.status === 401) {
          navigation.navigate('SignIn');
        } else if (response.ok) {
          const data = await response.json();
          setJobs(data);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();

    const signalrConnection = new SignalR.HubConnectionBuilder()
      .withUrl(`${config.getBaseUrl()}/api`, {
        withCredentials: Platform.OS !== 'web',
      })
      .withAutomaticReconnect()
      .configureLogging(SignalR.LogLevel.Information)
      .build();

    signalrConnection.on('newJob', () => {
      fetchJobs();
    });

    signalrConnection.onclose(() => {
      console.log('Connection closed.');
    });

    const startConnection = async () => {
      try {
        await signalrConnection.start();
        console.log('SignalR connected.');
        setConnection(signalrConnection);
      } catch (err) {
        console.log('SignalR connection error:', err);
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={styles.jobContainer}
      onPress={() => navigation.navigate('JobDetails', { id: item.RowKey })}
    >
      <Text style={styles.jobTitle}>{item.City}</Text>
      <Text style={styles.jobCompany}>{item.Address} {item.HouseNumber}, {item.AppartmentNumber}</Text>

      <View style={styles.jobInfoContainer}>
        <Text style={styles.jobInfoLabel}>Owner:</Text>
        <Text style={styles.jobInfoValue}>{item.Owner}</Text>
      </View>
      <View style={styles.jobInfoContainer}>
        <Text style={styles.jobInfoLabel}>Dog Name:</Text>
        <Text style={styles.jobInfoValue}>{item.Dog}</Text>
      </View>
      <View style={styles.jobInfoContainer}>
        <Text style={styles.jobInfoLabel}>Phone Number:</Text>
        <Text style={styles.jobInfoValue}>{item.Phone}</Text>
      </View>
      <View style={styles.jobInfoContainer}>
        <Text style={styles.jobInfoLabel}>Date:</Text>
        <Text style={styles.jobInfoValue}>{item.Date}</Text>
      </View>
      <View style={styles.jobInfoContainer}>
        <Text style={styles.jobInfoLabel}>Time:</Text>
        <Text style={styles.jobInfoValue}>{item.Time}</Text>
      </View>
      <View style={styles.jobInfoContainer}>
        <Text style={styles.jobInfoLabel}>Duration:</Text>
        <Text style={styles.jobInfoValue}>{item.Duration}</Text>
      </View>
      <View style={styles.jobInfoContainer}>
        <Text style={styles.jobInfoLabel}>Status:</Text> 
        <Text style={styles.jobInfoValue}>{item.Status}</Text> 
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Welcome Dog Walker!</Text>
      <Text style={styles.nontitle}>Please select a job you would like to do</Text>
    </View>
  );

  return (
    <FlatList
      data={jobs}
      renderItem={renderJob}
      keyExtractor={(item) => item.RowKey.toString()}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.listContainer}
      numColumns={5} // Set number of columns to 5
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  nontitle: {
    fontSize: 20,
    fontWeight: 'normal',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  jobContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    width: screenWidth / 5 - 15, // Adjust to fit 5 columns, including margin
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  jobCompany: {
    fontSize: 14,
    color: '#555',
  },
  jobInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  jobInfoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  jobInfoValue: {
    fontSize: 14,
    color: '#555',
  },
});
