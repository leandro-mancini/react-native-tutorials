import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

import { WhiteSlope } from "../components/WhiteSlope";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";
import { City } from "../components/City";
import { Tree } from "../components/Tree";
import { Car } from "../components/Car";
import { ButtonPrimary } from "../components/ButtonPrimary";
import { ButtonSecondary } from "../components/ButtonSecondary";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const { width, height } = Dimensions.get("window");
const SLOPE_H = Math.round(height * 0.38);
const CAR_W = 150;
const BLEED = 40;

const TEXT_START_TOP = 100;
const TEXT_TARGET_TOP = 48;
const TEXT_LIFT = TEXT_START_TOP - TEXT_TARGET_TOP;

const SOFT_OUT = Easing.bezier(.87, 0.02, 0.28, 1);

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  // fundo/elementos
  const slopeTY = useSharedValue(150);
  const buildingsTY = useSharedValue(150);
  const carTY = useSharedValue(0);

  // textos
  const headingTY = useSharedValue(0);
  const headingOP = useSharedValue(1);
  const subTY = useSharedValue(0);
  const subOP = useSharedValue(1);

  // botões (stagger)
  const btn1TY = useSharedValue(20);
  const btn1OP = useSharedValue(0);
  const btn1SC = useSharedValue(0.98);

  const btn2TY = useSharedValue(20);
  const btn2OP = useSharedValue(0);
  const btn2SC = useSharedValue(0.98);

  useEffect(() => {
    // base
    slopeTY.value = withTiming(0, { duration: 650, easing: SOFT_OUT });
    buildingsTY.value = withDelay(200, withTiming(-160, { duration: 700, easing: SOFT_OUT }));
    carTY.value = withDelay(0, withTiming(-155, { duration: 900, easing: SOFT_OUT }));

    // textos
    headingTY.value = withDelay(120, withTiming(-TEXT_LIFT, { duration: 700, easing: SOFT_OUT }));
    subTY.value     = withDelay(280, withTiming(-TEXT_LIFT, { duration: 700, easing: SOFT_OUT }));

    // botões: entram depois do movimento principal
    const BASE = 900; // comece após carro/prédios
    const GAP  = 140; // intervalo entre botões

    // btn 1
    btn1TY.value = withDelay(BASE, withTiming(0, { duration: 420, easing: SOFT_OUT }));
    btn1OP.value = withDelay(BASE, withTiming(1, { duration: 360 }));
    btn1SC.value = withDelay(BASE, withTiming(1, { duration: 420, easing: SOFT_OUT }));

    // btn 2
    btn2TY.value = withDelay(BASE + GAP, withTiming(0, { duration: 420, easing: SOFT_OUT }));
    btn2OP.value = withDelay(BASE + GAP, withTiming(1, { duration: 360 }));
    btn2SC.value = withDelay(BASE + GAP, withTiming(1, { duration: 420, easing: SOFT_OUT }));
  }, [
    slopeTY, buildingsTY, carTY,
    headingTY, subTY,
    btn1TY, btn1OP, btn1SC,
    btn2TY, btn2OP, btn2SC
  ]);

  // animated styles
  const slopeStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slopeTY.value }] }));
  const buildingsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buildingsTY.value }, { scale: 1.1 }, { translateX: -16 }],
  }));
  const carStyle = useAnimatedStyle(() => ({ transform: [{ translateY: carTY.value }] }));

  const headingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headingTY.value }],
    opacity: headingOP.value,
  }));
  const subStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: subTY.value }],
    opacity: subOP.value,
  }));

  const btn1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: btn1TY.value }, { scale: btn1SC.value }],
    opacity: btn1OP.value,
  }));
  const btn2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: btn2TY.value }, { scale: btn2SC.value }],
    opacity: btn2OP.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.background} />

      {/* textos */}
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

      {/* árvore */}
      <Animated.View style={[styles.treeWrap, buildingsStyle]}>
        <Tree />
      </Animated.View>

      {/* área branca inclinada */}
      <Animated.View style={[styles.whiteWrap, slopeStyle]} pointerEvents="none">
        <WhiteSlope color="#FFF" height={310} slope={30} anchor="bottom" />
      </Animated.View>

      {/* carro */}
      <Animated.View style={[styles.carWrap, carStyle]}>
        <Car />
      </Animated.View>

      {/* CTAs (stagger bottom→top + fade) */}
      <View style={styles.ctaWrap}>
        <Animated.View style={[styles.btnWrap, btn1Style]}>
          <ButtonPrimary text="Entrar" onPress={() => navigation.replace("LoginForm")} />
        </Animated.View>

        <Animated.View style={[styles.btnWrap, btn2Style]}>
          <ButtonSecondary text="Criar conta" onPress={() => navigation.replace("LoginForm")} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6DC00", justifyContent: "flex-end", alignItems: "stretch" },
  background: { ...StyleSheet.absoluteFillObject, backgroundColor: "#F6DC00" },

  // textos
  welcomeTextContainer: { position: "absolute", top: TEXT_START_TOP, left: 20, zIndex: 10 },
  welcomeTextHeading: { fontSize: 32, color: "#333", fontWeight: "700" },
  welcomeTextSubheading: { fontSize: 16, color: "#333" },

  // lottie/white slope
  whiteWrap: { position: "absolute", bottom: 0, left: -BLEED, right: -BLEED, height: 310, overflow: "hidden", zIndex: 5 },
  buildingsWrap: { width, height: height * 0.5, position: "absolute", bottom: 100, transform: [{ scale: 1.2 }], zIndex: 1 },
  carWrap: { position: "absolute", bottom: 60, left: -15, width: CAR_W, height: 150, zIndex: 10 },
  treeWrap: { position: "absolute", bottom: 30, right: -150, height: 300, width: 300, zIndex: 1 },

  // CTAs
  ctaWrap: { position: "absolute", left: 24, right: 24, bottom: 60, gap: 14, zIndex: 20 },
  btnWrap: {}, // wrapper animável por botão
});