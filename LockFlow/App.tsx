import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StatusBar } from 'react-native';
import { PatternUnlockScreen } from './src/PatternUnlockScreen';
import { DashboardScreen } from './src/DashboardScreen.tsx';

export type RootStackParamList = {
  Lock: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Lock"
          component={LockWrapper}
        />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function LockWrapper({ navigation }: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D80FF' }}>
      <PatternUnlockScreen
        registeredPattern={[6, 3, 0, 4, 2, 5, 8]}
        onSuccess={() => navigation.replace('Dashboard')}
        onFail={() => {}}
        showDebug={false}
      />
    </SafeAreaView>
  );
}