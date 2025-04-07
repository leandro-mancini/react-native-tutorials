import React from "react";
import { Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import Ripple from "react-native-material-ripple";

interface TextButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const TextButton = ({ label, onPress, style, textStyle }: TextButtonProps) => {
  return (
    <Ripple onPress={onPress} style={[styles.button, style]} rippleColor="#4894FE" rippleContainerBorderRadius={8}>
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
  },
  text: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: "Inter_24pt-Regular",
    color: "#4C4DDC",
  },
});