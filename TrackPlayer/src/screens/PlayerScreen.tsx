import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Slider from "@react-native-community/slider";
import { Pause, Play, SkipBack, SkipForward, Heart, Shuffle, Repeat, MonitorSpeaker, ListMusic, ChevronLeft, Ellipsis } from "lucide-react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import TrackPlayer, {
  State,
  RepeatMode,
  usePlaybackState,
} from "react-native-track-player";
import { useNavigation } from "@react-navigation/native";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import TrackOptionsSheet from "../components/TrackOptionsSheet";

const { width } = Dimensions.get("window");
const PADDING_H = 22;

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(seconds || 0));
  const min = Math.floor(s / 60);
  const sec = s % 60;
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

export function PlayerScreen() {
  const { tracks, currentIndex, playbackState: hookState, progress, togglePlay, next, previous } =
    useMusicPlayer();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Estados extras (UI)
  const [liked, setLiked] = React.useState<Set<string | number>>(new Set());
  const [isShuffled, setIsShuffled] = React.useState(false);
  const [repeatMode, setRepeatMode] = React.useState<RepeatMode>(RepeatMode.Off);
  const [optionsOpen, setOptionsOpen] = React.useState(false);

  const playbackEnum = usePlaybackState() ?? State.None;
  const playingState = hookState ?? playbackEnum;
  const isPlaying = playingState === State.Playing;

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
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  const trackKey = current.id ?? `${current.title}-${current.artist}`;
  const isLiked = liked.has(trackKey);

  const duration = progress.duration || 30; // Deezer preview ~30s
  const position = Math.min(progress.position || 0, duration);

  // Handlers extras
  function toggleLike() {
    setLiked((prev) => {
      const set = new Set(prev);
      if (set.has(trackKey)) set.delete(trackKey);
      else set.add(trackKey);
      return set;
    });
  }

  async function toggleRepeat() {
    const nextMode =
      repeatMode === RepeatMode.Off
        ? RepeatMode.Queue
        : repeatMode === RepeatMode.Queue
        ? RepeatMode.Track
        : RepeatMode.Off;

    setRepeatMode(nextMode);
    try {
      await TrackPlayer.setRepeatMode(nextMode);
    } catch {
      // se não suportar, fica só no estado visual
    }
  }

  function toggleShuffle() {
    setIsShuffled((v) => !v);
  }

  function goToAuthor() {
    navigation.navigate("AuthorPlaylist", {
      artist: current.artist,
      hero: current.albumCover,
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top nav overlay */}
      <View style={styles.topNav} pointerEvents="box-none">
        <Pressable onPress={() => navigation.goBack()} style={styles.navBtn} hitSlop={10}>
          <ChevronLeft size={22} color="#ffffff" />
        </Pressable>
        <Pressable onPress={() => setOptionsOpen(true)} style={styles.navBtn} hitSlop={10}>
          <Ellipsis size={20} color="#ffffff" />
        </Pressable>
      </View>

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

      <View style={styles.content}>
        <Image source={{ uri: current.albumCover }} style={styles.cover} />

        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>
              {current.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {current.artist}
            </Text>
          </View>
          <Pressable onPress={toggleLike} hitSlop={10} style={styles.iconHitArea}>
            <Heart
              size={26}
              color={isLiked ? "#1ED760" : "#ffffff"}
              fill={isLiked ? "#1ED760" : "transparent"}
            />
          </Pressable>
        </View>

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

        {/* Linha auxiliar com Shuffle e Repeat (como no Spotify) */}
        <View style={styles.topControlsRow}>
          <Pressable onPress={toggleShuffle} hitSlop={10} style={styles.smallBtn}>
            <Shuffle
              size={22}
              color={isShuffled ? "#1ED760" : "#ffffff"}
              strokeWidth={2.2}
            />
          </Pressable>

          <Pressable onPress={toggleRepeat} hitSlop={10} style={styles.smallBtn}>
            <Repeat
              size={22}
              color={repeatMode !== RepeatMode.Off ? "#1ED760" : "#ffffff"}
              strokeWidth={2.2}
            />
            {repeatMode === RepeatMode.Track && (
              <View style={styles.repeatBadge}>
                <Text style={styles.repeatBadgeText}>1</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={styles.controls}>
          <Pressable onPress={previous} hitSlop={12} style={styles.smallBtn}>
            <SkipBack size={26} color="#fff" />
          </Pressable>

          <Pressable onPress={togglePlay} style={styles.playBtn} hitSlop={12}>
            {isPlaying ? <Pause size={34} color="#000" /> : <Play size={34} color="#000" />}
          </Pressable>

          <Pressable onPress={next} hitSlop={12} style={styles.smallBtn}>
            <SkipForward size={26} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.bottomRow}>
          <Pressable hitSlop={10} style={styles.smallBtn} onPress={() => { /* abrir modal de dispositivos */ }}>
            <MonitorSpeaker size={22} color="#ffffff" />
          </Pressable>

          <Pressable hitSlop={10} style={styles.smallBtn} onPress={goToAuthor}>
            <ListMusic size={22} color="#ffffff" />
          </Pressable>
        </View>
      </View>

      <TrackOptionsSheet
        visible={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        navigation={navigation}
        track={{
          id: current.id ?? `${current.title}-${current.artist}`,
          title: current.title,
          artist: current.artist,
          album: (current as any).album,
          albumCover: current.albumCover,
          preview: (current as any).preview,
          duration: (current as any).duration,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  topNav: {
    paddingTop: 30,
    paddingHorizontal: 16,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
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
  headerRow: {
    marginTop: 24,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconHitArea: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 18,
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
  topControlsRow: {
    marginTop: 14,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  controls: {
    marginTop: 18,
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
  repeatBadge: {
    position: "absolute",
    right: 3,
    bottom: 3,
    width: 14,
    height: 14,
    borderRadius: 14,
    backgroundColor: "#1ED760",
    alignItems: "center",
    justifyContent: "center",
  },
  repeatBadgeText: {
    color: "#000",
    fontSize: 9,
    fontWeight: "700",
  },
  bottomRow: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 6,
  },
});

export default PlayerScreen;