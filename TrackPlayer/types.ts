export type RootStackParamList = {
  Main: undefined;
  Player: { trackId: string } | undefined;
  AuthorPlaylist: { artist: string; hero?: string };
  Album: { albumId: number; cover?: string; title?: string; artist?: string };
  Playlist: { playlistId: number; cover?: string; title?: string };
  Radio: { radioId: number; title?: string; picture?: string };
  Podcast: { podcastId: number; cover?: string; title?: string };
};