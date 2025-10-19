import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { PatternUnlockScreen } from './src/PatternUnlockScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D80FF' }}>
      <StatusBar barStyle="light-content" />
      <PatternUnlockScreen
        registeredPattern={[3, 4, 7, 8]}
        onSuccess={() => console.log('🔓 desbloqueado')}
        onFail={() => console.log('❌ padrão incorreto')}
      />
    </SafeAreaView>
  );
}