import { Image, StyleSheet, Text, View } from "react-native";
import { Icon } from "./icon";
import Ionicons from '@react-native-vector-icons/ionicons';
import Ripple from "react-native-material-ripple";

interface CardListProps {
    name: string;
    clinic: string;
    specialty: string;
    reviews: string;
    rating: string;
    image: string;
}

export const CardList = ({ clinic, image, name, rating, reviews, specialty }: CardListProps) => {
    return (
        <Ripple onPress={() => {}} rippleContainerBorderRadius={12} rippleColor="#4894FE">
            <View style={styles.container}>
                <Image style={styles.image} source={{ uri: image }} />
                <View style={styles.info}>
                    <View style={styles.infoDoctor}>
                        <Text style={styles.doctorName}>{name}</Text>
                        <Text style={styles.doctorSpec}>{specialty} | {clinic}</Text>
                    </View>
                    <View style={styles.rating}>
                        <Icon name="StarIcon" color="#FFD33C" fill="#FFD33C" size={14} />
                        <Text style={styles.ratingText}>{rating}</Text>
                        <Text style={styles.reviewsText}>({reviews} avaliações)</Text>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={16} style={{ margin: 10 }} color="#939393" />
            </View>
        </Ripple>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        width: "100%",
        backgroundColor: "white",
        boxShadow: "0 3 30 0 rgba(16,16,16,0.05)",
        padding: 8,
        flexDirection: "row",
        gap: 16,
    },
    image: {
        width: 92,
        height: 92,
        borderRadius: 8
    },
    info: {
        padding: 8,
        justifyContent: "space-between",
        alignItems: "flex-start",
        flex: 1
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
        fontSize: 16,
        lineHeight: 18,
        fontFamily: "Inter_18pt-SemiBold"
    },
    doctorSpec: {
        color: "#939393",
        fontSize: 12,
        lineHeight: 14,
        fontFamily: "Inter_18pt-Light"
    },
    ratingText: {
        fontSize: 12,
        lineHeight: 14,
        color: "#101010",
        fontFamily: "Inter_18pt-Medium"
    },
    reviewsText: {
        fontSize: 10,
        lineHeight: 12,
        color: "#939393",
        fontFamily: "Inter_24pt-Regular"
    },
})