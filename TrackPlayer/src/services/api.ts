import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.deezer.com",
});

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