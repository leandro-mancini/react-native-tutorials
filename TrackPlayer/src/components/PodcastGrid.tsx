import React from 'react';
import { FlatList, Image, StyleSheet, View } from 'react-native';

export type PodcastItem = {
  id: number | string;
  title: string;
  cover?: string;
  nb_episodes?: number;
  description?: string;
};

export function PodcastGrid({ data }: { data: PodcastItem[] }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      numColumns={4}
      scrollEnabled={false}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
      contentContainerStyle={{ gap: 12 }}
      renderItem={({ item }) => (
        <View style={styles.tile}>
          <Image source={{ uri: item.cover }} style={styles.cover} />
          {/* indicador simples de novidade */}
          {item.nb_episodes && item.nb_episodes > 0 ? (
            <View style={styles.dot} />
          ) : null}
        </View>
      )}
    />
  );
}

const SIZE = 80;
const styles = StyleSheet.create({
  tile: {
    width: SIZE,
    height: SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
    position: 'relative',
  },
  cover: { width: '100%', height: '100%' },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3ea6ff',
    position: 'absolute',
    top: 6,
    right: 6,
    borderWidth: 2,
    borderColor: '#0f0f0f',
  },
});

export default PodcastGrid;
