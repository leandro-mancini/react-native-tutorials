import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

export function Tree() {
  return (
    <LottieView
        source={require("../../assets/tree.json")}
        autoPlay
        loop={false}
        style={StyleSheet.absoluteFill}
    />
  );
}
