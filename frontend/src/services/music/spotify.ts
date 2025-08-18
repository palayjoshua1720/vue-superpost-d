import axios from 'axios';
import { getAccessTokenFromUrl } from '../../api/spotify/auth';

export const loginWithSpotify = () => {
    const clientId = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.VUE_APP_SPOTIFY_REDIRECT_URI;
    const scopes = [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'streaming',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
    ].join(' ');
    
    const state = (<any>crypto).randomUUID();

    localStorage.setItem('spotify_auth_state', state);

    const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}` +
    `&scope=${encodeURIComponent(scopes)}`;

    window.location.href = authUrl;
};

export const fetchSpotifyUser = async (): Promise<any> => {
    const accessToken = getAccessTokenFromUrl();

    if (!accessToken) {
        throw new Error('No Spotify access token found in URL');
    }

    const { data } = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return data;
};

export const fetchUserTopTracks = async (): Promise<any> => {
    const accessToken = getAccessTokenFromUrl();

    if (!accessToken) {
        throw new Error('No Spotify access token found in URL');
    }

    const { data } = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            limit: 12,
            time_range: 'medium_term',
        },
    });

    return data;
}

export const fetchUserTopArtist = async (): Promise<any> => {
    const accessToken = getAccessTokenFromUrl();

    if (!accessToken) {
        throw new Error('No Spotify access token found in URL');
    }

    const { data } = await axios.get('https://api.spotify.com/v1/me/top/artists', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            limit: 12,
            time_range: 'medium_term',
        },
    });

    return data;
}