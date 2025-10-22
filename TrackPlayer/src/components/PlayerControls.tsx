import React from "react";
import { View, Pressable } from "react-native";
import Icon from "react-native-vector-icons/Feather";

export function PlayerControls({ isPlaying, onPlayPause, onNext, onPrev }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 30 }}>
      <Pressable onPress={onPrev}>
        <Icon name="skip-back" size={28} color="#fff" />
      </Pressable>

      <Pressable
        onPress={onPlayPause}
        style={{
          backgroundColor: "#fff",
          borderRadius: 50,
          width: 70,
          height: 70,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={isPlaying ? "pause" : "play"} size={32} color="#000" />
      </Pressable>

      <Pressable onPress={onNext}>
        <Icon name="skip-forward" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}