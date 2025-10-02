import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { WhiteSlope } from "../components/WhiteSlope";
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

const { height } = Dimensions.get("window");

export const LandingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Fundo amarelo */}
      <View style={styles.background} />

      {/* Lottie dos prédios */}
      <LottieView
        source={require("../../assets/buildings.json")}
        autoPlay
        loop
        style={styles.buildings}
      />

      {/* Área branca com inclinação */}
      <WhiteSlope />

      {/* Lottie do carro */}
      <LottieView
        source={require("../../assets/car.json")}
        autoPlay
        loop
        style={styles.car}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD700",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFD700",
  },
  buildings: {
    width: 480,
    height: height * 0.5,
    position: "absolute",
    bottom: 140,
  },
  car: {
    width: 150,
    height: 150,
    position: "absolute",
    bottom: 80,
    left: -15
  },
});