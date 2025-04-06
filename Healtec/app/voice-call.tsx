import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../components/icon";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

type Doctor = {
    name: string;
    specialty: string;
    rating: string;
    image: string;
    patients: string;
    yearsExp: string;
    reviews: string;
    aboutMe: string;
};
  
type DetailRouteParams = {
    Detail: {
      doctor: Doctor;
    };
};

export const VoiceCallScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<DetailRouteParams, "Detail">>();
    const { doctor } = route.params;
    
    return (
        <ImageBackground
          source={{ uri: doctor.image }}
          blurRadius={20}
          style={styles.background}
        >
            <View style={styles.container}>
                <View style={styles.profileContainer}>
                    <Image
                    source={{ uri: doctor.image }}
                    style={styles.avatar}
                    />
                    <Text style={styles.name}>{doctor.name}</Text>
                </View>
            
                <View style={styles.actionContainer}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Icon name="VolumeHighIcon" size={24} color="#fff" />
                    </TouchableOpacity>
            
                    <TouchableOpacity style={styles.hangupButton} onPress={() => navigation.goBack()}>
                        <Icon name="CallIcon" size={24} color="#fff" />
                    </TouchableOpacity>
            
                    <TouchableOpacity style={styles.iconButton}>
                        <Icon name="Microphone2Icon" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    container: {
        backgroundColor: "rgba(16,16,16,0.35)",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 40,
        flex: 1
    },
    callTimerContainer: {
      marginTop: 40,
      width: "100%",
      alignItems: "flex-end",
      paddingHorizontal: 20,
    },
    callTimerContent: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.3)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    dot: {
      width: 8,
      height: 8,
      backgroundColor: "red",
      borderRadius: 4,
      marginRight: 6,
    },
    callTimerText: {
      color: "white",
      fontSize: 14,
      fontWeight: "500",
    },
    profileContainer: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      gap: 8,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderColor: "white",
    },
    name: {
      color: "white",
      fontSize: 20,
      lineHeight: 22,
      fontFamily: "Inter_18pt-SemiBold"
    },
    status: {
      color: "white",
      fontSize: 14,
      opacity: 0.8,
    },
    actionContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: width - 80,
      alignItems: "center",
    },
    iconButton: {
      backgroundColor: "rgba(255,255,255,0.2)",
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
    },
    hangupButton: {
      backgroundColor: "red",
      width: 72,
      height: 72,
      borderRadius: 36,
      justifyContent: "center",
      alignItems: "center",
    },
});