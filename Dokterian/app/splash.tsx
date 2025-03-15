import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

export const SplashScreen = ({ navigation }: any) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
        // Fade-in do logo
        Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }),
        
        // Expansão inicial do logo com bounce
        Animated.spring(logoScale, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
        }),

        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        
        // Pulso animado simulando batimentos cardíacos
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnimation, {
                    toValue: 1.1,
                    duration: 500,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnimation, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.ease,
                    useNativeDriver: true,
                })
            ]),
            { iterations: 3 } // Repete a animação 3 vezes
        ),
    ]).start(() => {
        setTimeout(() => {
            navigation.replace("Main");
        }, 1000);
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
        <Animated.Image
            source={require("../assets/images/logo.png")}
            style={[styles.logo, {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }, { scale: pulseAnimation }],
            }]}
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
      gap: 16
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