import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Image, StyleSheet, Pressable, StatusBar, ActivityIndicator, Alert } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Play, Pause, Shuffle, ChevronLeft, Ellipsis } from "lucide-react-native";
import TrackPlayer, { State, usePlaybackState } from "react-native-track-player";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { getPlaylist } from "../services/api";
import MiniPlayer from "../components/MiniPlayer";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import TrackOptionsSheet from "../components/TrackOptionsSheet";
import type { TrackInfo } from "../components/TrackOptionsSheet";
import Animated, { useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate } from "react-native-reanimated";

function normalizeState(s: unknown): State {
  if (typeof s === "number") return s as unknown as State;
  if (s && typeof s === "object" && "state" in (s as any)) {
    const v = (s as any).state;
    if (typeof v === "number") return v as unknown as State;
  }
  return State.None;
}

export default function PlaylistScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, "Playlist">) {
  const { playlistId, cover: initialCover, title: initialTitle } = route.params;
  const [loading, setLoading] = useState(true);
  const [playlist, setPlaylist] = useState<any | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const playbackRaw = usePlaybackState();
  const playbackState = normalizeState(playbackRaw);
  const isPlaying = playbackState === State.Playing;
  const { currentIndex, tracks: playerTracks } = useMusicPlayer();
  const bottomPadding = { paddingBottom: playerTracks.length ? 90 : 24 };
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [selected, setSelected] = useState<TrackInfo | null>(null);
  const [albumOptionsOpen, setAlbumOptionsOpen] = useState(false);

  // Parallax
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  const heroParallax = useAnimatedStyle(() => {
    const translateY = interpolate(scrollY.value, [-HERO, 0, HERO], [-HERO * 0.5, 0, HERO * 0.2], Extrapolate.CLAMP);
    const scaleUp = interpolate(scrollY.value, [-HERO, 0], [1.6, 1], Extrapolate.CLAMP);
    const scaleDown = interpolate(scrollY.value, [0, HERO], [1, 0], Extrapolate.CLAMP);
    const scale = scrollY.value < 0 ? scaleUp : scaleDown;
    const opacity = interpolate(scrollY.value, [0, HERO * 0.85, HERO], [1, 1, 0], Extrapolate.CLAMP);
    return { transform: [{ translateY }, { scale }], opacity };
  });
  const blurOverlay = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [HERO * 0.5, HERO * 0.85, HERO], [0, 0.35, 0.6], Extrapolate.CLAMP),
  }));
  const topTitleStyle = useAnimatedStyle(() => {
    const start = HERO * 0.85;
    return {
      opacity: interpolate(scrollY.value, [start, HERO], [0, 1], Extrapolate.CLAMP),
      transform: [{ translateY: interpolate(scrollY.value, [start, HERO], [6, 0], Extrapolate.CLAMP) }],
    };
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getPlaylist(playlistId);
        setPlaylist(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [playlistId]);

  const hero = playlist?.cover || initialCover;
  const title = playlist?.title ?? initialTitle ?? "Playlist";

  async function buildQueue(startIndex = 0, shuffled = false) {
    if (!playlist?.tracks?.length) return;
    const listAll = shuffled ? shuffle(playlist.tracks) : playlist.tracks;
    const list = listAll.filter((t: any) => !!t.preview);

    if (!list.length) {
      Alert.alert("Sem preview", "Nenhuma faixa desta playlist possui preview disponível para reprodução.");
      return;
    }

    await TrackPlayer.reset();
    await TrackPlayer.add(
      list.map((t: any) => ({
        id: String(t.id),
        url: t.preview,
        title: t.title,
        artist: t.artist,
        artwork: t.albumCover,
        duration: t.duration ?? 30,
      }))
    );
    await TrackPlayer.skip(startIndex);
    await TrackPlayer.play();
  }

  function shuffle<T>(arr: T[]) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function onPressPlay() {
    const state = playbackState;
    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else if (state === State.Paused) {
      await TrackPlayer.play();
    } else {
      await buildQueue(0, isShuffled);
    }
  }

  async function onPressShuffle() {
    setIsShuffled(v => !v);
    if (playlist?.tracks?.length) await buildQueue(0, !isShuffled);
  }

  const openOptions = (item: any) => {
    setSelected({
      id: item.id,
      title: item.title,
      artist: item.artist,
      album: item.album,
      albumCover: item.albumCover,
      preview: item.preview,
      duration: item.duration,
    });
    setOptionsOpen(true);
  };

  const hideFromList = (id: string | number) => {
    setPlaylist((prev: any | null) => prev ? { ...prev, tracks: prev.tracks.filter((t: any) => String(t.id) !== String(id)) } : prev);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const disabled = !item.preview;
    return (
      <Pressable
        style={[styles.row, disabled && { opacity: 0.5 }]}
        onPress={() => !disabled && buildQueue(index, isShuffled)}
        disabled={disabled}
      >
        <View style={styles.trackMeta}>
          <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {disabled ? "Sem preview disponível" : item.artist}
          </Text>
        </View>
        <Pressable hitSlop={10} onPress={() => openOptions(item)}>
          <Text style={styles.trackDots}>⋯</Text>
        </Pressable>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient style={StyleSheet.absoluteFill} colors={["#141e30", "#243b55"]} />

      {/* Top Nav Overlay */}
      <View style={styles.topNav} pointerEvents="box-none">
        <Pressable onPress={() => navigation.goBack()} style={styles.navBtn} hitSlop={10}>
          <ChevronLeft size={22} color="#ffffff" />
        </Pressable>
        <Animated.Text style={[styles.topTitle, topTitleStyle]} numberOfLines={1}>{title}</Animated.Text>
        <Pressable onPress={() => setAlbumOptionsOpen(true)} style={styles.navBtn} hitSlop={10}>
          <Ellipsis size={20} color="#ffffff" />
        </Pressable>
      </View>

      <Animated.FlatList
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={styles.header}>
            <Animated.View style={[styles.hero, heroParallax]}>
              {hero ? (
                <>
                  <Image source={{ uri: hero }} style={StyleSheet.absoluteFillObject as any} />
                  <Animated.Image source={{ uri: hero }} style={[StyleSheet.absoluteFill, { opacity: 0 }, blurOverlay]} blurRadius={16} />
                </>
              ) : (
                <View style={[StyleSheet.absoluteFill, styles.heroPh]} />
              )}
            </Animated.View>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>

            <View style={styles.actionsRow}>
              <Pressable onPress={onPressShuffle} style={styles.circleBtn} hitSlop={8}>
                <Shuffle size={22} color={isShuffled ? "#1ED760" : "#fff"} />
              </Pressable>
              <Pressable onPress={onPressPlay} style={[styles.playBtn]} hitSlop={8}>
                {isPlaying ? <Pause size={34} color="#000" /> : <Play size={34} color="#000" />}
              </Pressable>
            </View>

            {loading && (
              <View style={{ paddingVertical: 12 }}>
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </View>
        }
        data={playlist?.tracks ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={bottomPadding}
        ListEmptyComponent={!loading ? (
          <Text style={{ color: "#fff", opacity: 0.8, paddingHorizontal: 16 }}>
            Nenhuma faixa encontrada nesta playlist.
          </Text>
        ) : null}
      />
      <TrackOptionsSheet
        visible={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        track={selected}
        onHideFromList={hideFromList}
        navigation={navigation as any}
        showHideOption
      />
      <TrackOptionsSheet
        visible={albumOptionsOpen}
        onClose={() => setAlbumOptionsOpen(false)}
        context="album"
        track={{ id: playlistId, title, artist: "", albumCover: hero }}
        navigation={navigation as any}
      />
      {playerTracks.length > 0 && currentIndex >= 0 && <MiniPlayer />}
    </View>
  );
}

const P = 16;
const HERO = 320;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  topNav: {
    paddingTop: 30,
    paddingBottom: 16,
    paddingHorizontal: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topTitle: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: { paddingHorizontal: P, paddingTop: P, paddingBottom: 8 },
  hero: {
    width: "100%",
    height: HERO,
    borderRadius: 10,
    backgroundColor: "#222",
    overflow: 'hidden',
  },
  heroPh: { borderWidth: 1, borderColor: "#333" },
  title: { color: "#fff", fontSize: 26, fontWeight: "800", marginTop: 16 },
  actionsRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  circleBtn: {
    width: 56, height: 56, borderRadius: 56,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  playBtn: {
    width: 72, height: 72, borderRadius: 72,
    backgroundColor: "#1ED760",
    alignItems: "center", justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: P,
    paddingVertical: 12,
  },
  trackMeta: { flex: 1, marginRight: 12 },
  trackTitle: { color: "#fff", fontSize: 15, fontWeight: "600" },
  trackArtist: { color: "#b3b3b3", fontSize: 12, marginTop: 2 },
  trackDots: { color: "#aaa", fontSize: 18, paddingHorizontal: 6 },
});
