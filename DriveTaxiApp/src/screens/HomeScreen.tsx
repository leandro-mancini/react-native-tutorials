import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function HomeScreen() {
  return (
    <View style={styles.c}>
      <Text style={styles.t}>Tela Inicial 🚀</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  c: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
  t: { color: '#fff', fontSize: 22, fontWeight: '600' },
});