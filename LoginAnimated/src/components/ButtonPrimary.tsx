import { StyleSheet, Text } from "react-native";
import Ripple from "react-native-material-ripple";

interface ButtonProps {
  text: string;
  onPress: () => void;
}

export function ButtonPrimary({ onPress, text }: ButtonProps) {
  return (
    <Ripple
      rippleContainerBorderRadius={8}
      style={[styles.btn, styles.btnPrimary]}
      onPress={onPress}
    >
      <Text style={[styles.btnText, styles.btnTextDark]}>{text}</Text>
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
    btnPrimary: { backgroundColor: "#F6DC00" },
    btnText: { fontSize: 14, fontFamily: "Inter-Regular" },
    btnTextDark: { color: "#050607" },
});