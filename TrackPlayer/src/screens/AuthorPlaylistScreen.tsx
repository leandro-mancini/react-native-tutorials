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
import { Download, Ellipsis, Heart, Play, Shuffle } from "lucide-react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import TrackPlayer from "react-native-track-player";
import { getArtistPlaylist } from "../services/api";

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

  const onPressPlay = () => setupAndPlay(0);
  const onPressItem = (index: number) => setupAndPlay(index);

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
            <Pressable hitSlop={10} style={styles.roundIcon}>
                <Heart />
              {/* <Icon name="heart" size={22} color="#1ed760" /> */}
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
            {/* <Icon name="play" size={34} color="#000" /> */}
            <Play />
            <View style={styles.shuffleBadge}>
              {/* <Icon name="shuffle" size={14} color="#000" /> */}
              <Shuffle />
            </View>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Populares de {artist}</Text>
      </View>
    ),
    [artist, hero, layerA, layerB]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <FlatList
        data={tracks}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={Header}
        contentContainerStyle={{ paddingBottom: 40 }}
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
            <Pressable hitSlop={10} style={{ paddingHorizontal: 8 }}>
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