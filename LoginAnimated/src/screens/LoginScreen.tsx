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

  // Botões (stagger: btn1 entra, depois btn2)
  const btn1TY = useSharedValue(16);
  const btn1OP = useSharedValue(0);
  const btn1SC = useSharedValue(0.98);

  const btn2TY = useSharedValue(16);
  const btn2OP = useSharedValue(0);
  const btn2SC = useSharedValue(0.98);

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

    // 4) Stagger de botões
    const BASE = 700;     // começa depois da transição principal
    const GAP = 140;      // atraso entre os botões

    // Botão 1
    btn1TY.value = withDelay(
      BASE,
      withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) })
    );
    btn1OP.value = withDelay(BASE, withTiming(1, { duration: 380 }));
    btn1SC.value = withDelay(
      BASE,
      withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) })
    );

    // Botão 2 (entra depois)
    btn2TY.value = withDelay(
      BASE + GAP,
      withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) })
    );
    btn2OP.value = withDelay(BASE + GAP, withTiming(1, { duration: 380 }));
    btn2SC.value = withDelay(
      BASE + GAP,
      withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) })
    );
  }, [whiteTY, buildingsTY, carTY, btn1TY, btn1OP, btn1SC, btn2TY, btn2OP, btn2SC]);

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
          {/* WhiteSlope pinta o branco e define a inclinação do topo */}
          <WhiteSlope color="#fff" stretch slope={5} anchor="top" />
        </Animated.View>
      </View>

      {/* CTAs (stagger) */}
      <View style={styles.ctaWrap}>
        <Animated.View style={[styles.btnWrap, btn1Style]}>
          <Pressable
            style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && styles.pressed]}
            onPress={() => {/* fluxo de login real aqui */}}
          >
            <Text style={[styles.btnText, styles.btnTextDark]}>Entrar</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.btnWrap, btn2Style]}>
          <Pressable
            style={({ pressed }) => [styles.btn, styles.btnDark, pressed && styles.pressed]}
            onPress={() => navigation.navigate("SignUp")}
          >
            <Text style={[styles.btnText, styles.btnTextLight]}>Criar conta</Text>
          </Pressable>
        </Animated.View>
      </View>
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
    height: 300, // ou TARGET_SLOPE_H se preferir diretamente
    overflow: "hidden",
    zIndex: 5,
  },

  // conteúdo que desliza (sem background)
  whiteSlide: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: TARGET_SLOPE_H,
  },

  buildingsWrap: {
    width,
    height: height * 0.5,
    position: "absolute",
    bottom: 85,
    transform: [{ scale: 1.2 }],
    zIndex: 1,
  },

  carWrap: {
    position: "absolute",
    bottom: 40,
    left: -15,
    width: CAR_W,
    height: 150,
    zIndex: 10,
  },

  // ===== CTAs =====
  ctaWrap: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 60,
    gap: 14,
    zIndex: 20,
  },
  btnWrap: {
    // wrapper animável por botão
  },
  btn: {
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#F6DC00" },
  btnDark: { backgroundColor: "#111" },
  btnText: { fontSize: 12 },
  btnTextDark: { color: "#050607" },
  btnTextLight: { color: "#fff" },
  pressed: { opacity: 0.85 },
});
