// src/types/spotify.d.ts
interface Window {
	onSpotifyWebPlaybackSDKReady: () => void;
	Spotify: typeof Spotify;
}

declare namespace Spotify {
	class Player {
		constructor(options: {
			name: string;
			getOAuthToken: (cb: (token: string) => void) => void;
			volume?: number;
		});

		connect(): Promise<boolean>;
		disconnect(): void;
		addListener(event: string, callback: (...args: any[]) => void): void;
		removeListener(event: string, callback?: (...args: any[]) => void): void;
	}

	interface PlayerState {
			paused: boolean;
			position: number;
			duration: number;
			track_window: {
			current_track: any;
			previous_tracks: any[];
			next_tracks: any[];
		};
	}
}
