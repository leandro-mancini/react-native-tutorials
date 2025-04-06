import { Animated, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../components/icon";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Ripple from "react-native-material-ripple";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";

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
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ).start();
    }, [pulseAnim]);
    
    return (
        <ImageBackground
          source={{ uri: doctor.image }}
          blurRadius={20}
          style={styles.background}
        >
            <View style={styles.container}>
                <View style={styles.profileContainer}>
                    <View style={styles.avatarContainer}>
                        <Animated.View style={{ zIndex: 10, transform: [{ scale: pulseAnim }] }}>
                            <Image
                                source={{ uri: doctor.image }}
                                style={styles.avatar}
                            />
                        </Animated.View>
                        <LottieView 
                            source={require("../assets/animations/voice_call.json")}
                            autoPlay
                            loop
                            duration={2000}
                            style={styles.voiceCallAnimation}
                        />
                    </View>
                    <Text style={styles.name}>{doctor.name}</Text>
                </View>
            
                <View style={styles.actionContainer}>
                    <Ripple style={styles.iconButton} rippleContainerBorderRadius={28}>
                        <Icon name="VolumeHighIcon" size={16} color="#fff" />
                    </Ripple>

                    <Ripple
                        rippleContainerBorderRadius={28}
                        style={styles.hangupButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="CallIcon" size={24} color="#fff" fill="#FFF" />
                    </Ripple>

                    <Ripple style={styles.iconButton} rippleContainerBorderRadius={28}>
                        <Icon name="Microphone2Icon" size={16} color="#fff" />
                    </Ripple>
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
    callTimerText: {
      color: "white",
      fontSize: 14,
      fontWeight: "500",
    },
    profileContainer: {
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      gap: 16,
    },
    avatarContainer: {
        position: "relative",
        width: 100,
        height: 100
    },
    voiceCallAnimation: {
        width: 100,
        height: 100,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
        transform: "scale(2.8)"
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderColor: "white",
      position: "relative",
      zIndex: 10,
    },
    name: {
      color: "white",
      fontSize: 20,
      lineHeight: 22,
      fontFamily: "Inter_18pt-SemiBold",
    },
    actionContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      gap: 24
    },
    iconButton: {
      backgroundColor: "rgba(255,255,255,0.2)",
      width: 40,
      height: 40,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
    },
    hangupButton: {
      backgroundColor: "tomato",
      width: 56,
      height: 56,
      borderRadius: 36,
      justifyContent: "center",
      alignItems: "center",
    },
});