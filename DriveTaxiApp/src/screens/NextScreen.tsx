import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function NextScreen() {
  return (
    <View style={styles.c}>
      <Text style={styles.t}>Próxima tela 🚀</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  c: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111' },
  t: { color: '#fff', fontSize: 22, fontWeight: '600' },
});