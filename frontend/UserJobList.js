// UserJobList.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

export default function UserJobList({ route }) {
  const { user_name } = route.params;
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:7071/api/GetAllJobs/${user_name}`)
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error('Error fetching jobs:', error));
  }, []);

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
