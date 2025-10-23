import TrackPlayer from "react-native-track-player";

let setupPromise: Promise<void> | null = null;

export function setupPlayerOnce() {
  if (!setupPromise) {
    setupPromise = (async () => {
      try {
        await TrackPlayer.setupPlayer();
      } catch (e: any) {
        if (
          typeof e?.message === "string" &&
          e.message.includes("already been initialized")
        ) {
          // noop
        } else {
          throw e;
        }
      }
    })();
  }
  return setupPromise;
}