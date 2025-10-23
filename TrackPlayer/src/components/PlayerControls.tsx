import React from "react";
import { View, Pressable } from "react-native";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react-native";

export function PlayerControls({ isPlaying, onPlayPause, onNext, onPrev }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 30 }}>
      <Pressable onPress={onPrev}>
        <SkipBack />
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
        {isPlaying ? (<Play />) : (<Pause />)}
      </Pressable>

      <Pressable onPress={onNext}>
        <SkipForward />
      </Pressable>
    </View>
  );
}