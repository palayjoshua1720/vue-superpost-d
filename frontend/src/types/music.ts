// types/music.ts

export interface AudiusUser {
    id: string;
    handle: string;
    name: string;
    profile_picture: string | null;
    cover_photo: string | null;
    is_verified: boolean;
}

export interface AudiusTrack {
    id: string;
    title: string;
    duration: number;
    genre: string;
    mood?: string;
    artwork: string | null;
    stream_url: string;
    user: AudiusUser;
    release_date?: string;
    play_count?: number;
    repost_count?: number;
    favorite_count?: number;
}

export interface AudiusPlaylist {
    id: string;
    title: string;
    artwork: string | null;
    user: AudiusUser;
    track_count: number;
    tracks: AudiusTrack[];
    description?: string;
} 