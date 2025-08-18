// types/music.ts

export interface SpotifyImage {
    url: string;
    height: number | null;
    width: number | null;
}

export interface SpotifyUser {
    id: string;
    display_name: string;
    href: string;
    external_urls: {
        spotify: string;
    };
    images?: SpotifyImage[]; // Profile pictures
}

export interface SpotifyTrack {
    id: string;
    name: string;
    duration_ms: number;
    album: {
        id: string;
        name: string;
        images: SpotifyImage[];
        release_date: string;
    };
    artists: {
        id: string;
        name: string;
        external_urls: { spotify: string };
    }[];
    preview_url: string | null; // short MP3 preview
    external_urls: { spotify: string };
    popularity: number; // 0–100
}

export interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string;
    images: SpotifyImage[];
    owner: SpotifyUser;
    tracks: {
        items: {
            track: SpotifyTrack;
        }[];
        total: number;
    };
    external_urls: { spotify: string };
}
