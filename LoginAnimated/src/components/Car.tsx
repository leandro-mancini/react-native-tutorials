import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";

export function Car() {
    return (
        <LottieView
            source={require("../../assets/lotties/car.json")}
            autoPlay
            loop
            style={StyleSheet.absoluteFill}
        />
    );
}