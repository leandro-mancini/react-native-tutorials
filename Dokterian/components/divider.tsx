import { StyleSheet, View } from "react-native";

interface DividerProps {
    color?: string;
    thickness?: number;
    marginVertical?: number;
}

export const Divider = ({
    color = "#E0E0E0",
    thickness = 1,
    marginVertical = 8,
}: DividerProps) => {
    return <View style={[styles.divider, { backgroundColor: color, height: thickness, marginVertical }]} />;
}

const styles = StyleSheet.create({
    divider: {
      width: "100%",
    },
});