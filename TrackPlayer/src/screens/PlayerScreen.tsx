import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/Feather";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { useMusicPlayer } from "../hooks/useMusicPlayer";

const { width } = Dimensions.get("window");

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

export function PlayerScreen() {
  const { tracks, currentIndex, playbackState: hookState, progress, togglePlay, next, previous } =
    useMusicPlayer();

  // usePlaybackState é redundante se você já expõe via hook, mas deixei aqui
  // caso queira usar diretamente; em ambos os casos o valor é um enum State
  const playbackEnum = usePlaybackState() ?? State.None;
  const playingState = hookState ?? playbackEnum;
  const isPlaying = playingState === State.Playing;

  // Gradiente animado: duas camadas alternando opacidade
  const fade = useSharedValue(0);
  React.useEffect(() => {
    fade.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [fade]);

  const layerAStyle = useAnimatedStyle(() => ({
    opacity: 1 - fade.value * 0.6,
  }));
  const layerBStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + fade.value * 0.6,
  }));

  const current = tracks[currentIndex];

  if (!current) {
    return (
      <View style={[styles.container, styles.center]}>
        <StatusBar barStyle="light-content" />
        <Text style={{ color: "#fff", opacity: 0.9 }}>Carregando músicas…</Text>
      </View>
    );
  }

  const duration = progress.duration || 30; // Deezer preview ~30s
  const position = Math.min(progress.position || 0, duration);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Fundo gradiente animado (2 camadas) */}
      <Animated.View style={[StyleSheet.absoluteFill, layerAStyle]}>
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={["#ff5f6d", "#ffc371"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, layerBStyle]}>
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={["#f54ea2", "#ff7676"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Image source={{ uri: current.albumCover }} style={styles.cover} />

        <View style={{ alignItems: "flex-start", width: "100%", marginTop: 24 }}>
          <Text style={styles.title} numberOfLines={1}>
            {current.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {current.artist}
          </Text>
        </View>

        {/* Barra de progresso */}
        <View style={styles.progressWrapper}>
          <Slider
            value={position}
            minimumValue={0}
            maximumValue={duration}
            step={0.1}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="rgba(255,255,255,0.35)"
            thumbTintColor="#ffffff"
            onSlidingComplete={(val) => TrackPlayer.seekTo(val)}
          />
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        {/* Controles */}
        <View style={styles.controls}>
          <Pressable onPress={previous} hitSlop={12} style={styles.smallBtn}>
            <Icon name="skip-back" size={26} color="#fff" />
          </Pressable>

          <Pressable onPress={togglePlay} style={styles.playBtn} hitSlop={12}>
            <Icon name={isPlaying ? "pause" : "play"} size={34} color="#000" />
          </Pressable>

          <Pressable onPress={next} hitSlop={12} style={styles.smallBtn}>
            <Icon name="skip-forward" size={26} color="#fff" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const PADDING_H = 22;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: PADDING_H,
    paddingTop: 28,
    paddingBottom: 36,
    justifyContent: "center",
  },
  cover: {
    width: width - PADDING_H * 2,
    height: width - PADDING_H * 2,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignSelf: "center",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  artist: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    marginTop: 4,
  },
  progressWrapper: {
    width: "100%",
    marginTop: 24,
  },
  timeRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
  },
  controls: {
    marginTop: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  playBtn: {
    width: 76,
    height: 76,
    borderRadius: 999,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  smallBtn: {
    padding: 8,
  },
});