import { Image, StyleSheet, Text, View } from "react-native";
import { IconButton } from "./icon-button";
import { Icon } from "./icon";

interface CardDetailProps {
    name: string;
    specialty: string;
    image: string;
    isFavorite: boolean;
}

export const CardDetail = ({ name, specialty, image, isFavorite }: CardDetailProps) => {
    return (
        <View style={[styles.container]}>
            <Image style={styles.image} source={{ uri: image }} />
            <View style={styles.info}>
                <View style={styles.infoDoctor}>
                    <Text style={styles.doctorName} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
                    <Text style={styles.doctorSpec}>{specialty} | Vcare Clinic</Text>
                </View>
                <View style={styles.favoriteButton}>
                    <IconButton onPress={() => {}} style={styles.button}>
                        <Icon name="HeartIcon" color="tomato" fill={isFavorite ? 'tomato' : 'white'} size={24} />
                    </IconButton>
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
        height: 250,
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
    favoriteButton: {

    },
    button: {
        width: 40,
        height: 40
    }
})