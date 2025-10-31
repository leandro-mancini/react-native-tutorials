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
      // Se já existe fila ativa, sincroniza estado local e NÃO modifica a fila nem a posição
      const existingQueue = await TrackPlayer.getQueue();
      if (existingQueue?.length) {
        setTracks(
          existingQueue.map((t: any) => ({
            id: t.id,
            title: t.title,
            artist: t.artist,
            albumCover: (t.artwork as string) ?? t.albumCover,
            preview: t.url,
            duration: (t as any).duration,
          }))
        );
        const idx = await TrackPlayer.getActiveTrackIndex();
        if (typeof idx === "number") setCurrentIndex(idx);
        return;
      }

      // Caso contrário, podemos carregar um conjunto inicial (ex.: chart), sem avançar posição
      try {
        const loaded = await getTracks();
        setTracks(loaded);
        await TrackPlayer.add(
          loaded.map((t: any) => ({
            id: String(t.id),
            url: t.preview,
            title: t.title,
            artist: t.artist,
            artwork: t.albumCover,
            duration: t.duration,
          }))
        );
      } catch {}
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
    const ps = await TrackPlayer.getPlaybackState();
    const state = (ps as any)?.state ?? ps;
    if (state === State.Playing) await TrackPlayer.pause();
    else await TrackPlayer.play();
  }

  async function next() {
    try {
      await TrackPlayer.skipToNext();
      await TrackPlayer.play();
    } catch {
      // fallback para índice quando API não suportar
      const q = await TrackPlayer.getQueue();
      if (!q?.length) return;
      const nextIdx = (currentIndex + 1) % q.length;
      await TrackPlayer.skip(nextIdx);
      await TrackPlayer.play();
    }
  }

  async function previous() {
    try {
      await TrackPlayer.skipToPrevious();
      await TrackPlayer.play();
    } catch {
      const q = await TrackPlayer.getQueue();
      if (!q?.length) return;
      const prevIdx = (currentIndex - 1 + q.length) % q.length;
      await TrackPlayer.skip(prevIdx);
      await TrackPlayer.play();
    }
  }

  return {
    tracks,
    currentIndex,
    playbackState: ((playback as any)?.state ?? (playback as unknown as State)) ?? State.None,
    progress,
    togglePlay,
    next,
    previous,
  };
}