import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

export function ButtonSecondary({ onPress, text }: PressableProps & { text: string }) {
  return (
    <Pressable
        style={({ pressed }) => [styles.btn, styles.btnDark, pressed && styles.pressed]}
        onPress={onPress}
        >
        <Text style={[styles.btnText, styles.btnTextLight]}>{text}</Text>
    </Pressable>
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
    btnText: { fontSize: 12 },
    btnTextLight: { color: "#F6DC00" },
    pressed: { opacity: 0.85 },
});