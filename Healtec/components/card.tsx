import { Image, StyleSheet, Text, View } from "react-native";
import { Icon } from "./icon";
import Ripple from "react-native-material-ripple";
import { useNavigation } from "@react-navigation/native";

interface CardProps {
    name: string;
    specialty: string;
    rating: string;
    image: string;
    style?: any;
}

export const Card = ({ name, specialty, image, rating, style }: CardProps) => {
    return (
        <View style={[styles.container, style]}>
            <Image style={styles.image} source={{ uri: image }} />
            <View style={styles.info}>
                <View style={styles.infoDoctor}>
                    <Text style={styles.doctorName} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
                    <Text style={styles.doctorSpec}>{specialty}</Text>
                </View>
                <View style={styles.rating}>
                    <Icon name="StarIcon" color="#FFD33C" fill="#FFD33C" size={14} />
                    <Text style={styles.ratingText}>{rating}</Text>
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
    },
    image: {
        width: "100%",
        height: 140,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    info: {
        width: "100%",
        padding: 8,
        paddingBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    rating: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4
    },
    infoDoctor: {
        gap: 4
    },
    doctorName: {
        color: "#101010",
        fontSize: 14,
        lineHeight: 16,
        fontFamily: "Inter_18pt-Medium",
    },
    doctorSpec: {
        color: "#939393",
        fontSize: 12,
        lineHeight: 14,
        fontFamily: "Inter_18pt-Light"
    },
    ratingText: {
        fontSize: 10,
        lineHeight: 12,
        fontFamily: "Inter_18pt-Medium"
    }
})