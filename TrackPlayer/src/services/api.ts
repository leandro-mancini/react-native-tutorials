import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.deezer.com",
  timeout: 15000,
});

// Tipos utilitários
export type TrackCard = {
  id: number | string;
  title: string;
  artist: string;
  album: string;
  albumCover?: string;
  preview?: string;     // 30s (quando Deezer disponibiliza)
  duration?: number;    // em segundos
};

export type AlbumCard = {
  id: number | string;
  title: string;
  artist?: string;
  cover?: string;
  link?: string;
};

export type PlaylistCard = {
  id: number | string;
  title: string;
  cover?: string;
  nb_tracks?: number;
};

export type RadioCard = {
  id: number | string;
  title: string;
  picture?: string;
};

// ============ BLOCO BASE ============

/** Chart global – “Os maiores hits do momento” */
export async function getTracks(): Promise<TrackCard[]> {
  const res = await api.get("/chart/0/tracks");
  return (res.data?.data ?? []).map((t: any) => ({
    id: t.id,
    title: t.title,
    artist: t.artist?.name,
    album: t.album?.title,
    albumCover: t.album?.cover_xl || t.album?.cover_big,
    preview: t.preview,
    duration: t.duration,
  }));
}

/** Top de um artista específico (para telas tipo “melhor de cada artista”) */
export async function getArtistPlaylist(artistName: string, limit = 50) {
  const q = artistName.trim().replace(/\s+/g, "+");
  const search = await api.get(`/search/artist?q=${q}`);
  const artist = search.data?.data?.[0];
  if (!artist) return { artist: artistName, hero: undefined, tracks: [] as TrackCard[] };

  const top = await api.get(`/artist/${artist.id}/top?limit=${limit}`);
  const tracks: TrackCard[] = (top.data?.data ?? []).map((t: any) => ({
    id: t.id,
    title: t.title,
    artist: t.artist?.name,
    album: t.album?.title,
    albumCover: t.album?.cover_xl || t.album?.cover_big,
    preview: t.preview,
    duration: t.duration,
  }));

  return {
    artist: artist.name as string,
    hero: artist.picture_xl || artist.picture_big,
    tracks,
  };
}

// ============ SUAS SEÇÕES ============

/** 1) Estações recomendadas (radios populares) */
export async function getRecommendedStations(limit = 30): Promise<RadioCard[]> {
  const res = await api.get("/radio/top", { params: { limit } });
  return (res.data?.data ?? []).map((r: any) => ({
    id: r.id,
    title: r.title,
    picture: r.picture_xl || r.picture_big || r.picture_medium,
  }));
}

/** 2) Recentes → novos lançamentos editoriais (globais) */
export async function getRecentReleases(limit = 30): Promise<AlbumCard[]> {
  // Editorial “0” costuma representar global; retorna álbuns recentes
  const res = await api.get("/editorial/0/releases", { params: { limit } });
  return (res.data?.data ?? []).map((a: any) => ({
    id: a.id,
    title: a.title,
    artist: a.artist?.name,
    cover: a.cover_xl || a.cover_big,
    link: a.link,
  }));
}

/** 3) Mixes mais ouvidos → playlists em alta (chart de playlists) */
export async function getMostListenedMixes(limit = 30): Promise<PlaylistCard[]> {
  const res = await api.get("/chart/0/playlists", { params: { limit } });
  return (res.data?.data ?? []).map((p: any) => ({
    id: p.id,
    title: p.title,
    cover: p.picture_xl || p.picture_big,
    nb_tracks: p.nb_tracks,
  }));
}

/** 4) Mais do que você curte → requer OAuth (baseado em “loved tracks”) */
export async function getMoreOfWhatYouLike(userToken: string, limit = 50): Promise<TrackCard[]> {
  if (!userToken) throw new Error("Deezer user token obrigatório para 'Mais do que você curte'.");
  const authed = axios.create({
    baseURL: "https://api.deezer.com",
    headers: { Authorization: `Bearer ${userToken}` },
    timeout: 15000,
  });
  // Loved tracks do usuário (favoritas)
  const res = await authed.get("/user/me/tracks", { params: { limit } });
  return (res.data?.data ?? []).map((t: any) => ({
    id: t.id,
    title: t.title,
    artist: t.artist?.name,
    album: t.album?.title,
    albumCover: t.album?.cover_xl || t.album?.cover_big,
    preview: t.preview,
    duration: t.duration,
  }));
}

/** 5) Com base no que você ouviu recentemente → requer OAuth (histórico/flow) */
export async function getBasedOnRecent(userToken: string, limit = 50): Promise<TrackCard[]> {
  if (!userToken) throw new Error("Deezer user token obrigatório para recomendações baseadas no histórico.");
  const authed = axios.create({
    baseURL: "https://api.deezer.com",
    headers: { Authorization: `Bearer ${userToken}` },
    timeout: 15000,
  });

  // A API pública não expõe "history" diretamente em todos os apps.
  // Alternativa: usar o "flow" personalizado do usuário (quando habilitado).
  // Alguns ambientes expõem /user/me/flow (stream baseado no gosto).
  const res = await authed.get("/user/me/flow", { params: { limit } });
  const arr = Array.isArray(res.data?.data) ? res.data.data : res.data; // alguns retornam array direto
  return (arr ?? []).map((t: any) => ({
    id: t.id,
    title: t.title,
    artist: t.artist?.name,
    album: t.album?.title,
    albumCover: t.album?.cover_xl || t.album?.cover_big,
    preview: t.preview,
    duration: t.duration,
  }));
}

/** 6) O melhor de cada artista → pega top artistas do chart e busca top faixas de cada um */
export async function getBestOfEachArtist(topArtists = 8, tracksPerArtist = 5) {
  const artistsRes = await api.get("/chart/0/artists", { params: { limit: topArtists } });
  const artists = (artistsRes.data?.data ?? []).slice(0, topArtists);

  const bundles = await Promise.all(
    artists.map(async (a: any) => {
      const top = await api.get(`/artist/${a.id}/top`, { params: { limit: tracksPerArtist } });
      const tracks: TrackCard[] = (top.data?.data ?? []).map((t: any) => ({
        id: t.id,
        title: t.title,
        artist: t.artist?.name,
        album: t.album?.title,
        albumCover: t.album?.cover_xl || t.album?.cover_big,
        preview: t.preview,
        duration: t.duration,
      }));
      return {
        artistId: a.id as number,
        artist: a.name as string,
        picture: a.picture_xl || a.picture_big,
        tracks,
      };
    })
  );

  return bundles; // [{ artist, picture, tracks: [...] }, ...]
}

/** 7) Os maiores hits do momento → alias para chart tracks */
export const getTopHitsOfTheMoment = getTracks;

/** 8) Descobertas para você → seleção editorial (curadoria) */
export async function getDiscoveriesForYou(limit = 30): Promise<PlaylistCard[]> {
  // “selection” costuma retornar coleções editoriais/curadorias
  const res = await api.get("/editorial/0/selection", { params: { limit } });

  return (res.data?.data ?? []).map((p: any) => ({
    id: p.id,
    title: p.title,
    cover: p.cover_xl || p.cover_big,
    nb_tracks: p.nb_tracks,
  }));
}

/** 9) Álbuns em alta para você → chart de álbuns (tendências) */
export async function getTrendingAlbums(limit = 30): Promise<AlbumCard[]> {
  const res = await api.get("/chart/0/albums", { params: { limit } });
  return (res.data?.data ?? []).map((a: any) => ({
    id: a.id,
    title: a.title,
    artist: a.artist?.name,
    cover: a.cover_xl || a.cover_big,
    link: a.link,
  }));
}