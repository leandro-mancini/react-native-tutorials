import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

export function Buildings() {
  return (
    <LottieView
        source={require("../../assets/buildings.json")}
        autoPlay
        loop
        style={StyleSheet.absoluteFill}
    />
  );
}