import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Download, Ellipsis, Heart, Play, Shuffle, Pause } from "lucide-react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import TrackPlayer, { Event, State, usePlaybackState, useTrackPlayerEvents } from "react-native-track-player";
import { getArtistPlaylist } from "../services/api";
import MiniPlayer from "../components/MiniPlayer";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import TrackOptionsSheet, { type TrackInfo } from "../components/TrackOptionsSheet";

type Props = {
  route: { params: { artist: string; hero?: string } };
  navigation: any;
};

const { width } = Dimensions.get("window");
const PADDING = 18;

export function AuthorPlaylistScreen({ route }: Props) {
  const { artist, hero: heroFromRoute } = route.params;
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<string | undefined>(heroFromRoute);
  const [tracks, setTracks] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const playbackState = usePlaybackState();
  const isPlaying = (((playbackState as unknown) as any)?.state ?? playbackState) === State.Playing;
  const { currentIndex, tracks: playerTracks } = useMusicPlayer();
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [selected, setSelected] = useState<TrackInfo | null>(null);

  // gradiente respirando ao fundo
  const fade = useSharedValue(0);
  useEffect(() => {
    fade.value = withRepeat(
      withTiming(1, { duration: 4500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, [fade]);

  const layerA = useAnimatedStyle(() => ({ opacity: 1 - fade.value * 0.5 }));
  const layerB = useAnimatedStyle(() => ({ opacity: 0.35 + fade.value * 0.65 }));

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { hero: _hero, tracks: _tracks } = await getArtistPlaylist(artist);
        setHero((prev) => prev ?? _hero);
        setTracks(_tracks);
      } finally {
        setLoading(false);
      }
    })();
  }, [artist]);

  // Atualiza capa com base na faixa ativa
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async () => {
    try {
      const idx = await TrackPlayer.getActiveTrackIndex();
      if (typeof idx === "number") {
        const q = await TrackPlayer.getQueue();
        const t = q[idx] as any;
        const art = (t?.artwork as string) ?? t?.albumCover;
        if (art) setHero(art);
      }
    } catch {}
  });
  const setupAndPlay = useCallback(
    async (startIndex = 0) => {
      if (!tracks.length) return;
      await TrackPlayer.reset();
      await TrackPlayer.add(
        tracks.map((t) => ({
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
    },
    [tracks]
  );
  const togglePlayPause = useCallback(async () => {
    try {
      const stObjOrEnum = await TrackPlayer.getPlaybackState();
      const st = (stObjOrEnum as any)?.state ?? stObjOrEnum;
      if (st === State.Playing) await TrackPlayer.pause();
      else await TrackPlayer.play();
    } catch {}
  }, []);

  const queueMatchesThisArtist = useCallback(async () => {
    try {
      const q = await TrackPlayer.getQueue();
      if (!q?.length || !tracks.length) return false;
      const a = q.slice(0, 3).map((t: any) => String(t.id));
      const b = tracks.slice(0, 3).map((t: any) => String(t.id));
      return a.join("|") === b.join("|");
    } catch {
      return false;
    }
  }, [tracks]);

  const onPressPlay = useCallback(async () => {
    const match = await queueMatchesThisArtist();
    if (!match) {
      const startIndex = isShuffled && tracks.length ? Math.floor(Math.random() * tracks.length) : 0;
      await setupAndPlay(startIndex);
    } else {
      await togglePlayPause();
    }
  }, [queueMatchesThisArtist, isShuffled, tracks.length, setupAndPlay, togglePlayPause]);
  const onPressItem = (index: number) => setupAndPlay(index);
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
    setTracks((prev) => prev.filter((t) => String(t.id) !== String(id)));
  };

  const Header = useMemo(
    () => (
      <View>
        {/* Fundo animado */}
        <Animated.View style={[StyleSheet.absoluteFill, layerA]}>
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={["#1f1c2c", "#928DAB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, layerB]}>
          <LinearGradient
            style={StyleSheet.absoluteFill}
            colors={["#3a1c71", "#d76d77", "#ffaf7b"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
        </Animated.View>

        <View style={styles.header}>
          {hero ? (
            <Image source={{ uri: hero }} style={styles.hero} />
          ) : (
            <View style={[styles.hero, styles.heroPlaceholder]} />
          )}

          <Text style={styles.title} numberOfLines={1}>
            {artist}
          </Text>

          {/* ações */}
          <View style={styles.actionsRow}>
            <Pressable
              hitSlop={10}
              style={styles.roundIcon}
              onPress={() => setLiked((v) => !v)}
            >
              <Heart
                size={22}
                color={liked ? "#1ED760" : "#ffffff"}
                fill={liked ? "#1ED760" : "transparent"}
              />
            </Pressable>
            <Pressable hitSlop={10} style={styles.roundIcon}>
              {/* <Icon name="download" size={22} color="#fff" /> */}
              <Download />
            </Pressable>
            <Pressable hitSlop={10} style={styles.roundIcon}>
              {/* <Icon name="more-horizontal" size={22} color="#fff" /> */}
              <Ellipsis />
            </Pressable>
          </View>

          {/* Botão play grande (com mini shuffle no canto) */}
          <Pressable onPress={onPressPlay} style={styles.bigPlayBtn} hitSlop={8}>
            {isPlaying ? <Pause color="#000" /> : <Play color="#000" />}
            <Pressable
              onPress={() => setIsShuffled((s) => !s)}
              hitSlop={6}
              style={[
                styles.shuffleBadge,
                { backgroundColor: isShuffled ? "#34D399" : "#A7F3D0" },
              ]}
            >
              <Shuffle color="#000" />
            </Pressable>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Populares de {artist}</Text>
      </View>
    ),
    [artist, hero, layerA, layerB, liked, isShuffled, isPlaying]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={tracks}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={Header}
        contentContainerStyle={{ paddingBottom: playerTracks.length ? 90 : 40 }}
        renderItem={({ item, index }) => (
          <Pressable style={styles.item} onPress={() => onPressItem(index)}>
            <Image source={{ uri: item.albumCover }} style={styles.itemCover} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemSubtitle} numberOfLines={1}>
                {item.artist}
              </Text>
            </View>
            <Pressable hitSlop={10} style={{ paddingHorizontal: 8 }} onPress={() => openOptions(item)}>
              {/* <Icon name="more-vertical" size={20} color="#aaa" /> */}
              <Ellipsis />
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={{ padding: 24 }}>
            <Text style={{ color: "#fff", opacity: 0.9 }}>
              {loading ? "Carregando..." : "Nenhuma faixa encontrada."}
            </Text>
          </View>
        }
      />
      <TrackOptionsSheet
        visible={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        track={selected}
        onHideFromList={hideFromList}
        showHideOption
      />
      {playerTracks.length > 0 && currentIndex >= 0 && <MiniPlayer />}
    </View>
  );
}

const HERO_SIZE = width - PADDING * 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: {
    paddingHorizontal: PADDING,
    paddingTop: 18,
    paddingBottom: 10,
  },
  hero: {
    width: HERO_SIZE,
    height: HERO_SIZE,
    borderRadius: 6,
    alignSelf: "center",
    backgroundColor: "#222",
  },
  heroPlaceholder: { borderWidth: 1, borderColor: "#333" },
  title: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 14,
  },
  roundIcon: {
    width: 42,
    height: 42,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  bigPlayBtn: {
    position: "absolute",
    right: PADDING,
    bottom: -26,
    width: 76,
    height: 76,
    borderRadius: 76,
    backgroundColor: "#1ED760",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  shuffleBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 26,
    backgroundColor: "#A7F3D0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1ED760",
  },
  sectionLabel: {
    paddingHorizontal: PADDING,
    paddingTop: 34,
    paddingBottom: 8,
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: PADDING,
    paddingVertical: 10,
  },
  itemCover: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#222",
  },
  itemTitle: { color: "#fff", fontSize: 14, fontWeight: "600" },
  itemSubtitle: { color: "#b3b3b3", fontSize: 12, marginTop: 2 },
});