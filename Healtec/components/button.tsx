import React, { ReactNode } from "react";
import { Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import Ripple from "react-native-material-ripple";

interface ButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: ReactNode;
}

export const Button = ({ label, onPress, style, textStyle, children }: ButtonProps) => {
  return (
    <Ripple onPress={onPress} style={[styles.button, style]} rippleColor="#4894FE" rippleContainerBorderRadius={8}>
        {children}
        <Text style={[styles.text, textStyle]}>{label}</Text>
    </Ripple>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    backgroundColor: "#4C4DDC",
    gap: 8,
    flexDirection: "row"
  },
  text: {
    fontSize: 16,
    lineHeight: 18,
    fontFamily: "Inter_18pt-SemiBold",
    color: "#FFF",
  },
});