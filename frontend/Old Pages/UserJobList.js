// UserJobList.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import config from '../config';

export default function UserJobList() {
  const navigation = useNavigation();
  const user_name = localStorage.getItem('user_name');
  useEffect(() => {
    if (!user_name) {
      navigation.navigate('SignIn');
    }
  }, [user_name, navigation]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(`${config.getBaseUrl()}/api/GetAllJobs/${user_name}?authToken=${localStorage.getItem('authToken')}`)
      .then((response) => {
        if (response.status === 401) {
          // Navigate to the SignIn page if status is 401
          navigation.navigate('SignIn');
        } else {
          return response.json(); // Only parse JSON if response is not 401
        }
      })
      .then((data) => setJobs(data))
      .catch((error) => console.error('Error fetching jobs:', error));
  }, [user_name]);

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={styles.jobContainer}
      onPress={() => navigation.navigate('JobDetails', { id: item.RowKey })}
    >
      <Text style={styles.jobTitle}>{item.City}</Text>
      <Text style={styles.jobCompany}>{item.Address} {item.HouseNumber}, {item.AppartmentNumber}</Text>
      <Text style={styles.jobCompany}> </Text>
  
      <View style={styles.jobInfoContainer}>
        <Text style={styles.jobInfoLabel}>Owner:</Text>
        <Text style={styles.jobInfoValue}>{item.Owner}</Text>
      </View>
      <View style={styles.jobInfoContainer}>
        <Text style={styles.jobInfoLabel}>Dog Name:</Text>
        <Text style={styles.jobInfoValue}>{item.Dog}</Text>
      </View>
      <View style={styles.jobInfoContainer}>
        <Text style={styles.jobInfoLabel}>Password:</Text>
        <Text style={styles.jobInfoValue}>{item.Password}</Text>
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {user_name}!</Text>
      <Text style={styles.nontitle}>Here are all your jobs:</Text>
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.RowKey.toString()} 
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
  list: {
    width: '100%',
  },
  row: {
    justifyContent: 'space-between',
  },
  jobContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    flex: 1,
    maxWidth: '23%', // Adjusting for 4 columns with some margin
    alignSelf: 'center',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobCompany: {
    fontSize: 16,
    color: '#555',
  },
  jobInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  jobInfoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    flexBasis: '40%',
  },
  jobInfoValue: {
    fontSize: 16,
    color: '#555',
    flexBasis: '60%',
  },
});
