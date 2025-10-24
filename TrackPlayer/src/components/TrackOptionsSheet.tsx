import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Share, Alert } from "react-native";
import BottomSheet from "./BottomSheet";
import { Heart, Share2, Plus, EyeOff, Trash2, ListPlus, Radio, Disc, User, Info } from "lucide-react-native";
import TrackPlayer from "react-native-track-player";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types";

export type TrackInfo = {
  id: number | string;
  title: string;
  artist: string;
  album?: string;
  albumCover?: string;
  preview?: string;
  duration?: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  track?: TrackInfo | null;
  onHideFromList?: (id: string | number) => void;
  navigation?: NativeStackNavigationProp<RootStackParamList>;
  showHideOption?: boolean;
};

export default function TrackOptionsSheet({ visible, onClose, track, onHideFromList, navigation, showHideOption = false }: Props) {
  const [liked, setLiked] = useState(false);
  const t = track;

  const options = useMemo(() => {
    if (!t) return [] as Array<{ key: string; label: string; icon: React.ReactNode; action: () => void }>; 
    const addToQueue = async () => {
      try {
        await TrackPlayer.add({
          id: String(t.id),
          url: t.preview ?? "",
          title: t.title,
          artist: t.artist,
          artwork: t.albumCover,
          duration: t.duration ?? 30,
        });
        Alert.alert("Fila", "Faixa adicionada ao final da fila.");
      } catch (e) {
        Alert.alert("Erro", "Não foi possível adicionar à fila.");
      }
    };

    const share = async () => {
      try {
        const message = `${t.title} • ${t.artist}`;
        await Share.share({ message });
      } catch {}
    };

    const goToArtist = () => {
      if (!navigation) return;
      navigation.push("AuthorPlaylist", { artist: t.artist, hero: t.albumCover });
      onClose();
    };

    const hideFromList = () => {
      onHideFromList?.(t.id);
      onClose();
    };

    const likeToggle = () => {
      setLiked(v => !v);
    };

    const basic = [
      { key: "share", label: "Compartilhar", icon: <Share2 color="#fff" size={20} />, action: share },
      { key: "like", label: liked ? "Remover de Curtidas" : "Adicionar a Músicas Curtidas", icon: <Heart color={liked ? "#1ED760" : "#fff"} size={20} fill={liked ? "#1ED760" : "transparent"} />, action: likeToggle },
      { key: "addQueue", label: "Adicionar à fila", icon: <ListPlus color="#fff" size={20} />, action: addToQueue },
      { key: "toArtist", label: "Ir para o artista", icon: <User color="#fff" size={20} />, action: goToArtist },
      { key: "credits", label: "Ver créditos da música", icon: <Info color="#fff" size={20} />, action: () => Alert.alert("Créditos", `${t.title} • ${t.artist}\nÁlbum: ${t.album ?? "—"}`) },
    ];

    if (showHideOption) {
      basic.splice(3, 0, { key: "hide", label: "Ocultar nesta lista", icon: <EyeOff color="#fff" size={20} />, action: hideFromList });
    }
    return basic;
  }, [t, liked, navigation, onHideFromList, onClose, showHideOption]);

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      {t && (
        <View style={styles.headerRow}>
          <Image source={t.albumCover ? { uri: t.albumCover } : undefined} style={styles.cover} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.title} numberOfLines={1}>{t.title}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>{t.artist}{t.album ? ` • ${t.album}` : ""}</Text>
          </View>
        </View>
      )}

      <View style={styles.list}>
        {options.map((opt) => (
          <Pressable key={opt.key} style={styles.item} onPress={opt.action} hitSlop={8}>
            <View style={styles.icon}>{opt.icon}</View>
            <Text style={styles.itemText}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  cover: { width: 46, height: 46, borderRadius: 6, backgroundColor: "#333" },
  title: { color: "#fff", fontWeight: "700", fontSize: 15 },
  subtitle: { color: "#bfbfbf", fontSize: 12, marginTop: 2 },
  list: { paddingHorizontal: 10, paddingBottom: 12 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  itemText: { color: "#fff", fontSize: 14 },
});
