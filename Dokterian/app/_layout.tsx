import 'react-native-gesture-handler';

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import { SplashScreen } from "./splash";
import { CustomNavBar } from "../components/custom-nav-bar";
import { HomeScreen } from "./home";
import { ScheduleScreen } from "./schedule";
import { MessagesScreen } from "./messages";
import { ProfileScreen } from "./profile";

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
          paddingHorizontal: 16,
        },
        tabBarButton: (props) => <CustomNavBar {...props} route={route} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 🔀 StackNavigator principal que gerencia ambas as navegações
function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Telas sem Bottom Navigator */}
      <Stack.Screen name="Splash" component={SplashScreen} />

      {/* Telas com Bottom Navigator */}
      <Stack.Screen name="Main" component={BottomTabNavigator} />
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