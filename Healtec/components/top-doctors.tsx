import { StyleSheet, Text, View } from "react-native";
import Ripple from "react-native-material-ripple";
import { TextButton } from "./text-button";
import { CardList } from "./card-list";

interface TopDoctorsProps {
    items: { 
        id: string;
        name: string;
        clinic: string;
        specialty: string;
        review: string;
        rank: string;
        image: string;
    }[];
}

export const TopDoctors = ({ items }: TopDoctorsProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.infoTitle}>Melhores Médicos</Text>
                <TextButton label="Ver todos" onPress={() => {}} />
            </View>
            <View style={styles.doctors}>
                {items.map((item) => (
                    <Ripple key={item.id} rippleContainerBorderRadius={16}>
                        <CardList />
                    </Ripple>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        color: "#101010",
        paddingHorizontal: 24,
        justifyContent: "space-between",
    },
    infoTitle: {
        fontFamily: "Inter_18pt-Medium",
        fontSize: 16,
        lineHeight: 18
    },
    doctors: {
        gap: 16,
        paddingInline: 24
    }
});