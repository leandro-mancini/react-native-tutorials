import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";

export function City({styles}: any) {
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
      style={[StyleSheet.absoluteFill, styles]}
    />
  );
}