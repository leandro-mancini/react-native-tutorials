import { StyleSheet, Text } from "react-native";
import Ripple from "react-native-material-ripple";

interface ButtonProps {
  text: string;
  onPress: () => void;
}

export function ButtonSecondary({ onPress, text }: ButtonProps) {
  return (
    <Ripple
      rippleContainerBorderRadius={8}
      style={[styles.btn, styles.btnDark]}
      onPress={onPress}
    >
      <Text style={[styles.btnText, styles.btnTextLight]}>{text}</Text>
    </Ripple>
  );
}

const styles = StyleSheet.create({
    btn: {
        height: 48,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    btnDark: { backgroundColor: "#111" },
    btnText: { fontSize: 14, fontFamily: "Inter-Regular" },
    btnTextLight: { color: "#F6DC00" },
});