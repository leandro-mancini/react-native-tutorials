import { Pressable, PressableProps, StyleSheet, Text } from "react-native";

export function ButtonPrimary({ onPress, text }: PressableProps & { text: string }) {
  return (
    <Pressable
        style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && styles.pressed]}
        onPress={onPress}
        >
        <Text style={[styles.btnText, styles.btnTextDark]}>{text}</Text>
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
    btnPrimary: { backgroundColor: "#F6DC00" },
    btnText: { fontSize: 12 },
    btnTextDark: { color: "#050607" },
    pressed: { opacity: 0.85 },
});