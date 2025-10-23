import React from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { Play, Pause } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { State } from "react-native-track-player";
import { RootStackParamList } from "../../types";

export default function MiniPlayer() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    tracks,
    currentIndex,
    progress,
    playbackState: hookState,
    togglePlay,
  } = useMusicPlayer();

  const current = tracks[currentIndex];
  if (!current) return null;

  const isPlaying = hookState === State.Playing;
  const duration = Math.max(1, Math.floor(progress.duration || current.duration || 30));
  const position = Math.min(duration, Math.floor(progress.position || 0));
  const pct = position / duration;

  return (
    <Pressable
      onPress={() => navigation.navigate("Player")}
      style={styles.container}
      android_ripple={{ color: "rgba(255,255,255,0.08)" }}
    >
      {/* barra de progresso ao fundo */}
      <View style={styles.progressBg} />
      <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />

      {/* conteúdo */}
      <Image source={{ uri: current.albumCover }} style={styles.cover} />

      <View style={styles.meta}>
        <Text numberOfLines={1} style={styles.title}>
          {current.title}
        </Text>
        <Text numberOfLines={1} style={styles.artist}>
          {current.artist}
        </Text>
      </View>

      <Pressable onPress={togglePlay} style={styles.playBtn} hitSlop={10}>
        {isPlaying ? <Pause size={20} color="#fff" /> : <Play size={20} color="#fff" />}
      </Pressable>
    </Pressable>
  );
}

const HEIGHT = 68;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: HEIGHT,
    backgroundColor: "#181818",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  progressBg: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    bottom: 0,
    height: 3,
    backgroundColor: "#fff",
  },
  cover: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: "#333",
  },
  meta: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  artist: {
    color: "#b3b3b3",
    fontSize: 12,
    marginTop: 2,
  },
  playBtn: {
    padding: 10,
  },
});