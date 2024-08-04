// JobDetails.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapComponent from './MapComponent'; // Import the MapComponent

export default function JobDetails({ route }) {
  const { id } = route.params; // Get the job ID from the route parameters
  const [job, setJob] = useState(null);

  useEffect(() => {
    // Fetch the job details using the ID
    fetch(`http://localhost:7071/api/GetJob/${id}`)
      .then((response) => response.json())
      .then((data) => setJob(data))
      .catch((error) => console.error('Error fetching job details:', error));
  }, [id]);

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{job.City}</Text>
      <Text style={styles.detail}>Address: {job.Address} {job.HouseNumber}, {job.AppartmentNumber}</Text>
      <Text style={styles.detail}>Owner: {job.Owner}</Text>
      <Text style={styles.detail}>Dog Name: {job.Dog}</Text>
      <Text style={styles.detail}>Phone: {job.Phone}</Text>
      <Text style={styles.detail}>Date: {job.Date}</Text>
      <Text style={styles.detail}>Time: {job.Time}</Text>
      <Text style={styles.detail}>Duration: {job.Duration}</Text>
      <Text style={styles.detail}>Status: {job.Status}</Text> 

      <MapComponent />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
});
