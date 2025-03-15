import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStaticNavigation } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack"
import { HomeScreen } from "./home";
import { ScheduleScreen } from "./schedule";
import { MessagesScreen } from "./messages";
import { ProfileScreen } from "./profile";
import { CustomNavBar } from '../components/custom-nav-bar';
import { SplashScreen } from "./splash";

const RootTabs = createBottomTabNavigator({
    screenOptions({ route }) {
        return {
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                height: 80,
                elevation: 0,
                shadowOpacity: 0,
                borderTopWidth: 0,
                backgroundColor: 'white',
                paddingHorizontal: 16
            },
            tabBarButton: (props) => <CustomNavBar {...props} route={route} />,
            // ...TransitionPresets.SlideFromRightIOS,
        }
    },
    screens: {
        Splash: SplashScreen,
        Home: HomeScreen,
        Schedule: ScheduleScreen,
        Messages: MessagesScreen,
        Profile: ProfileScreen,
    },
});

// const Stack = createStackNavigator();
const Navigation = createStaticNavigation(RootTabs);

export default function _layout() {
    return (
        // <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Navigation />
        // </Stack.Navigator>
    );
}