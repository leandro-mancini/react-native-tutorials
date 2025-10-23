export type RootStackParamList = {
  Main: undefined;
  Player: { trackId: string } | undefined;
  AuthorPlaylist: { artist: string; hero?: string };
  Album: { albumId: number; cover?: string; title?: string; artist?: string };
};