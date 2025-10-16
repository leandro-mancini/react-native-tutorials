import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Map } from '../components/Map';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export function HomeScreen() {
   return (
    <View style={styles.container}>
      <Map />
    </View>
   );
}