import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "./avatar";

interface HeaderUserProps {
    name: string;
    avatarUrl: string;
}

export const HeaderUser = ({ name, avatarUrl }: HeaderUserProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.greetingsInfo}>
                <Text style={styles.hello}>Olá,</Text>
                <Text style={styles.me}>Oi {name}</Text>
            </View>
            <Avatar source={avatarUrl} size={56} backgroundColor="#4894FE" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center"
    },
    greetingsInfo: {
        gap: 6
    },
    hello: {
        color: "#8696BB",
        fontSize: 16,
        lineHeight: 16,
        fontFamily: "Poppins-Regular"
    },
    me: {
        color: "#0D1B34",
        fontSize: 20,
        lineHeight: 20,
        fontFamily: "Poppins-Bold"
    }
})