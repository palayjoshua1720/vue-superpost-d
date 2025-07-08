import axios from 'axios';
import type { AudiusTrack, AudiusPlaylist, AudiusUser } from '../../types/music';

const AUDIUS_API = 'https://api.audius.co/v1';

// Fetch trending tracks
export const fetchTrendingTracks = async (genre?: string): Promise<AudiusTrack[]> => {
    const params: any = { limit: 20 };
    if (genre && genre !== 'All') params.genre = genre;
    const res = await axios.get(`${AUDIUS_API}/tracks/trending`, { params });
    return res.data.data as AudiusTrack[];
};

// Search tracks by query
export const searchTracks = async (query: string): Promise<AudiusTrack[]> => {
    const res = await axios.get(`${AUDIUS_API}/tracks/search`, {
    params: { query, limit: 20 },
    });
    return res.data.data as AudiusTrack[];
};

// Get track details by id
export const getTrackDetails = async (id: string): Promise<AudiusTrack> => {
    const res = await axios.get(`${AUDIUS_API}/tracks/${id}`);
    return res.data.data as AudiusTrack;
};

// Fetch trending playlists
export const fetchTrendingPlaylists = async (): Promise<AudiusPlaylist[]> => {
    const res = await axios.get(`${AUDIUS_API}/playlists/trending`, {
        params: { limit: 10 },
    });
    return res.data.data as AudiusPlaylist[];
}; 