import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, Pressable, StatusBar, ActivityIndicator, Alert } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import TrackPlayer, { State, usePlaybackState } from "react-native-track-player";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";
import { getPodcast, getPodcastEpisodes } from "../services/api";

function normalizeState(s: unknown): State {
  if (typeof s === "number") return s as unknown as State;
  if (s && typeof s === "object" && "state" in (s as any)) {
    const v = (s as any).state;
    if (typeof v === "number") return v as unknown as State;
  }
  return State.None;
}

export default function PodcastScreen({ route }: NativeStackScreenProps<RootStackParamList, "Podcast">) {
  const { podcastId, cover: initialCover, title: initialTitle } = route.params;
  const [loading, setLoading] = useState(true);
  const [podcast, setPodcast] = useState<any | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const playbackRaw = usePlaybackState();
  const playbackState = normalizeState(playbackRaw);
  const isPlaying = playbackState === State.Playing;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [p, eps] = await Promise.all([
          getPodcast(podcastId),
          getPodcastEpisodes(podcastId, 50),
        ]);
        setPodcast(p);
        setEpisodes(eps);
      } finally {
        setLoading(false);
      }
    })();
  }, [podcastId]);

  const hero = podcast?.cover || initialCover;
  const title = podcast?.title ?? initialTitle ?? "Podcast";

  async function playEpisode(index: number) {
    const list = episodes.filter(e => !!e.preview);
    if (!list.length) {
      Alert.alert("Sem preview", "Os episódios deste podcast não possuem preview disponível para reprodução.");
      return;
    }
    const target = list[index];
    const startIndex = Math.max(0, list.findIndex(e => e.id === target.id));

    await TrackPlayer.reset();
    await TrackPlayer.add(
      list.map((e: any) => ({
        id: String(e.id),
        url: e.preview,
        title: e.title,
        artist: e.artist,
        artwork: e.albumCover,
        duration: e.duration ?? 30,
      }))
    );
    await TrackPlayer.skip(startIndex);
    await TrackPlayer.play();
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const disabled = !item.preview;
    return (
      <Pressable
        style={[styles.row, disabled && { opacity: 0.5 }]}
        onPress={() => !disabled && playEpisode(index)}
        disabled={disabled}
      >
        <View style={styles.trackMeta}>
          <Text style={styles.trackTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {disabled ? "Sem preview disponível" : item.artist}
          </Text>
        </View>
        <Text style={styles.trackDots}>⋯</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient style={StyleSheet.absoluteFill} colors={["#232526", "#414345"]} />

      <View style={styles.header}>
        {hero ? <Image source={{ uri: hero }} style={styles.hero} /> : <View style={[styles.hero, styles.heroPh]} />}
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        {!!podcast?.description && (
          <Text style={styles.description} numberOfLines={3}>{podcast.description}</Text>
        )}
      </View>

      {loading ? (
        <View style={{ paddingVertical: 12 }}>
          <ActivityIndicator color="#fff" />
        </View>
      ) : (
        <FlatList
          data={episodes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <Text style={{ color: "#fff", opacity: 0.8, paddingHorizontal: 16 }}>
              Nenhum episódio encontrado para este podcast.
            </Text>
          }
        />
      )}
    </View>
  );
}

const P = 16;
const HERO = 220;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111" },
  header: { paddingHorizontal: P, paddingTop: P, paddingBottom: 8 },
  hero: {
    width: HERO,
    height: HERO,
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: "#222",
  },
  heroPh: { borderWidth: 1, borderColor: "#333" },
  title: { color: "#fff", fontSize: 26, fontWeight: "800", marginTop: 16, textAlign: "center" },
  description: { color: "#ddd", fontSize: 12, marginTop: 8, textAlign: "center" },
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
