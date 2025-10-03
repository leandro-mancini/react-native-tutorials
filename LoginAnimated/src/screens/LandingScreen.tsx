import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
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
import { City } from "../components/City";
import { Tree } from "../components/Tree";
import { Car } from "../components/Car";

type Props = NativeStackScreenProps<RootStackParamList, "Landing">;

const { width, height } = Dimensions.get("window");
const SLOPE_H = Math.round(height * 0.38);
const CAR_W = 150;
const BLEED = 40;

// easing suave
const SOFT_OUT = Easing.bezier(0.16, 1, 0.3, 1);

export const LandingScreen: React.FC<Props> = ({ navigation }) => {
  // animações existentes
  const slopeTY = useSharedValue(SLOPE_H);
  const buildingsTY = useSharedValue(SLOPE_H * 0.5 + 60);
  const carTX = useSharedValue(-CAR_W - 32);

  // textos
  const headingTX = useSharedValue(-width * 0.6); // fora da tela à esquerda
  const headingOP = useSharedValue(0);
  const subTX = useSharedValue(-width * 0.6);
  const subOP = useSharedValue(0);

  useEffect(() => {
    // área branca / prédios / carro
    slopeTY.value = withTiming(0, { duration: 650, easing: SOFT_OUT });
    buildingsTY.value = withDelay(200, withTiming(0, { duration: 700, easing: SOFT_OUT }));
    carTX.value = withDelay(300, withTiming(0, { duration: 900, easing: SOFT_OUT }));

    // textos
    headingTX.value = withDelay(
      100,
      withTiming(0, { duration: 600, easing: SOFT_OUT })
    );
    headingOP.value = withDelay(100, withTiming(1, { duration: 500 }));

    subTX.value = withDelay(
      280, // entra depois do heading
      withTiming(0, { duration: 600, easing: SOFT_OUT })
    );
    subOP.value = withDelay(280, withTiming(1, { duration: 500 }));

    // timeout opcional para navegar
    const t = setTimeout(() => {
      navigation.replace("Login");
    }, 4500);
    return () => clearTimeout(t);
  }, [navigation, slopeTY, buildingsTY, carTX, headingTX, headingOP, subTX, subOP]);

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
  const headingStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: headingTX.value }],
    opacity: headingOP.value,
  }));
  const subStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: subTX.value }],
    opacity: subOP.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.background} />

      {/* textos de boas-vindas */}
      <View style={styles.welcomeTextContainer}>
        <Animated.Text style={[styles.welcomeTextHeading, headingStyle]}>
          Bem-vindo!
        </Animated.Text>
        <Animated.Text style={[styles.welcomeTextSubheading, subStyle]}>
          Vamos viajar juntos
        </Animated.Text>
      </View>

      {/* prédios */}
      <Animated.View style={[styles.buildingsWrap, buildingsStyle]}>
        <City />
      </Animated.View>

      {/* árvore (se tiver) */}
      <Animated.View style={[styles.treeWrap, buildingsStyle]}>
        <Tree />
      </Animated.View>

      {/* área branca inclinada */}
      <Animated.View style={[styles.whiteWrap, slopeStyle]} pointerEvents="none">
        <WhiteSlope color="#fff" height={150} slope={30} anchor="bottom" />
      </Animated.View>

      {/* carro */}
      <Animated.View style={[styles.carWrap, carStyle]}>
        <Car />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6DC00", justifyContent: "flex-end", alignItems: "stretch" },
  background: { ...StyleSheet.absoluteFillObject, backgroundColor: "#F6DC00" },

  // textos
  welcomeTextContainer: { position: "absolute", top: 100, left: 20, zIndex: 10 },
  welcomeTextHeading: { fontSize: 32, color: "#333", fontWeight: "700" },
  welcomeTextSubheading: { fontSize: 16, color: "#333" },

  // lottie/white slope
  whiteWrap: { position: "absolute", bottom: 0, left: -BLEED, right: -BLEED, height: SLOPE_H, overflow: "hidden", zIndex: 5 },
  buildingsWrap: { width, height: height * 0.5, position: "absolute", bottom: 100, transform: [{ scale: 1.2 }], zIndex: 1 },
  carWrap: { position: "absolute", bottom: 60, left: -15, width: CAR_W, height: 150, zIndex: 10 },
  treeWrap: { position: "absolute", bottom: 30, right: -150, height: 300, width: 300, zIndex: 1 },
});
