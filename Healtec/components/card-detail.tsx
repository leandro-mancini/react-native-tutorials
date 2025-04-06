import { Image, StyleSheet, Text, View } from "react-native";

interface CardDetailProps {
    name: string;
    specialty: string;
    image: string;
}

export const CardDetail = ({ name, specialty, image }: CardDetailProps) => {
    return (
        <View style={[styles.container]}>
            <Image style={styles.image} source={{ uri: image }} />
            <View style={styles.info}>
                <View style={styles.infoDoctor}>
                    <Text style={styles.doctorName} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
                    <Text style={styles.doctorSpec}>{specialty} | Vcare Clinic</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        backgroundColor: "white",
        boxShadow: "0 3 30 0 rgba(16,16,16,0.05)",
        width: "100%"
    },
    image: {
        width: "100%",
        height: 200,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    info: {
        width: "100%",
        paddingHorizontal: 12,
        paddingTop: 16,
        paddingBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    infoDoctor: {
        gap: 4
    },
    doctorName: {
        color: "#101010",
        fontSize: 16,
        lineHeight: 18,
        fontFamily: "Inter_18pt-Medium",
    },
    doctorSpec: {
        color: "#939393",
        fontSize: 12,
        lineHeight: 14,
        fontFamily: "Inter_18pt-Light"
    },
})