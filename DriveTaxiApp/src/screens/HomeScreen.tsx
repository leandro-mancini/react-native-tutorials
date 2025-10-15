import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export function HomeScreen() {
   return (
    <View style={styles.container}>
      <MapView style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialCamera={{
          center:{
            latitude: 37.78825,
            longitude: -122.4324,
          },
          pitch: 0,
          heading: 0,
          altitude: 1000,
          zoom: 16,
          
        }}
      />
    </View>
   );
}