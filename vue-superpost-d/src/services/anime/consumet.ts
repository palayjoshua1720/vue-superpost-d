import axios from 'axios';

const CORS_PROXY = 'https://corsproxy.io/?';
const BASE_URL = 'http://api.consumet.org/anime/gogoanime/';

export const searchAnime = async (query: string) => {
  const res = await axios.get(`${CORS_PROXY}${encodeURIComponent(BASE_URL + query)}`);
  return res.data.results;
};

export const getAnimeInfo = async (animeId: string) => {
  const res = await axios.get(`${CORS_PROXY}${encodeURIComponent(BASE_URL + 'info/' + animeId)}`);
  return res.data;
};

export const getEpisodeSources = async (episodeId: string) => {
  const res = await axios.get(`${CORS_PROXY}${encodeURIComponent(BASE_URL + 'watch/' + episodeId)}`);
  return res.data.sources;
};