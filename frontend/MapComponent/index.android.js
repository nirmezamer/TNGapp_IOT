// MapComponent.js
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapComponent = ({ latitude = 32.0853, longitude = 34.7818 }) => {
  useEffect(() => {
    console.warn(latitude, longitude)
  }, [latitude, longitude])
  return (
    <View style={styles.container} key={toString(latitude) + toString(longitude)}>
      <MapView
        key={toString(latitude) + toString(longitude)}
        style={styles.map}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01, // Zoom level
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          key={{latitude, longitude}}
          coordinate={{ latitude: latitude, longitude: longitude }}
          title="Location"
          description="Selected location marker"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: 300,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
