import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { WhiteSlope } from "../components/WhiteSlope";
import type { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Landing">;

const { width, height } = Dimensions.get("window");
const SLOPE_H = Math.round(height * 0.38);
const CAR_W = 150;
const BLEED = 40;

export const LandingScreen: React.FC<Props> = () => {
  // estados animados
  const slopeTY = useSharedValue(SLOPE_H);               // área branca começa fora (baixo)
  const buildingsTY = useSharedValue(SLOPE_H * 0.5 + 60);// prédios começam mais baixos
  const carTX = useSharedValue(-CAR_W - 32);             // carro começa fora (esquerda)

  useEffect(() => {
    // 1) área branca sobe
    slopeTY.value = withTiming(0, {
      duration: 650,
      easing: Easing.out(Easing.cubic),
    });

    // 2) prédios sobem (delay 200ms)
    buildingsTY.value = withDelay(
      200,
      withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) })
    );

    // 3) carro entra da esquerda pro centro (junto com prédios)
    const carEnd = 0;
    carTX.value = withDelay(
      200,
      withTiming(carEnd, { duration: 900, easing: Easing.out(Easing.cubic) })
    );
  }, [slopeTY, buildingsTY, carTX]);

  // estilos animados
  const slopeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slopeTY.value }],
  }));

  const buildingsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buildingsTY.value }, { scale: 1.1 }, { translateX: -16 }],
  }));

  const carStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: carTX.value }],
  }));

  return (
    <View style={styles.container}>
      {/* fundo amarelo */}
      <View style={styles.background} />

      {/* prédios (sobem com delay) */}
      <Animated.View style={[styles.buildingsWrap, buildingsStyle]}>
        <LottieView
          source={require("../../assets/buildings.json")}
          autoPlay
          loop
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* área branca inclinada (sobe primeiro) */}
      <Animated.View style={[styles.whiteWrap, slopeStyle]} pointerEvents="none">
        <WhiteSlope />
      </Animated.View>

      {/* carro (esquerda → direita com o mesmo delay) */}
      <Animated.View style={[styles.carWrap, carStyle]}>
        <LottieView
          source={require("../../assets/car.json")}
          autoPlay
          loop
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD700",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFD700",
  },

  // Wrapper da área branca: a WhiteSlope desenha o polígono; aqui só animamos translateY
  whiteWrap: {
    position: "absolute",
    bottom: 0,
    left: -BLEED,
    right: -BLEED,
    height: SLOPE_H,
    overflow: "hidden",
    zIndex: 5, // fica atrás dos prédios
  },

  // Wrapper dos prédios para animar translateY
  buildingsWrap: {
    width: width,
    height: height * 0.5,
    position: "absolute",
    bottom: 130,
    transform: [{ scale: 1.2 }],
    zIndex: 1,
  },

  // Wrapper do carro para animar translateX
  carWrap: {
    position: "absolute",
    bottom: 80,
    left: -15,        // translateX parte deste ponto
    width: CAR_W,
    height: 150,
    zIndex: 10,
  },
});