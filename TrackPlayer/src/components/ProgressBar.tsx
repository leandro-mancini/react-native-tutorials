import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Slider from "@react-native-community/slider";
// import { useMusicPlayer } from "../hooks/useMusicPlayer";

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

export function ProgressBar({ position, duration, onSlide }: any) {
  return (
    <View style={styles.container}>
      <Slider
        style={{ flex: 1 }}
        value={position}
        minimumValue={0}
        maximumValue={duration}
        thumbTintColor="#fff"
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="rgba(255,255,255,0.3)"
        onSlidingComplete={onSlide}
      />
      <View style={styles.time}>
        <Text style={styles.text}>{formatTime(position)}</Text>
        <Text style={styles.text}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", paddingHorizontal: 20 },
  time: { flexDirection: "row", justifyContent: "space-between" },
  text: { color: "#fff", fontSize: 12, opacity: 0.8 },
});