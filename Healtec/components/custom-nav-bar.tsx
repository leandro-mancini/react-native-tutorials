import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from '@react-native-vector-icons/ionicons';
import { Text } from "react-native-gesture-handler";
import Ripple from "react-native-material-ripple";
import { Icon } from "./icon";

const PRIMARY_COLOR = "#4C4DDC";
const SECONDARY_COLOR = "#939393";

const getIconByRouteName = (routeName: string, color: string, selected: boolean) => {
    const iconSize = 24;

    switch (routeName) {
      case 'Home':
        return <Icon name={selected ? "HomeBoldIcon" : "HomeIcon"} size={iconSize} color={color} />
        // return <Ionicons name={selected ? "business" : "business-outline"} size={iconSize} color={color} />
      case 'AppointmentDetail':
        return <Icon name={selected ? "CalendarBoldIcon" : "CalendarIcon"} size={iconSize} color={color} />
      case 'VoiceCall':
        // return <Icon name="MessageIcon" size={iconSize} color={color} />
        return <Icon name={selected ? "MessageBoldIcon" : "MessageIcon"} size={iconSize} color={color} />
      case 'Profile':
        // return <Icon name="ProfileIcon" size={iconSize} color={color} />
        return <Icon name={selected ? "ProfileBoldIcon" : "ProfileIcon"} size={iconSize} color={color} />
      default:
        return <Ionicons name="at-circle" size={iconSize} color={color} />
    }
};

export const CustomNavBar = ({ accessibilityState, onPress, route }: any) => {
  const isSelected = accessibilityState.selected;

  return (
    <View style={styles.container}>
      <Ripple
        key={route.key}
        onPress={onPress}
        style={styles.tabItem}
      >
        {getIconByRouteName(
          route.name,
          isSelected ? PRIMARY_COLOR : SECONDARY_COLOR,
          isSelected
        )}
      </Ripple>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 0,
  },
  tabItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 8,
    width: "100%",
    height: "100%",
  },
});