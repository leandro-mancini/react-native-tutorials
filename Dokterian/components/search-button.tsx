import React from "react";
import { StyleSheet, Text } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import Ripple from "react-native-material-ripple";

interface SearchButtonProps {
    placeholder?: string;
    onPress?: () => void;
}

export const SearchButton = ({ placeholder = "Buscar", onPress }: SearchButtonProps) => {
    return (
        <Ripple
            style={styles.button}
            rippleContainerBorderRadius={12}
            rippleColor="#4894FE"
            onPress={onPress}
        >
          <Ionicons name="search-outline" size={24} color="#8696BB" style={styles.icon} />
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>{placeholder}</Text>
        </Ripple>
      );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#FAFAFA",
        borderRadius: 12,
        alignItems: "center",
        padding: 16,
        width: "100%",
        flexDirection: "row",
        gap: 12
    },
    icon: {},
    text: {
        color: "#8696BB",
        fontSize: 16,
        flex: 1,
        overflow: "hidden"
    },
  });