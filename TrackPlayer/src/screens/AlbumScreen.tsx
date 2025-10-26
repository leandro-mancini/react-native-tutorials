import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Pressable,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {
  Play,
  Pause,
  Shuffle,
  ChevronLeft,
  Ellipsis,
} from 'lucide-react-native';
import TrackPlayer, {
  State,
  usePlaybackState,
} from 'react-native-track-player';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getAlbum } from '../services/api';
import { RootStackParamList } from '../../types';
import MiniPlayer from '../components/MiniPlayer';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import TrackOptionsSheet from '../components/TrackOptionsSheet';
import type { TrackInfo } from '../components/TrackOptionsSheet';

type Props = NativeStackScreenProps<RootStackParamList, 'Album'>;

function normalizeState(s: unknown): State {
  if (typeof s === 'number') return s as unknown as State;
  if (s && typeof s === 'object' && 'state' in (s as any)) {
    const v = (s as any).state;
    if (typeof v === 'number') return v as unknown as State;
  }
  return State.None;
}

export default function AlbumScreen({ route, navigation }: Props) {
  const {
    albumId,
    cover: initialCover,
    title: initialTitle,
    artist: initialArtist,
  } = route.params;
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState<any | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const playback = usePlaybackState() ?? State.None;

  const playbackRaw = usePlaybackState();
  const playbackState = normalizeState(playbackRaw);
  const isPlaying = playbackState === State.Playing;

  const { currentIndex, tracks: playerTracks } = useMusicPlayer();
  const bottomPadding = useMemo(
    () => ({ paddingBottom: playerTracks.length ? 90 : 24 }),
    [playerTracks.length],
  );
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [selected, setSelected] = useState<TrackInfo | null>(null);
  const [albumOptionsOpen, setAlbumOptionsOpen] = useState(false);

  // gradiente respirando
  const fade = useSharedValue(0);
  useEffect(() => {
    fade.value = withRepeat(
      withTiming(1, { duration: 4500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [fade]);
  const layerA = useAnimatedStyle(() => ({ opacity: 1 - fade.value * 0.5 }));
  const layerB = useAnimatedStyle(() => ({
    opacity: 0.35 + fade.value * 0.65,
  }));

  // Parallax header
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });
  const heroParallax = useAnimatedStyle(() => {
    // Move up/down suavemente
    const translateY = interpolate(
      scrollY.value,
      [-HERO, 0, HERO],
      [-HERO * 0.5, 0, HERO * 0.2],
      Extrapolate.CLAMP,
    );
    // Escala: puxa para baixo aumenta, ao rolar para cima diminui levemente
    const scaleUp = interpolate(scrollY.value, [-HERO, 0], [1.6, 1], Extrapolate.CLAMP);
    // Ao rolar para baixo, reduzir de 1 até 0
    const scaleDown = interpolate(scrollY.value, [0, HERO], [1, 0], Extrapolate.CLAMP);
    const scale = scrollY.value < 0 ? scaleUp : scaleDown;
    // Opacidade: some gradualmente ao rolar para cima
    // Mantém 1 por quase todo o percurso e só some quando a capa já está praticamente invisível
    const opacity = interpolate(scrollY.value, [0, HERO * 0.85, HERO], [1, 1, 0], Extrapolate.CLAMP);
    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });
  const blurOverlay = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [HERO * 0.5, HERO * 0.85, HERO],
        [0, 0.35, 0.6],
        Extrapolate.CLAMP,
      ),
    };
  });
  const gradOverlay = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, HERO * 0.6, HERO], [0, 0.25, 0.5], Extrapolate.CLAMP),
    };
  });
  const topTitleStyle = useAnimatedStyle(() => {
    const start = HERO * 0.85;
    return {
      opacity: interpolate(scrollY.value, [start, HERO], [0, 1], Extrapolate.CLAMP),
      transform: [
        {
          translateY: interpolate(scrollY.value, [start, HERO], [6, 0], Extrapolate.CLAMP),
        },
      ],
    };
  });
  const headerActionsStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, HERO * 0.6, HERO * 0.85], [1, 0.4, 0], Extrapolate.CLAMP),
    };
  });
  const stickyPlayStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [HERO * 0.6, HERO * 0.85, HERO], [0, 0.7, 1], Extrapolate.CLAMP),
      transform: [
        {
          scale: interpolate(scrollY.value, [HERO * 0.6, HERO], [0.9, 1], Extrapolate.CLAMP),
        },
      ],
    };
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getAlbum(albumId);
        setAlbum(data);
      } finally {
        setLoading(false);
      }
    })();
  }, [albumId]);

  const hero = album?.cover || initialCover;
  const albumTitle = album?.title ?? initialTitle ?? 'Álbum';
  const albumArtist = album?.artist ?? initialArtist ?? '';

  async function buildQueue(startIndex = 0, shuffled = false) {
    if (!album?.tracks?.length) return;
    const listAll = shuffled ? shuffle(album.tracks) : album.tracks;
    const list = listAll.filter((t: any) => !!t.preview);

    if (!list.length) {
      Alert.alert(
        'Sem preview',
        'Nenhuma faixa deste álbum possui preview disponível para reprodução.',
      );
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
      })),
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
    // Se já está tocando algo, apenas pause/play
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
    // (opcional) reconstruir fila imediatamente quando ativar shuffle
    if (album?.tracks?.length) {
      await buildQueue(0, !isShuffled);
    }
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

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const disabled = !item.preview;
    return (
      <Pressable
        style={[styles.row, disabled && { opacity: 0.5 }]}
        onPress={() => !disabled && buildQueue(index, isShuffled)}
        disabled={disabled}
      >
        <View style={styles.trackMeta}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {disabled ? 'Sem preview disponível' : item.artist}
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

      {/* Top nav overlay */}
      <View style={styles.topNav} pointerEvents="box-none">
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.navBtn}
          hitSlop={10}
        >
          <ChevronLeft size={22} color="#ffffff" />
        </Pressable>
        <Animated.Text style={[styles.topTitle, topTitleStyle]} numberOfLines={1}>
          {albumTitle}
        </Animated.Text>
        <Pressable
          onPress={() => setAlbumOptionsOpen(true)}
          style={styles.navBtn}
          hitSlop={10}
        >
          <Ellipsis size={20} color="#ffffff" />
        </Pressable>
      </View>

      {/* fundo gradiente animado */}
      <Animated.View style={[StyleSheet.absoluteFill, layerA]}>
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={['#1f4037', '#99f2c8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, layerB]}>
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={['#134e5e', '#71b280']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>

      <Animated.FlatList
        onScroll={onScroll}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View style={styles.header}>
            <Animated.View style={[styles.heroWrap, heroParallax]}>
              {hero ? (
                <>
                  <Image source={{ uri: hero }} style={styles.heroImage} />
                  {/* Camada de blur progressivo */}
                  <Animated.Image
                    source={{ uri: hero }}
                    style={[styles.heroBlur, blurOverlay]}
                    blurRadius={16}
                  />
                  {/* Overlay de gradiente para contraste */}
                  <Animated.View style={[StyleSheet.absoluteFill, gradOverlay]} pointerEvents="none">
                    <LinearGradient
                      style={StyleSheet.absoluteFill}
                      colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.35)"]}
                      start={{ x: 0.5, y: 0 }}
                      end={{ x: 0.5, y: 1 }}
                    />
                  </Animated.View>
                </>
              ) : (
                <View style={[styles.heroImage, styles.heroPh]} />
              )}
            </Animated.View>
            <Text style={styles.title} numberOfLines={2}>
              {albumTitle}
            </Text>
            {!!albumArtist && <Text style={styles.artist}>{albumArtist}</Text>}

            {/* ações */}
            <View style={styles.actionsRow}>
              <Pressable
                onPress={onPressShuffle}
                style={styles.circleBtn}
                hitSlop={8}
              >
                <Shuffle size={22} color={isShuffled ? '#1ED760' : '#fff'} />
              </Pressable>
              <Pressable
                onPress={onPressPlay}
                style={[styles.playBtn]}
                hitSlop={8}
              >
                {isPlaying ? (
                  <Pause size={34} color="#000" />
                ) : (
                  <Play size={34} color="#000" />
                )}
              </Pressable>
            </View>

            {loading && (
              <View style={{ paddingVertical: 12 }}>
                <ActivityIndicator color="#fff" />
              </View>
            )}
          </View>
        }
        data={album?.tracks ?? []}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={bottomPadding}
        ListEmptyComponent={
          !loading ? (
            <Text
              style={{ color: '#fff', opacity: 0.8, paddingHorizontal: 16 }}
            >
              Nenhuma faixa encontrada neste álbum.
            </Text>
          ) : null
        }
  />
      <TrackOptionsSheet
        visible={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        track={selected}
        navigation={navigation as any}
      />
      <TrackOptionsSheet
        visible={albumOptionsOpen}
        onClose={() => setAlbumOptionsOpen(false)}
        context="album"
        track={{
          id: albumId,
          title: albumTitle,
          artist: albumArtist || "",
          albumCover: hero,
        }}
        navigation={navigation as any}
      />
      {playerTracks.length > 0 && currentIndex >= 0 && <MiniPlayer />}
    </View>
  );
}

const P = 16;
const HERO = 320;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  topNav: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topTitle: {
    position: 'absolute',
    left: 56,
    right: 56,
    top: 30,
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
  heroWrap: {
    width: '100%',
    height: HERO,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#222',
  },
  heroBlur: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
  },
  heroPh: { borderWidth: 1, borderColor: '#333' },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', marginTop: 16 },
  artist: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 4 },
  actionsRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  circleBtn: {
    width: 56,
    height: 56,
    borderRadius: 56,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 72,
    backgroundColor: '#1ED760',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyPlayBtn: {
    width: 56,
    height: 56,
    borderRadius: 56,
    backgroundColor: '#1ED760',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: P,
    paddingVertical: 12,
  },
  trackMeta: { flex: 1, marginRight: 12 },
  trackTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  trackArtist: { color: '#b3b3b3', fontSize: 12, marginTop: 2 },
  trackDots: { color: '#aaa', fontSize: 18, paddingHorizontal: 6 },
});
