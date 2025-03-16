import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

export const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Main"); // Redireciona para a tela principal
    }, 3000); // Tempo da animação
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Animação de fundo */}
      <LottieView
        source={require("../assets/animations/background.json")}
        autoPlay
        loop
        resizeMode="cover"
        style={styles.backgroundAnimation}
      />

      {/* Animação do logotipo */}
      <LottieView
        source={require("../assets/animations/logotipo.json")}
        autoPlay
        loop
        style={styles.logoAnimation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
  },
  backgroundAnimation: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  logoAnimation: {
    width: 200,
    height: 200,
  },
});