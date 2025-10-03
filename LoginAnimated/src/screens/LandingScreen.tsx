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

export const LandingScreen: React.FC<Props> = ({ navigation }) => {
  const slopeTY = useSharedValue(SLOPE_H);
  const buildingsTY = useSharedValue(SLOPE_H * 0.5 + 60);
  const carTX = useSharedValue(-CAR_W - 32);

  useEffect(() => {
    // animações
    slopeTY.value = withTiming(0, { duration: 650, easing: Easing.out(Easing.cubic) });
    buildingsTY.value = withDelay(200, withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }));
    carTX.value = withDelay(300, withTiming(0, { duration: 900, easing: Easing.out(Easing.cubic) }));

    // ✅ timeout de 5s e navegação
    const t = setTimeout(() => {
      // opção 1: substitui e evita voltar para o Landing
      navigation.replace('Login');

      // opção 2 (se quiser zerar a pilha):
      // navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }, 4500);

    return () => clearTimeout(t);
  }, [navigation, slopeTY, buildingsTY, carTX]);

  const slopeStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slopeTY.value }] }));
  const buildingsStyle = useAnimatedStyle(() => ({ transform: [{ translateY: buildingsTY.value }, { scale: 1.1 }, { translateX: -16 }] }));
  const carStyle = useAnimatedStyle(() => ({ transform: [{ translateX: carTX.value }] }));

  return (
    <View style={styles.container}>
      <View style={styles.background} />

      <Animated.View style={[styles.buildingsWrap, buildingsStyle]}>
        <LottieView source={require("../../assets/buildings.json")} autoPlay loop style={StyleSheet.absoluteFill} />
      </Animated.View>

      <Animated.View style={[styles.whiteWrap, slopeStyle]} pointerEvents="none">
        <WhiteSlope color="#fff" height={177} slope={30} anchor="bottom" />
      </Animated.View>

      <Animated.View style={[styles.carWrap, carStyle]}>
        <LottieView source={require("../../assets/car.json")} autoPlay loop style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFD700", justifyContent: "flex-end", alignItems: "stretch" },
  background: { ...StyleSheet.absoluteFillObject, backgroundColor: "#FFD700" },
  whiteWrap: { position: "absolute", bottom: 0, left: -BLEED, right: -BLEED, height: SLOPE_H, overflow: "hidden", zIndex: 5 },
  buildingsWrap: { width, height: height * 0.5, position: "absolute", bottom: 130, transform: [{ scale: 1.2 }], zIndex: 1 },
  carWrap: { position: "absolute", bottom: 80, left: -15, width: CAR_W, height: 150, zIndex: 10 },
});
