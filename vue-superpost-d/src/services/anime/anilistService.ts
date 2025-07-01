// services/anilistService.ts
import axios from 'axios';
import type { AnilistAnime } from '../../types/anime';

interface AnilistResponse {
  data: {
    Media: AnilistAnime;
  };
}

interface AnilistListResponse {
  data: {
    Page: {
      media: AnilistAnime[];
    };
  };
}

// Fetch a list of popular anime from AniList
export const fetchAnilistAnimeList = async (): Promise<AnilistAnime[]> => {
  const gqlQuery = {
    query: `
      query {
        Page(perPage: 12) {
          media(type: ANIME, sort: POPULARITY_DESC) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            description(asHtml: false)
            averageScore
            popularity
            episodes
            genres
          }
        }
      }
    `,
    variables: {},
  };

  const res = await axios.post<AnilistListResponse>('https://graphql.anilist.co', gqlQuery, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data.data.Page.media;
};

// Search for a single anime by title
export const searchAnimeAnilist = async (query: string): Promise<AnilistAnime> => {
  const gqlQuery = {
    query: `
      query ($search: String) {
        Media(search: $search, type: ANIME) {
          id
          title {
            romaji
            english
            native
          }
          coverImage {
            large
          }
          description(asHtml: false)
          startDate {
            year
            month
            day
          }
          nextAiringEpisode {
            airingAt
            timeUntilAiring
            episode
          }
        }
      }
    `,
    variables: { search: query },
  };

  const res = await axios.post<AnilistResponse>('https://graphql.anilist.co', gqlQuery, {
    headers: { 'Content-Type': 'application/json' },
  });

  return res.data.data.Media;
};

// Fetch all genres from AniList
export const fetchAnilistGenres = async (): Promise<string[]> => {
  const gqlQuery = {
    query: `
      query {
        GenreCollection
      }
    `,
    variables: {},
  };
  const res = await axios.post('https://graphql.anilist.co', gqlQuery, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data.data.GenreCollection;
};

// Fetch anime by genre (paginated)
export const fetchAnilistAnimeByGenre = async (genre: string, page = 1, perPage = 54): Promise<AnilistAnime[]> => {
  const gqlQuery = {
    query: `
      query ($genre: String, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(genre_in: [$genre], type: ANIME, sort: POPULARITY_DESC) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            description(asHtml: false)
            averageScore
            popularity
            episodes
            genres
          }
        }
      }
    `,
    variables: { genre, page, perPage },
  };
  const res = await axios.post('https://graphql.anilist.co', gqlQuery, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data.data.Page.media;
};