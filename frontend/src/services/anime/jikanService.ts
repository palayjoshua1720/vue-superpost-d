// services/jikanService.ts
import axios from 'axios';
import type { JikanAnime } from '../../types/anime';

export const searchAnimeJikan = async (query: string): Promise<JikanAnime[]> => {
  const res = await axios.get('https://api.jikan.moe/v4/anime', {
    params: {
      q: query,
      // limit: 5,
    },
  });
  return res.data.data;
};

export const fetchTopAnime = async (): Promise<JikanAnime[]> => {
  const res = await axios.get('https://api.jikan.moe/v4/top/anime', {
    params: { 
      // limit: 25
     },
  });
  return res.data.data;
};

// Show episodes and seasons for selected anime using Jikan API
export const showEpisodesAndSeasons = async (anime: JikanAnime) => {
  try {
    // Fetch episodes for main series
    const epRes = await axios.get(`https://api.jikan.moe/v4/anime/${anime.mal_id}/episodes`);
    const episodes = epRes.data.data || [];
    
    // Fetch related anime (seasons)
    const detailsRes = await axios.get(`https://api.jikan.moe/v4/anime/${anime.mal_id}`);
    const relations = detailsRes.data.data.relations || [];
    const seasons = relations
      .filter((rel: any) => ['Sequel', 'Prequel', 'Side story', 'Summary'].includes(rel.relation))
      .flatMap((rel: any) => rel.entry);
    
    return { episodes, seasons };
  } catch (e) {
    return { episodes: [], seasons: [] };
  }
};

// Fetch episodes for the selected season
export const fetchSeasonEpisodes = async (seasonId: number) => {
  try {
    const epRes = await axios.get(`https://api.jikan.moe/v4/anime/${seasonId}/episodes`);
    return epRes.data.data || [];
  } catch (e) {
    return [];
  }
};