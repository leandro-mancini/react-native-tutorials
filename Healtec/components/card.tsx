import { Image, StyleSheet, Text, View } from "react-native";
import { Icon } from "./icon";
import Ripple from "react-native-material-ripple";

export const Card = () => {
    return (
        <Ripple onPress={() => {}} rippleContainerBorderRadius={8} rippleColor="#4894FE">
            <View style={styles.container}>
                <Image style={styles.image} source={{ uri: "https://img.freepik.com/fotos-gratis/confiante-olhando-para-a-camera-jovem-medico-vestindo-uniforme-de-medico-com-estetoscopio-isolado-na-parede-rosa-com-espaco-de-copia_141793-90966.jpg?t=st=1741985186~exp=1741988786~hmac=8aa5bfb68f77ddffd8f57132e398103db5f5447558565f9fd7e779f67210d938&w=1800" }} />
                <View style={styles.info}>
                    <View style={styles.infoDoctor}>
                        <Text style={styles.doctorName}>Dr. Esther</Text>
                        <Text style={styles.doctorSpec}>Dentist</Text>
                    </View>
                    <View style={styles.rating}>
                        <Icon name="StarIcon" color="#FFD33C" fill="#FFD33C" size={14} />
                        <Text style={styles.ratingText}>4.5</Text>
                    </View>
                </View>
            </View>
        </Ripple>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        width: "100%",
        backgroundColor: "white",
        boxShadow: "0 3 30 0 rgba(16,16,16,0.03)",
    },
    image: {
        width: 156,
        height: 134,
        borderRadius: 8
    },
    info: {
        padding: 8,
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
        fontFamily: "Inter_18pt-Medium"
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