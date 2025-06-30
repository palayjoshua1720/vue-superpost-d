// services/movie/tmdbService.ts
import axios from 'axios';
import type { 
    TMDBMovie,
    TMDBMovieDetails, 
    TMDBGenre, 
    TMDBSearchResponse,
    TMDBMovieCredits,
    TMDBMovieVideos 
} from '../../types/movie';

// You'll need to get an API key from https://www.themoviedb.org/settings/api
const TMDB_API_KEY = 'e66366794439b30234d8dcee4c38fe56';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Helper function to get full image URL
export const getImageUrl = (path: string, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') => {
    if (!path) return '';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

// Search movies
export const searchMovies = async (query: string, page = 1): Promise<TMDBSearchResponse> => {
    const res = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
            api_key: TMDB_API_KEY,
            query,
            page,
            include_adult: false,
            language: 'en-US'
        }
    });
    return res.data;
};

// Get popular movies
export const getPopularMovies = async (page = 1): Promise<TMDBSearchResponse> => {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
            api_key: TMDB_API_KEY,
            page,
            language: 'en-US'
        }
    });
    return res.data;
};

// Get top rated movies
export const getTopRatedMovies = async (page = 1): Promise<TMDBSearchResponse> => {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
        params: {
            api_key: TMDB_API_KEY,
            page,
            language: 'en-US'
        }
    });
    return res.data;
};

// Get now playing movies
export const getNowPlayingMovies = async (page = 1): Promise<TMDBSearchResponse> => {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
        params: {
            api_key: TMDB_API_KEY,
            page,
            language: 'en-US'
        }
    });
    return res.data;
};

// Get upcoming movies
export const getUpcomingMovies = async (page = 1): Promise<TMDBSearchResponse> => {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
        params: {
            api_key: TMDB_API_KEY,
            page,
            language: 'en-US'
        }
    });
    return res.data;
};

// Get movie details
export const getMovieDetails = async (movieId: number): Promise<TMDBMovieDetails> => {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: {
            api_key: TMDB_API_KEY,
            append_to_response: 'credits,videos,images',
            language: 'en-US'
        }
    });
    return res.data;
};

// Get movie credits
export const getMovieCredits = async (movieId: number): Promise<TMDBMovieCredits> => {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, {
        params: {
            api_key: TMDB_API_KEY,
            language: 'en-US'
        }
    });
    return res.data;
};

// Get movie videos
export const getMovieVideos = async (movieId: number): Promise<TMDBMovieVideos> => {
    const res = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
        params: {
            api_key: TMDB_API_KEY,
            language: 'en-US'
        }
    });
    return res.data;
};

// Get all genres
export const getGenres = async (): Promise<{ genres: TMDBGenre[] }> => {
    const res = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        params: {
            api_key: TMDB_API_KEY,
            language: 'en-US'
        }
    });
    return res.data;
};

// Get movies by genre
export const getMoviesByGenre = async (genreId: number, page = 1): Promise<TMDBSearchResponse> => {
    const res = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
            api_key: TMDB_API_KEY,
            with_genres: genreId,
            page,
            language: 'en-US',
            sort_by: 'popularity.desc'
        }
    });
    return res.data;
};