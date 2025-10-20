import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Desbloqueado</Text>
      <Text style={styles.subtitle}>Bem-vindo ao app!</Text>
      <Pressable style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Ação Qualquer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D80FF', alignItems: 'center', justifyContent: 'center' },
  title: { color: 'white', fontSize: 26, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: 'white', opacity: 0.9, fontSize: 16, marginBottom: 20 },
  button: { backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  buttonText: { color: '#0D80FF', fontWeight: '700' },
});