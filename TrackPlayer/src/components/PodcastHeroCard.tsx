import React from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { Play, Plus, Share2 } from 'lucide-react-native';

export type PodcastHero = {
  id: number | string;
  title: string; // nome do podcast
  cover?: string;
  description?: string;
};

export function PodcastHeroCard({ podcast, onPress }: { podcast: PodcastHero; onPress?: () => void }) {
  return (
    <Pressable style={styles.container} onPress={onPress} android_ripple={{ color: 'rgba(255,255,255,0.06)' }}>
      <View style={styles.row}>
        <Image source={{ uri: podcast.cover }} style={styles.art} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={2}>
            {podcast.title}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            Episódio • 35 min
          </Text>
          <Text style={styles.desc} numberOfLines={2}>
            {podcast.description || 'Confira o episódio mais recente, com destaques e entrevistas.'}
          </Text>

          <View style={styles.actions}>
            <Pressable style={styles.previewBtn}>
              <Share2 size={16} color="#fff" />
              <Text style={styles.previewText}>Prévia do episódio</Text>
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Pressable hitSlop={8}><Plus size={22} color="#fff" /></Pressable>
              <Pressable hitSlop={8}><Play size={22} color="#fff" /></Pressable>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#2a291f',
    padding: 16,
  },
  row: { flexDirection: 'row', gap: 14 },
  art: { width: 68, height: 68, borderRadius: 8, backgroundColor: '#222' },
  title: { color: '#fff', fontSize: 18, fontWeight: '800' },
  meta: { color: '#d6d6d6', opacity: 0.9, marginTop: 2 },
  desc: { color: '#eaeaea', opacity: 0.9, marginTop: 10 },
  actions: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewBtn: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  previewText: { color: '#fff', fontWeight: '600' },
});

export default PodcastHeroCard;
