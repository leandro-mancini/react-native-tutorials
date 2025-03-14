import { StyleSheet, Text, View } from "react-native";
import { CardLocation } from "./card-location";
import Ripple from "react-native-material-ripple";

interface NearDoctorProps {
    doctors: { id: string; name: string, avatarUrl: string, specialty: string, review: string, time: string; kms: string }[];
}

export const NearDoctor = ({ doctors }: NearDoctorProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Near Doctor</Text>
            <View style={styles.doctors}>
                {doctors.map((doctor) => (
                    <Ripple rippleContainerBorderRadius={16}>
                        <CardLocation
                            key={doctor.id}
                            avatarUrl={doctor.avatarUrl}
                            name={doctor.name}
                            specialty={doctor.specialty}
                            review={doctor.review}
                            time={doctor.time}
                            kms={doctor.kms}
                        />
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
    title: {
        fontSize: 16,
        lineHeight: 16,
        fontFamily: "Poppins-SemiBold"
    },
    doctors: {
        gap: 16
    }
});