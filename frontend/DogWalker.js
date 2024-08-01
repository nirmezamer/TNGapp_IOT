// DogWalker.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

export default function DogWalker({ navigation }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:7071/api/GetAllJobs') 
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error('Error fetching jobs:', error));
  }, []);

  const renderJob = ({ item }) => (
    <View style={styles.jobContainer}>
      <Text style={styles.jobTitle}>{item.Owner}</Text>
      <Text style={styles.jobCompany}>{item.DogName}</Text>
      <Text style={styles.jobCompany}>{item.startDate}</Text>
      <Text style={styles.jobCompany}>{item.startTime}</Text>
      <Text style={styles.jobCompany}>{item.endDate}</Text>
      <Text style={styles.jobCompany}>{item.endTime}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Dog Walker!</Text>
      <Text style={styles.nontitle}>Please select a job you would like to do</Text>
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
    alignItems: 'center',
  },
  jobContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobCompany: {
    fontSize: 16,
    color: '#555',
  },
});
