import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.deezer.com",
});

/**
 * 🔹 Busca faixas populares (exemplo: chart global)
 */
export async function getTracks() {
  const res = await api.get("/chart/0/tracks");
  return res.data.data.map((track: any) => ({
    id: track.id,
    title: track.title,
    artist: track.artist.name,
    album: track.album.title,
    albumCover: track.album.cover_xl,
    preview: track.preview, // trecho de 30s
  }));
}

/**
 * 🔹 Busca músicas de um artista específico
 * @param artistName Nome do artista (ex: "Ed Sheeran")
 */
export async function getArtistPlaylist(artistName: string, limit = 50) {
  // substitui espaços por +
  const query = artistName.trim().replace(/\s+/g, "+");

  const res = await api.get(`/search/artist?q=${query}`);
  const artist = res.data?.data?.[0];
  if (!artist) {
    return { artist: artistName, hero: undefined, tracks: [] };
  }

  // obtém as músicas top do artista
  const topRes = await api.get(`/artist/${artist.id}/top?limit=${limit}`);
  const tracks = (topRes.data?.data ?? []).map((t: any) => ({
    id: t.id,
    title: t.title,
    artist: t.artist.name,
    album: t.album.title,
    albumCover: t.album.cover_xl || t.album.cover_big,
    preview: t.preview,
    duration: t.duration,
  }));

  return {
    artist: artist.name,
    hero: artist.picture_xl || artist.picture_big,
    tracks,
  };
}