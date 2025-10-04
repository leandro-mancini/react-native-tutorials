import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text, Pressable, TextInput } from "react-native";
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
import { Lock, Mail } from "lucide-react-native";
import { ButtonToggle } from "../components/ButtonToggle";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const { width, height } = Dimensions.get("window");

const SLOPE_H = Math.round(height * 0.75);
const CAR_W = 150;
const BLEED = 40;

const EXIT_DX = -width * 0.6;
const TEXT_START_TOP = 100;
const TEXT_TARGET_TOP = 48;
const TEXT_LIFT = TEXT_START_TOP - TEXT_TARGET_TOP;

const SOFT_OUT = Easing.bezier(.87, 0.02, 0.28, 1);

export const LoginFormScreen: React.FC<Props> = () => {
  // fundo/elementos
  const slopeTY = useSharedValue(280);
  const buildingsTY = useSharedValue(0);
  const treeTY = useSharedValue(0);
  const carTY = useSharedValue(0);

  // textos
  const headingTX = useSharedValue(0);
  const headingOP = useSharedValue(1);
  const subTX = useSharedValue(0);
  const subOP = useSharedValue(1);

  // form
  const f1TY = useSharedValue(16), f1OP = useSharedValue(0);
  const f2TY = useSharedValue(16), f2OP = useSharedValue(0);
  const f3TY = useSharedValue(16), f3OP = useSharedValue(0); // forgot
  const f4TY = useSharedValue(16), f4OP = useSharedValue(0); // login button
  const f5TY = useSharedValue(16), f5OP = useSharedValue(0); // divider
  const f6TY = useSharedValue(16), f6OP = useSharedValue(0); // signup button
  
  // controle de visibilidade da senha
  const [passwordVisible, setPasswordVisible] = useState(false);
  

  useEffect(() => {
    // base
    slopeTY.value = withTiming(0, { duration: 650, easing: SOFT_OUT });
    buildingsTY.value = withDelay(100, withTiming(-310, { duration: 700, easing: SOFT_OUT }));
    treeTY.value = withDelay(200, withTiming(-310, { duration: 700, easing: SOFT_OUT }));
    carTY.value = withDelay(0, withTiming(-275, { duration: 900, easing: SOFT_OUT }));

    // textos
    headingTX.value = withDelay(120, withTiming(EXIT_DX, { duration: 520, easing: SOFT_OUT }));
    headingOP.value = withDelay(60, withTiming(0, { duration: 500, easing: SOFT_OUT }));

    subTX.value = withDelay(280, withTiming(EXIT_DX, { duration: 520, easing: SOFT_OUT }));
    subOP.value = withDelay(140, withTiming(0, { duration: 500, easing: SOFT_OUT }));

    // form
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
    
  }, [
    slopeTY, buildingsTY, carTY,
    headingTX, headingOP,
    subTX, subOP,
  ]);

  // animated styles
  const slopeStyle = useAnimatedStyle(() => ({ transform: [{ translateY: slopeTY.value }] }));
  const buildingsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buildingsTY.value }, { scale: 1 }, { translateX: -30 }],
  }));
  const treeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: treeTY.value - 135 }, { scale: 1.1 }, { translateX: -30 }],
  }));
  const carStyle = useAnimatedStyle(() => ({ transform: [{ translateY: carTY.value }] }));

  const headingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -TEXT_LIFT }, { translateX: headingTX.value }],
    opacity: headingOP.value,
  }));
  const subStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -TEXT_LIFT }, { translateX: subTX.value }],
    opacity: subOP.value,
  }));

  const s1 = useAnimatedStyle(() => ({ transform: [{ translateY: f1TY.value }], opacity: f1OP.value }));
  const s2 = useAnimatedStyle(() => ({ transform: [{ translateY: f2TY.value }], opacity: f2OP.value }));
  const s3 = useAnimatedStyle(() => ({ transform: [{ translateY: f3TY.value }], opacity: f3OP.value }));
  const s4 = useAnimatedStyle(() => ({ transform: [{ translateY: f4TY.value }], opacity: f4OP.value }));
  const s5 = useAnimatedStyle(() => ({ transform: [{ translateY: f5TY.value }], opacity: f5OP.value }));
  const s6 = useAnimatedStyle(() => ({ transform: [{ translateY: f6TY.value }], opacity: f6OP.value }));

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
      <Animated.View style={[styles.treeWrap, treeStyle]}>
        <Tree />
      </Animated.View>

      {/* área branca inclinada */}
      <Animated.View style={[styles.whiteWrap, slopeStyle]} pointerEvents="none">
        <WhiteSlope color="#FFF" height={588} slope={30} anchor="bottom" />
      </Animated.View>

      {/* carro */}
      <Animated.View style={[styles.carWrap, carStyle]}>
        <Car />
      </Animated.View>

      {/* Form */}
      <View style={styles.form}>
        <View style={{ flex: 1 }}>
            <Animated.View style={s1}>
                <View style={styles.inputRow}>
                    <Mail size={18} />
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor="#777"
                      style={styles.input}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                </View>
                <View style={styles.underline} />
            </Animated.View>

            <Animated.View style={[{ marginTop: 18 }, s2]}>
                <View style={styles.inputRow}>
                    <Lock size={18} />
                    <TextInput placeholder="Senha" secureTextEntry={!passwordVisible} placeholderTextColor="#777" style={styles.input} />
                    <ButtonToggle onPress={() => setPasswordVisible((v) => !v)} />
                </View>
                <View style={styles.underline} />
            </Animated.View>

            <Animated.View style={[{ alignItems: "flex-end", marginTop: 10 }, s3]}>
                <Pressable onPress={() => {}}>
                    <Text style={styles.forgot}>Forgot password?</Text>
                </Pressable>
            </Animated.View>

            <Animated.View style={[{ marginTop: 22 }, s4]}>
              <ButtonPrimary text="Entrar" onPress={() => { /* autenticar */ }} />
            </Animated.View>
        </View>

        <Animated.View style={[styles.dividerWrap, s5]}>
          <View style={styles.divider} />
          <Text style={{ color: "#bbb", marginHorizontal: 10 }}>ou</Text>
          <View style={styles.divider} />
        </Animated.View>

        <Animated.View style={[s6]}>
          <ButtonSecondary text="Criar conta" onPress={() => { /* ir para signup */ }} />
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
  whiteWrap: { position: "absolute", bottom: 0, left: -BLEED, right: -BLEED, height: 588, overflow: "hidden", zIndex: 5 },
  buildingsWrap: { width, height: height * 0.5, position: "absolute", bottom: 215, transform: [{ scale: 1.2 }], zIndex: 1 },
  carWrap: { position: "absolute", bottom: 215, left: -15, width: CAR_W, height: 150, zIndex: 10 },
  treeWrap: { position: "absolute", bottom: 30, right: -150, height: 300, width: 300, zIndex: 1 },

  // Form
  form: { position: "absolute", left: 24, right: 24, bottom: 24, zIndex: 5, display: 'flex', flexDirection: 'column', height: 380 },
  inputRow: { height: 46, flexDirection: "row", alignItems: "center", gap: 10, },
  input: { flex: 1, fontSize: 16, color: "#111" },
  underline: { height: 1, backgroundColor: "#111" },
  forgot: { color: "#666" },
  dividerWrap: { marginVertical: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", },
  divider: { flex: 1, height: 1, backgroundColor: "#E6E6E6" },
});