import { useEffect, useState } from "react";
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { getTracks } from "../services/api";

export function useMusicPlayer() {
  const [tracks, setTracks] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // v4: hook já entrega objeto com `state`
  const playback = usePlaybackState();      // { state: State, ... }
  const progress = useProgress();

  useEffect(() => {
    (async () => {
      await TrackPlayer.setupPlayer();
      const loaded = await getTracks();
      setTracks(loaded);

      await TrackPlayer.add(
        loaded.map((t: any, i: any) => ({
          id: String(t.id),
          url: t.preview,
          title: t.title,
          artist: t.artist,
          artwork: t.albumCover,
          // dica: inclua `duration` se souber (melhora precisão)
        }))
      );

      // posicione no primeiro
      await TrackPlayer.skip(0);
    })();

    // v4: destroy removido → use reset no cleanup
    return () => {
      TrackPlayer.reset();
    };
  }, []);

  async function togglePlay() {
    // v4: getState() deprecated → use getPlaybackState()
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
    // v4: passe NÚMERO (não string)
    await TrackPlayer.skip(nextIdx);
    await TrackPlayer.play();
    // (alternativa) await TrackPlayer.skipToNext();
  }

  async function previous() {
    const prevIdx = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentIndex(prevIdx);
    await TrackPlayer.skip(prevIdx);
    await TrackPlayer.play();
    // (alternativa) await TrackPlayer.skipToPrevious();
  }

  return {
    tracks,
    currentIndex,
    playbackState: playback.state, // mantém API limpa para a UI
    progress,
    togglePlay,
    next,
    previous,
  };
}