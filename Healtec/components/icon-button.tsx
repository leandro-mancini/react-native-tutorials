import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Ripple from "react-native-material-ripple";

interface IconButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const IconButton = ({ onPress, children, style }: IconButtonProps) => {
  return (
    <Ripple onPress={onPress} style={[styles.button, style]} rippleContainerBorderRadius={100}>
      {children}
    </Ripple>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});