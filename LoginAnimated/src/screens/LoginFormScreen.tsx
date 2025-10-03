import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Text, TextInput, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { WhiteSlope } from "../components/WhiteSlope";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation";

type Props = NativeStackScreenProps<RootStackParamList, "LoginForm">;

const { width, height } = Dimensions.get("window");

/** ======= IMPORTANTES: estes valores DEVEM bater com a LoginScreen ======= */
/** Altura de branco ao final da LoginScreen (passo anterior) */
const PREV_WHITE_H = Math.round(height * 0.70);
/** Quanto os prédios/carro já tinham subido no passo anterior */
const PREV_BUILDINGS_LIFT = 170;
const PREV_CAR_LIFT = 170;
/** ======================================================================= */

/** Alvo do passo atual (queremos mais branco visível) */
const FORM_WHITE_H = Math.round(height * 0.86);
/** Subidas adicionais neste passo */
const EXTRA_BUILDINGS_LIFT = 60;
const EXTRA_CAR_LIFT = 40;

const CAR_W = 150;
const BLEED = 40;

const City = ({style}: any) => {
  const cityRef = useRef<LottieView>(null);

  useEffect(() => {
    cityRef.current?.play(); // começa do início
    const t = setTimeout(() => {
      cityRef.current?.pause(); // pausa no ponto atual (≈ N segundos depois)
    }, 4500); // 4.5s
    return () => clearTimeout(t);
  }, []);

  return (
    <LottieView
      ref={cityRef}
      source={require("../../assets/buildings.json")}
      autoPlay={true}
      loop={false}
      style={style}
    />
  );
};

export const LoginFormScreen: React.FC<Props> = () => {
  /** -------- Continuação DO PONTO EM QUE PAROU -------- */
  // branco: começa mostrando PREV_WHITE_H e revela até FORM_WHITE_H
  const whiteTY = useSharedValue(FORM_WHITE_H - PREV_WHITE_H);
  // cidade/carro: começam já levantados do passo anterior
  const buildingsTY = useSharedValue(-PREV_BUILDINGS_LIFT);
  const carTY = useSharedValue(-PREV_CAR_LIFT);
  const buildingsScale = useSharedValue(1.1); // na LoginScreen estava 1.1

  /** -------- Form (stagger) -------- */
  const f1TY = useSharedValue(16), f1OP = useSharedValue(0);
  const f2TY = useSharedValue(16), f2OP = useSharedValue(0);
  const f3TY = useSharedValue(16), f3OP = useSharedValue(0); // forgot
  const f4TY = useSharedValue(16), f4OP = useSharedValue(0); // login button
  const f5TY = useSharedValue(16), f5OP = useSharedValue(0); // divider
  const f6TY = useSharedValue(16), f6OP = useSharedValue(0); // signup button

  useEffect(() => {
    // 1) branco termina de subir (slide)
    whiteTY.value = withTiming(0, { duration: 1500, easing: Easing.out(Easing.in(Easing.cubic)) });

    // 2) cidade/carro continuam a subir (pequeno ajuste) + city scale volta pra 1
    buildingsTY.value = withDelay(
      80,
      withTiming(-(PREV_BUILDINGS_LIFT + EXTRA_BUILDINGS_LIFT), { duration: 1650, easing: Easing.out(Easing.cubic) })
    );
    carTY.value = withDelay(
      80,
      withTiming(-(PREV_CAR_LIFT + EXTRA_CAR_LIFT), { duration: 1650, easing: Easing.out(Easing.cubic) })
    );
    buildingsScale.value = withDelay(
      80,
      withTiming(1, { duration: 1650, easing: Easing.out(Easing.cubic) })
    );

    // 3) formulário entra com stagger
    const BASE = 700, GAP = 110;
    const enter = (ty: any, op: any, d: number) => {
      ty.value = withDelay(BASE + d, withTiming(0, { duration: 380, easing: Easing.out(Easing.cubic) }));
      op.value = withDelay(BASE + d, withTiming(1, { duration: 340 }));
    };
    enter(f1TY, f1OP, 0);          // email
    enter(f2TY, f2OP, GAP);        // password
    enter(f3TY, f3OP, GAP * 2);    // forgot
    enter(f4TY, f4OP, GAP * 3);    // login btn
    enter(f5TY, f5OP, GAP * 4);    // divider
    enter(f6TY, f6OP, GAP * 5);    // signup btn
  }, []);

  /** Animated styles */
  const whiteSlideStyle = useAnimatedStyle(() => ({ transform: [{ translateY: whiteTY.value }] }));
  const buildingsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buildingsTY.value }, { scale: 1.1 }, { translateX: -16 }],
  }));
  const carStyle = useAnimatedStyle(() => ({ transform: [{ translateY: carTY.value }] }));

  const s1 = useAnimatedStyle(() => ({ transform: [{ translateY: f1TY.value }], opacity: f1OP.value }));
  const s2 = useAnimatedStyle(() => ({ transform: [{ translateY: f2TY.value }], opacity: f2OP.value }));
  const s3 = useAnimatedStyle(() => ({ transform: [{ translateY: f3TY.value }], opacity: f3OP.value }));
  const s4 = useAnimatedStyle(() => ({ transform: [{ translateY: f4TY.value }], opacity: f4OP.value }));
  const s5 = useAnimatedStyle(() => ({ transform: [{ translateY: f5TY.value }], opacity: f5OP.value }));
  const s6 = useAnimatedStyle(() => ({ transform: [{ translateY: f6TY.value }], opacity: f6OP.value }));

  return (
    <View style={styles.container}>
      <View style={styles.background} />

      {/* cidade */}
      <Animated.View style={[styles.buildingsWrap, buildingsStyle]}>
        <City style={StyleSheet.absoluteFill} />
        {/* <LottieView source={require("../../assets/buildings.json")} autoPlay loop style={StyleSheet.absoluteFill} /> */}
      </Animated.View>

      <Animated.View style={[styles.treeWrap, buildingsStyle]}>
            <LottieView source={require("../../assets/tree.json")} autoPlay loop={false} style={StyleSheet.absoluteFill} />
        </Animated.View>

      {/* carro */}
      <Animated.View style={[styles.carWrap, carStyle]}>
        <LottieView source={require("../../assets/car.json")} autoPlay loop style={StyleSheet.absoluteFill} />
      </Animated.View>

      {/* área branca com topo inclinado (slide) */}
      <View style={styles.whiteViewport} pointerEvents="none">
        <Animated.View style={[styles.whiteSlide, whiteSlideStyle]}>
          {/* <WhiteSlope color="#fff" stretch slope={0} anchor="top" /> */}
          <WhiteSlope color="#fff" stretch slope={5} anchor="top" />
        </Animated.View>
      </View>

      {/* ======= FORM ======= */}
      <View style={styles.form}>
        <View style={{ flex: 1 }}>
            <Animated.View style={s1}>
                <View style={styles.inputRow}>
                    <Text style={styles.icon}>✉️</Text>
                    <TextInput
                    placeholder="Email"
                    defaultValue="uixdesign.me@gmail.com"
                    placeholderTextColor="#777"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    />
                    <Text style={styles.suffix}>✓</Text>
                </View>
                <View style={styles.underlineYellow} />
            </Animated.View>

            <Animated.View style={[{ marginTop: 18 }, s2]}>
                <View style={styles.inputRow}>
                    <Text style={styles.icon}>🔒</Text>
                    <TextInput placeholder="Password" secureTextEntry placeholderTextColor="#777" style={styles.input} />
                    <Text style={styles.suffix}>👁️</Text>
                </View>
                <View style={styles.underline} />
            </Animated.View>

            <Animated.View style={[{ alignItems: "flex-end", marginTop: 10 }, s3]}>
                <Pressable onPress={() => {}}>
                    <Text style={styles.forgot}>Forgot password?</Text>
                </Pressable>
            </Animated.View>

            <Animated.View style={[{ marginTop: 22 }, s4]}>
                <Pressable style={[styles.btn, styles.btnPrimary]} onPress={() => { /* autenticar */ }}>
                    <Text style={[styles.btnText, styles.btnTextDark]}>Log in</Text>
                </Pressable>
            </Animated.View>
        </View>

        <Animated.View style={[styles.dividerWrap, s5]}>
          <View style={styles.divider} />
          <Text style={{ color: "#bbb", marginHorizontal: 10 }}>or</Text>
          <View style={styles.divider} />
        </Animated.View>

        <Animated.View style={[s6]}>
          <Pressable style={[styles.btn, styles.btnOutline]} onPress={() => { /* ir para signup */ }}>
            <Text style={[styles.btnText, styles.btnTextDark]}>Sign up</Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFD700", justifyContent: "flex-end", alignItems: "stretch" },
  background: { ...StyleSheet.absoluteFillObject, backgroundColor: "#FFD700" },

  whiteViewport: {
    position: "absolute",
    bottom: 0,
    left: -BLEED,
    right: -BLEED,
    height: 500, // FORM_WHITE_H,
    overflow: "hidden",
    zIndex: 5,
  },
  whiteSlide: { position: "absolute", top: 0, left: 0, right: 0, height: FORM_WHITE_H },

  buildingsWrap: {
    width,
    height: height * 0.5,
    position: "absolute",
    bottom: 220,
    zIndex: 1,
    transform: [{ scale: 1.2 }],
  },

  treeWrap: { position: "absolute", bottom: 155, right: -150, height: 300, width: 300, zIndex: 1 },

  carWrap: {
    position: "absolute",
    bottom: 190,
    left: -15,
    width: CAR_W,
    height: 150,
    zIndex: 10,
  },

  form: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 24,
    zIndex: 5,
    display: 'flex',
    flexDirection: 'column',
    height: 380
  },
  inputRow: {
    height: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: { width: 22, textAlign: "center", fontSize: 16 },
  input: { flex: 1, fontSize: 16, color: "#111" },
  suffix: { width: 22, textAlign: "center", fontSize: 16, color: "#111" },
  underlineYellow: { height: 2, backgroundColor: "#FFD700" },
  underline: { height: 1, backgroundColor: "#111" },
  forgot: { color: "#FFD700" },

  dividerWrap: {
    marginVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { flex: 1, height: 1, backgroundColor: "#E6E6E6" },

  btn: {
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#FFD700" },
  btnOutline: { borderWidth: 1, borderColor: "#FFD700", backgroundColor: "transparent", marginTop: 10 },
  btnText: { fontSize: 16, fontWeight: "600" },
  btnTextDark: { color: "#111" },
});