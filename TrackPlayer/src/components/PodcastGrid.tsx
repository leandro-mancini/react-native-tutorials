import React from 'react';
import { FlatList, Image, StyleSheet, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';

export type PodcastItem = {
  id: number | string;
  title: string;
  cover?: string;
  nb_episodes?: number;
  description?: string;
};

export function PodcastGrid({ data }: { data: PodcastItem[] }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      numColumns={4}
      scrollEnabled={false}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 16 }}
      contentContainerStyle={{ gap: 12 }}
      renderItem={({ item }) => (
        <Pressable
          style={styles.tile}
          onPress={() =>
            navigation.navigate('Podcast', {
              podcastId: Number(item.id),
              cover: item.cover,
              title: item.title,
            })
          }
        >
          <Image source={{ uri: item.cover }} style={styles.cover} />
          {item.nb_episodes && item.nb_episodes > 0 ? <View style={styles.dot} /> : null}
        </Pressable>
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
