import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions, Pressable, Text } from "react-native";
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

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const { width, height } = Dimensions.get("window");

// Estado final da Landing (ponto inicial no Login)
const SLOPE_H = Math.round(height * 0.38);

// Alvo no Login (quão alta fica a área branca depois do slide)
const TARGET_SLOPE_H = Math.round(height * 0.70);

// Subidas do conteúdo no Login
const BUILDINGS_LIFT = 170;
const CAR_LIFT = 170;

const CAR_W = 150;
const BLEED = 40;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  // --- Área branca em slide: começa mostrando SLOPE_H e revela até TARGET_SLOPE_H
  const whiteTY = useSharedValue(TARGET_SLOPE_H - SLOPE_H);

  // Prédios / Carro sobem
  const buildingsTY = useSharedValue(0);
  const carTY = useSharedValue(0);

  // CTAs
  const ctaTY = useSharedValue(16);
  const ctaOP = useSharedValue(0);

  useEffect(() => {
    // 1) Área branca: slide de baixo para cima
    whiteTY.value = withTiming(0, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });

    // 2) Prédios
    buildingsTY.value = withDelay(
      100,
      withTiming(-BUILDINGS_LIFT, {
        duration: 650,
        easing: Easing.out(Easing.cubic),
      })
    );

    // 3) Carro
    carTY.value = withDelay(
      100,
      withTiming(-CAR_LIFT, {
        duration: 650,
        easing: Easing.out(Easing.cubic),
      })
    );

    // 4) CTAs
    ctaTY.value = withDelay(
      700,
      withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) })
    );
    ctaOP.value = withDelay(700, withTiming(1, { duration: 400 }));
  }, [whiteTY, buildingsTY, carTY, ctaTY, ctaOP]);

  // animated styles
  const whiteSlideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: whiteTY.value }],
  }));

  const buildingsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buildingsTY.value }, { scale: 1.1 }, { translateX: -16 }],
  }));

  const carStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: carTY.value }],
  }));

  const ctaStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ctaTY.value }],
    opacity: ctaOP.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.background} />

      {/* prédios (sobem) */}
      <Animated.View style={[styles.buildingsWrap, buildingsStyle]}>
        <LottieView
          source={require("../../assets/buildings.json")}
          autoPlay
          loop
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* carro (sobe) */}
      <Animated.View style={[styles.carWrap, carStyle]}>
        <LottieView
          source={require("../../assets/car.json")}
          autoPlay
          loop
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* ===== Área branca com TOPO INCLINADO em SLIDE ===== */}
      <View style={styles.whiteViewport} pointerEvents="none">
        <Animated.View style={[styles.whiteSlide, whiteSlideStyle]}>
          {/* IMPORTANTE: sem background aqui; o WhiteSlope pinta tudo em branco com topo inclinado */}
          {/* <WhiteSlope
            color="#fff"
            slope={30}
            bleed={BLEED}
            anchor="top"
            stretch
          /> */}
          <WhiteSlope color="#fff" stretch slope={5} anchor="top" />
        </Animated.View>
      </View>

      {/* CTAs */}
      <Animated.View style={[styles.ctaWrap, ctaStyle]}>
        <Pressable
          style={({ pressed }) => [styles.btn, styles.btnDark, pressed && styles.pressed]}
          onPress={() => {/* fluxo de login real aqui */}}
        >
          <Text style={[styles.btnText, styles.btnTextLight]}>Entrar</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && styles.pressed]}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={[styles.btnText, styles.btnTextDark]}>Criar conta</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFD700", justifyContent: "flex-end", alignItems: "stretch" },
  background: { ...StyleSheet.absoluteFillObject, backgroundColor: "#FFD700" },

  // viewport fixo com a ALTURA FINAL da área branca
  whiteViewport: {
    position: "absolute",
    bottom: 0,
    left: -BLEED,
    right: -BLEED,
    height: 345,
    overflow: "hidden",
    zIndex: 5,
  },

  // conteúdo que desliza (AGORA sem background!)
  whiteSlide: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: TARGET_SLOPE_H,
    // backgroundColor: "#fff",  // <- remova/DEIXE TRANSPARENTE para a inclinação aparecer
  },

  buildingsWrap: {
    width,
    height: height * 0.5,
    position: "absolute",
    bottom: 130,
    transform: [{ scale: 1.2 }],
    zIndex: 1,
  },

  carWrap: {
    position: "absolute",
    bottom: 80,
    left: -15,
    width: CAR_W,
    height: 150,
    zIndex: 10,
  },

  ctaWrap: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 24,
    gap: 12,
    zIndex: 5,
  },
  btn: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  btnPrimary: { backgroundColor: "#FFD700" },
  btnDark: { backgroundColor: "#111" },
  btnText: { fontSize: 16, fontWeight: "600" },
  btnTextDark: { color: "#111" },
  btnTextLight: { color: "#fff" },
  pressed: { opacity: 0.85 },
});
