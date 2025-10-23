import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { getTracks } from "../services/api";
import { useMusicPlayer } from "../hooks/useMusicPlayer";
import MiniPlayer from "../components/MiniPlayer";

const categories = ["Tudo", "Musicas", "Podcasts"];

export default function MainScreen() {
  const [tracks, setTracks] = useState<any[]>([]);
  const { currentIndex, tracks: playerTracks } = useMusicPlayer();

  useEffect(() => {
    (async () => {
      const data = await getTracks();
      setTracks(data);
    })();
  }, []);

  const renderAlbum = ({ item }: { item: any }) => (
    <Pressable style={styles.albumCard}>
      <Image source={{ uri: item.albumCover }} style={styles.albumCover} />
      <Text style={styles.albumTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.albumArtist} numberOfLines={1}>
        {item.artist}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: playerTracks.length ? 90 : 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>Music</Text>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <Text style={styles.icon}>🔍</Text>
            <Text style={styles.icon}>👤</Text>
          </View>
        </View>

        {/* Categories */}
        <FlatList
          data={categories}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable style={styles.categoryButton}>
              <Text style={styles.categoryText}>{item}</Text>
            </Pressable>
          )}
          style={{ marginVertical: 10 }}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />

        {/* Section: Listen Again */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Listen again</Text>
          <FlatList
            data={tracks.slice(0, 6)}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderAlbum}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>

        {/* Section: Mixed for You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mixed for you</Text>
            <Text style={styles.more}>More</Text>
          </View>
          <FlatList
            data={tracks.slice(6, 12)}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderAlbum}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>
      </ScrollView>

      {/* Mini Player fixo no rodapé */}
      {playerTracks.length > 0 && currentIndex >= 0 && (
        <MiniPlayer />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f0f" },
  header: {
    marginTop: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { color: "#fff", fontSize: 22, fontWeight: "800" },
  icon: { color: "#fff", fontSize: 20 },
  categoryButton: {
    backgroundColor: "#272727",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  section: { marginTop: 20 },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  more: { color: "#aaa", fontSize: 13 },
  albumCard: { marginRight: 12, width: 130 },
  albumCover: {
    width: 130,
    height: 130,
    borderRadius: 8,
    backgroundColor: "#222",
  },
  albumTitle: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 6,
  },
  albumArtist: { color: "#aaa", fontSize: 12 },
});