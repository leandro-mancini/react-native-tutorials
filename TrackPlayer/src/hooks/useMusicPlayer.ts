import { useEffect, useState } from "react";
import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { getTracks } from "../services/api";
import { setupPlayerOnce } from "../player/setup";

export function useMusicPlayer() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const playback = usePlaybackState();
  const progress = useProgress();

  useEffect(() => {
    (async () => {
      await setupPlayerOnce();
      const loaded = await getTracks();
      setTracks(loaded);

      await TrackPlayer.add(
        loaded.map((t: any, i: any) => ({
          id: String(t.id),
          url: t.preview,
          title: t.title,
          artist: t.artist,
          artwork: t.albumCover,
        }))
      );

      await TrackPlayer.skip(0);
    })();
  }, []);

  // Sincroniza quando faixa ativa mudar (inclusive vindo de outras telas)
  useTrackPlayerEvents(
    [Event.PlaybackActiveTrackChanged, Event.PlaybackQueueEnded],
    async (event) => {
      try {
        if (event.type === Event.PlaybackActiveTrackChanged) {
          const idx = await TrackPlayer.getActiveTrackIndex();
          if (typeof idx === "number") setCurrentIndex(idx);
          const q = await TrackPlayer.getQueue();
          // Normaliza para o shape usado nas telas (albumCover)
          setTracks(
            q.map((t: any) => ({
              id: t.id,
              title: t.title,
              artist: t.artist,
              albumCover: (t.artwork as string) ?? t.albumCover,
              preview: t.url,
              duration: (t as any).duration,
            }))
          );
        }
        if (event.type === Event.PlaybackQueueEnded) {
          // Mantém o índice estável no fim da fila
          const idx = await TrackPlayer.getActiveTrackIndex();
          if (typeof idx === "number") setCurrentIndex(idx);
        }
      } catch {}
    }
  );

  async function togglePlay() {
    const { state } = await TrackPlayer.getPlaybackState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }

  async function next() {
    const nextIdx = (currentIndex + 1) % tracks.length;
    setCurrentIndex(nextIdx);
    await TrackPlayer.skip(nextIdx);
    await TrackPlayer.play();
  }

  async function previous() {
    const prevIdx = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentIndex(prevIdx);
    await TrackPlayer.skip(prevIdx);
    await TrackPlayer.play();
  }

  return {
    tracks,
    currentIndex,
    // usePlaybackState em v5 já retorna o enum State
    playbackState: (playback as unknown as State) ?? State.None,
    progress,
    togglePlay,
    next,
    previous,
  };
}