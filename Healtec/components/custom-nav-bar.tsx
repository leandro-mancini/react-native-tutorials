import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Ionicons from '@react-native-vector-icons/ionicons';

const PRIMARY_COLOR = "#63B4FF";
const SECONDARY_COLOR = "#8696BB";

const getIconByRouteName = (routeName: string, color: string, selected: boolean) => {
    const iconSize = 24;

    switch (routeName) {
      case 'Home':
        return <Ionicons name={selected ? "business" : "business-outline"} size={iconSize} color={color} />
      case 'Schedule':
        return <Ionicons name={selected ? "calendar-sharp" : "calendar-outline"} size={iconSize} color={color} />
      case 'Messages':
        return <Ionicons name={selected ? "chatbubble-ellipses-sharp" : "chatbubble-ellipses-outline"} size={iconSize} color={color} />
      case 'Profile':
        return <Ionicons name={selected ? "person" : "person-outline"} size={iconSize} color={color} />
      default:
        return <Ionicons name="at-circle" size={iconSize} color={color} />
    }
};

const getLabelByRouteName = (routeName: string) => {
  switch (routeName) {
    case 'Home':
      return "Início";
    case 'Schedule':
      return "Agenda";
    case 'Messages':
      return "Pedidos";
    case 'Profile':
      return "Perfil";
    default:
      return "Opção";
  }
};

export const CustomNavBar = ({ accessibilityState, onPress, route }: any) => {
  const isSelected = accessibilityState.selected;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        key={route.key}
        onPress={onPress}
        style={[
          styles.tabItem,
          { backgroundColor: isSelected ? "rgba(99, 180, 255, 0.10)" : "transparent" },
        ]}
      >
        {getIconByRouteName(
          route.name,
          isSelected ? PRIMARY_COLOR : SECONDARY_COLOR,
          isSelected
        )}
      </TouchableOpacity>
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
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
});