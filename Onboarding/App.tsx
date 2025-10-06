import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import OnboardingScreen from './src/screens/OnboardingScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar barStyle="light-content" />
      <OnboardingScreen />
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: '#000' } });