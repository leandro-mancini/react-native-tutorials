import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá 👋, eu sou Mancini!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D80FF', alignItems: 'center', justifyContent: 'center' },
  title: { color: 'white', fontSize: 26, fontWeight: '700', marginBottom: 8 },
});