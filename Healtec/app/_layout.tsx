import 'react-native-gesture-handler';

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import { HomeScreen } from './home';
import { AppointmentDetailScreen } from './appointment-detail';
import { VoiceCallScreen } from './voice-call';
import { OnboardingScreen } from './onboarding';
import { CustomNavBar } from '../components/custom-nav-bar';
import { ProfileScreen } from './profile';
import { DetailScreen } from './detail';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 🏠 Navegação com Bottom Tabs
function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
          backgroundColor: "white",
          paddingHorizontal: 0,
        },
        tabBarButton: (props) => <CustomNavBar {...props} route={route} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
      <Tab.Screen name="VoiceCall" component={VoiceCallScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 🔀 StackNavigator principal que gerencia ambas as navegações
function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Telas sem Bottom Navigator */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      {/* Telas com Bottom Navigator */}
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="VoiceCall" component={VoiceCallScreen} />
    </Stack.Navigator>
  );
}

// 🚀 Utilizando NavigationContainer diretamente
export default function _layout() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}