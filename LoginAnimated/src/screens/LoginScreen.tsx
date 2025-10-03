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

// onde o container de texto começa (igual à Landing)
const TEXT_START_TOP = 100;
// para onde queremos levar (topo próximo do statusbar)
const TEXT_TARGET_TOP = 48;
// quanto o texto precisa subir
const TEXT_LIFT = TEXT_START_TOP - TEXT_TARGET_TOP;

// easing suave
const SOFT_OUT = Easing.bezier(0.16, 1, 0.3, 1);

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  // animações já existentes
  const slopeTY = useSharedValue(SLOPE_H);
  const buildingsTY = useSharedValue(SLOPE_H * 0.5 + 60);
  const carTX = useSharedValue(-CAR_W - 32);

  // textos: começam do ponto final da Landing (0) e sobem para o topo (-TEXT_LIFT)
  const headingTY = useSharedValue(0);
  const headingOP = useSharedValue(1);
  const subTY = useSharedValue(0);
  const subOP = useSharedValue(1);

  useEffect(() => {
    // área branca / prédios / carro (como antes)
    slopeTY.value = withTiming(0, { duration: 650, easing: SOFT_OUT });
    buildingsTY.value = withDelay(200, withTiming(0, { duration: 700, easing: SOFT_OUT }));
    carTX.value = withDelay(300, withTiming(0, { duration: 900, easing: SOFT_OUT }));

    // textos sobem para o topo (heading primeiro, sub depois)
    headingTY.value = withDelay(
      120,
      withTiming(-TEXT_LIFT, { duration: 700, easing: SOFT_OUT })
    );
    headingOP.value = 1; // mantém visível (sem fade)

    subTY.value = withDelay(
      280, // entra após o heading
      withTiming(-TEXT_LIFT, { duration: 700, easing: SOFT_OUT })
    );
    subOP.value = 1;

    // se houver navegação para outro step, faça depois que as animações terminarem
    // const t = setTimeout(() => navigation.replace("LoginForm"), 1400);
    // return () => clearTimeout(t);
  }, [slopeTY, buildingsTY, carTX, headingTY, subTY, headingOP, subOP]);

  // estilos animados
  const slopeStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slopeTY.value }] }));
  const buildingsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buildingsTY.value }, { scale: 1.1 }, { translateX: -16 }],
  }));
  const carStyle = useAnimatedStyle(() => ({ transform: [{ translateX: carTX.value }] }));

  const headingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headingTY.value }],
    opacity: headingOP.value,
  }));
  const subStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: subTY.value }],
    opacity: subOP.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.background} />

      {/* textos de boas-vindas: começam onde terminaram na Landing e sobem */}
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
        <WhiteSlope color="#fff" stretch slope={5} anchor="top" />
      </Animated.View>

      {/* carro */}
      <Animated.View style={[styles.carWrap, carStyle]}>
        <Car />
      </Animated.View>

      {/* CTAs (stagger) */}
      <View style={styles.ctaWrap}>
        <Animated.View style={[styles.btnWrap]}>
          <ButtonPrimary text="Entrar" onPress={() => navigation.replace("LoginForm")} />
        </Animated.View>

        <Animated.View style={[styles.btnWrap]}>
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
  whiteWrap: { position: "absolute", bottom: 0, left: -BLEED, right: -BLEED, height: SLOPE_H, overflow: "hidden", zIndex: 5 },
  buildingsWrap: { width, height: height * 0.5, position: "absolute", bottom: 100, transform: [{ scale: 1.2 }], zIndex: 1 },
  carWrap: { position: "absolute", bottom: 60, left: -15, width: CAR_W, height: 150, zIndex: 10 },
  treeWrap: { position: "absolute", bottom: 30, right: -150, height: 300, width: 300, zIndex: 1 },

  // CTAs
  ctaWrap: { position: "absolute", left: 24, right: 24, bottom: 60, gap: 14, zIndex: 20 },
  btnWrap: {},
});
