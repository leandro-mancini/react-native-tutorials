import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export const SplashScreen = ({ navigation }: any) => {
    const logoScale = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 1000,
            easing: Easing.bounce,
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(() => {
            navigation.replace("Main");
          }, 2000);
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
          <Animated.Image
            source={require("../assets/images/logo.png")}
            style={[styles.logo, { transform: [{ scale: logoScale }] }]}
          />
          <Animated.Text style={[styles.text, { opacity: textOpacity }]}>Dokterian</Animated.Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      gap: 12
    },
    logo: {
      width: 70,
      height: 70,
      resizeMode: "contain",
    },
    text: {
        color: "#0D1B34",
        fontSize: 20,
        lineHeight: 20,
        fontFamily: "Poppins-Bold"
    },
});