import { StyleSheet, Text, View } from "react-native";
import { Icon } from "./icon";

interface ExperienceProps {
    patients: string;
    yearsExp: string;
    rating: string;
    reviews: string;
}

export const Experience = ({ patients, rating, reviews, yearsExp }: ExperienceProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.experience}>
                <View style={styles.icon}>
                    <Icon name="Profile2UserIcon" color="#4C4DDC" />
                </View>
                <View style={styles.text}>
                    <Text style={styles.valueText}>{patients}+</Text>
                    <Text style={styles.labelText}>Pacientes</Text>
                </View>
            </View>
            <View style={styles.experience}>
                <View style={styles.icon}>
                    <Icon name="TrendUpIcon" color="#4C4DDC" />
                </View>
                <View style={styles.text}>
                    <Text style={styles.valueText}>{yearsExp}+</Text>
                    <Text style={styles.labelText}>Anos de Experiência</Text>
                </View>
            </View>
            <View style={styles.experience}>
                <View style={styles.icon}>
                    <Icon name="StarIcon" color="#4C4DDC" />
                </View>
                <View style={styles.text}>
                    <Text style={styles.valueText}>{rating}</Text>
                    <Text style={styles.labelText}>Avaliação</Text>
                </View>
            </View>
            <View style={styles.experience}>
                <View style={styles.icon}>
                    <Icon name="MessageIcon" color="#4C4DDC" />
                </View>
                <View style={styles.text}>
                    <Text style={styles.valueText}>{reviews}+</Text>
                    <Text style={styles.labelText}>Avaliações</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
        flexDirection: "row",
        justifyContent: "space-around"
    },
    experience: {
        width: 70,
        alignItems: "center",
        gap: 8
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 56,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(237,237,252,0.4)"
    },
    text: {
        alignItems: "center",
        gap: 2
    },
    valueText: {
        fontFamily: "Inter_18pt-Medium",
        fontSize: 16,
        lineHeight: 18,
        color: "#101010"
    },
    labelText: {
        color: "#939393",
        fontSize: 12,
        lineHeight: 14,
        fontFamily: "Inter_18pt-Light",
        textAlign: "center"
    }
})