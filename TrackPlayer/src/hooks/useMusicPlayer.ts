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

  const playback = usePlaybackState();
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
        }))
      );

      await TrackPlayer.skip(0);
    })();

    return () => {
      TrackPlayer.reset();
    };
  }, []);

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
    playbackState: playback.state,
    progress,
    togglePlay,
    next,
    previous,
  };
}