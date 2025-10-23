import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import MiniPlayer from '../components/MiniPlayer';
import { useMusicPlayer } from '../hooks/useMusicPlayer';

import {
  getTracks as getTopHitsOfTheMoment,
  getRecommendedStations,
  getRecentReleases,
  getMostListenedMixes,
  getMoreOfWhatYouLike,
  getBasedOnRecent,
  getBestOfEachArtist,
  getDiscoveriesForYou,
  getTrendingAlbums,
} from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

const categories = ['Tudo', 'Músicas', 'Podcasts'];

const USER_TOKEN: string | null = null;

export default function MainScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { currentIndex, tracks: playerTracks } = useMusicPlayer();

  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState<any[]>([]);
  const [recentReleases, setRecentReleases] = useState<any[]>([]);
  const [mixes, setMixes] = useState<any[]>([]);
  const [likedMore, setLikedMore] = useState<any[]>([]);
  const [basedOnRecent, setBasedOnRecent] = useState<any[]>([]);
  const [bestOfArtists, setBestOfArtists] = useState<any[]>([]);
  const [topHits, setTopHits] = useState<any[]>([]);
  const [discoveries, setDiscoveries] = useState<any[]>([]);
  const [trendingAlbums, setTrendingAlbums] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const [
          stationsRes,
          releasesRes,
          mixesRes,
          topHitsRes,
          discoveriesRes,
          trendingRes,
          bestOfRes,
        ] = await Promise.all([
          getRecommendedStations(20),
          getRecentReleases(20),
          getMostListenedMixes(20),
          getTopHitsOfTheMoment(),
          getDiscoveriesForYou(20),
          getTrendingAlbums(20),
          getBestOfEachArtist(8, 5),
        ]);

        setStations(stationsRes);
        setRecentReleases(releasesRes);
        setMixes(mixesRes);
        setTopHits(topHitsRes);
        setDiscoveries(discoveriesRes);
        setTrendingAlbums(trendingRes);
        setBestOfArtists(bestOfRes);

        if (USER_TOKEN) {
          const [liked, based] = await Promise.all([
            getMoreOfWhatYouLike(USER_TOKEN, 30),
            getBasedOnRecent(USER_TOKEN, 30),
          ]);
          setLikedMore(liked);
          setBasedOnRecent(based);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const bottomPadding = useMemo(
    () => ({ paddingBottom: playerTracks.length ? 90 : 20 }),
    [playerTracks.length],
  );

  const renderTrack = ({ item }: { item: any }) => (
    <Pressable style={styles.cardSm}>
      <Image source={{ uri: item.albumCover }} style={styles.cardSmCover} />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.cardSubtitle} numberOfLines={1}>
        {item.artist}
      </Text>
    </Pressable>
  );

  const renderAlbum = ({ item }: { item: any }) => (
    <Pressable
      style={styles.albumCard}
      onPress={() =>
        navigation.navigate('Album', {
          albumId: Number(item.id),
          cover: item.cover || item.albumCover,
          title: item.title,
          artist: item.artist,
        })
      }
    >
      <Image
        source={{ uri: item.cover || item.albumCover }}
        style={styles.albumCover}
      />
      <Text style={styles.albumTitle} numberOfLines={1}>
        {item.title}
      </Text>
      {!!item.artist && (
        <Text style={styles.albumArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      )}
    </Pressable>
  );

  const renderMix = ({ item }: { item: any }) => (
    <Pressable style={styles.card}>
      <Image source={{ uri: item.cover }} style={styles.cardCover} />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      {!!item.nb_tracks && (
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {item.nb_tracks} músicas
        </Text>
      )}
    </Pressable>
  );

  const renderRadio = ({ item }: { item: any }) => (
    <Pressable style={styles.card}>
      <Image source={{ uri: item.picture }} style={styles.cardCover} />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </Pressable>
  );

  const renderBestOf = ({ item }: { item: any }) => (
    <View style={{ marginRight: 16, width: 180 }}>
      <Image source={{ uri: item.picture }} style={styles.bestOfCover} />
      <Text style={[styles.cardTitle, { marginTop: 8 }]} numberOfLines={1}>
        O melhor de {item.artist}
      </Text>
      <FlatList
        data={item.tracks.slice(0, 3)}
        keyExtractor={t => String(t.id)}
        renderItem={({ item: t }) => (
          <Text style={styles.bestOfTrack} numberOfLines={1}>
            • {t.title}
          </Text>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={bottomPadding}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Music</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Text style={styles.icon}>📡</Text>
            <Text style={styles.icon}>🔍</Text>
            <Text style={styles.icon}>👤</Text>
          </View>
        </View>

        <FlatList
          data={categories}
          keyExtractor={item => item}
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

        {loading && (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator color="#fff" />
          </View>
        )}

        {!!stations.length && (
          <Section title="Estações recomendadas">
            <FlatList
              data={stations}
              keyExtractor={item => String(item.id)}
              renderItem={renderRadio}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Section>
        )}

        {!!recentReleases.length && (
          <Section title="Recentes">
            <FlatList
              data={recentReleases}
              keyExtractor={item => String(item.id)}
              renderItem={renderAlbum}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Section>
        )}

        {!!mixes.length && (
          <Section title="Mixes mais ouvidos">
            <FlatList
              data={mixes}
              keyExtractor={item => String(item.id)}
              renderItem={renderMix}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Section>
        )}

        {USER_TOKEN && !!likedMore.length && (
          <Section title="Mais do que você curte">
            <FlatList
              data={likedMore}
              keyExtractor={item => String(item.id)}
              renderItem={renderTrack}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Section>
        )}

        {USER_TOKEN && !!basedOnRecent.length && (
          <Section title="Com base no que você ouviu recentemente">
            <FlatList
              data={basedOnRecent}
              keyExtractor={item => String(item.id)}
              renderItem={renderTrack}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Section>
        )}

        {!!bestOfArtists.length && (
          <Section title="O melhor de cada artista">
            <FlatList
              data={bestOfArtists}
              keyExtractor={item => String(item.artistId)}
              renderItem={renderBestOf}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Section>
        )}

        {!!topHits.length && (
          <Section title="Os maiores hits do momento">
            <FlatList
              data={topHits}
              keyExtractor={item => String(item.id)}
              renderItem={renderTrack}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Section>
        )}

        {!!discoveries.length && (
          <Section title="Descobertas para você">
            <FlatList
              data={discoveries}
              keyExtractor={item => String(item.id)}
              renderItem={renderMix}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Section>
        )}

        {!!trendingAlbums.length && (
          <Section title="Álbuns em alta para você">
            <FlatList
              data={trendingAlbums}
              keyExtractor={item => String(item.id)}
              renderItem={renderAlbum}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </Section>
        )}
      </ScrollView>

      {playerTracks.length > 0 && currentIndex >= 0 && <MiniPlayer />}
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f0f' },
  header: {
    marginTop: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: { color: '#fff', fontSize: 22, fontWeight: '800' },
  icon: { color: '#fff', fontSize: 20 },
  categoryButton: {
    backgroundColor: '#272727',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  section: { marginTop: 20 },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    paddingHorizontal: 16,
  },

  card: { marginRight: 12, width: 140 },
  cardCover: {
    width: 140,
    height: 140,
    borderRadius: 8,
    backgroundColor: '#222',
  },
  cardSm: { marginRight: 12, width: 130 },
  cardSmCover: {
    width: 130,
    height: 130,
    borderRadius: 8,
    backgroundColor: '#222',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },
  cardSubtitle: { color: '#aaa', fontSize: 12 },

  bestOfCover: {
    width: 180,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#222',
  },
  bestOfTrack: { color: '#b3b3b3', fontSize: 12, marginTop: 2 },

  albumCard: {
    marginRight: 12,
    width: 130,
  },

  albumCover: {
    width: 130,
    height: 130,
    borderRadius: 8,
    backgroundColor: '#222',
  },

  albumTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
  },

  albumArtist: {
    color: '#aaa',
    fontSize: 12,
  },
});
