import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStaticNavigation } from "@react-navigation/native";
import { HomeScreen } from "./home";
import { ScheduleScreen } from "./schedule";
import { MessagesScreen } from "./messages";
import { ProfileScreen } from "./profile";
import { CustomNavBar } from '../components/custom-nav-bar';

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
            tabBarButton: (props) => <CustomNavBar {...props} route={route} />
        }
    },
    screens: {
        Home: HomeScreen,
        Schedule: ScheduleScreen,
        Messages: MessagesScreen,
        Profile: ProfileScreen,
    },
});

const Navigation = createStaticNavigation(RootTabs);

export default function _layout() {
    return (
        <Navigation />
    );
}