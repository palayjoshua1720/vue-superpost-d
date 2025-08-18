import { ref, onMounted } from 'vue';
import { getAccessTokenFromUrl } from '../../api/spotify/auth';

export const useSpotifyPlayer = () => {
	const player = ref<Spotify.Player | null>(null);
	const deviceId = ref<string | null>(null);
	const isPaused = ref(true);
	const position = ref(0);
	const duration = ref(0);
	const track = ref<any>(null);

	const initPlayer = (token: string) => {
	// if ((window as any).onSpotifyWebPlaybackSDKReady) return;

	(window as any).onSpotifyWebPlaybackSDKReady = () => {
		const _player = new Spotify.Player({
		name: 'Requiem Pulse Web Player',
		getOAuthToken: cb => cb(token),
		volume: 0.5,
		});

		_player.addListener('ready', ({ device_id }) => {
			console.log('Spotify Player Ready with Device ID:', device_id);
			deviceId.value = device_id;

			// Play pending track if any
			if (pendingTrackUri.value) {
				playTrack(pendingTrackUri.value);
			}
		});

		_player.addListener('not_ready', ({ device_id }) => {
		console.log('Device ID went offline', device_id);
		});

		_player.addListener('player_state_changed', state => {
			if (!state) return;

			track.value = state.track_window.current_track;
			isPaused.value = state.paused;
			position.value = state.position;
			duration.value = state.duration;
		});

		_player.addListener('initialization_error', ({ message }) => console.error(message));
		_player.addListener('authentication_error', ({ message }) => console.error(message));
		_player.addListener('account_error', ({ message }) => console.error(message));
		_player.addListener('playback_error', ({ message }) => console.error(message));

		_player.connect();
		player.value = _player;
	};

	// Load the SDK if not already in index.html
	if (!(window as any).Spotify) {
		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.async = true;
		document.body.appendChild(script);
	}
};

	const play = async () => {
		const accessToken = getAccessTokenFromUrl();
		if (!deviceId.value || !accessToken) return;

		try {
			await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId.value}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					uris: track.value ? [track.value.uri] : [],
				}),
			});
		} catch (err) {
			console.error('Error resuming track:', err);
		}
	};

	const pendingTrackUri = ref<string | null>(null);
	const playTrack = async (trackUri: string) => {
		const accessToken = getAccessTokenFromUrl();
		if (!trackUri) return;

		if (!deviceId.value) {
			console.log('Player not ready, queuing track...');
			pendingTrackUri.value = trackUri;
			return;
		}

		try {
			await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId.value}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ uris: [trackUri] }),
			});
			console.log('Playing:', trackUri);
			pendingTrackUri.value = null;
		} catch (err) {
			console.error('Error playing track:', err);
		}
	};

	const pause = async () => {
		if (!deviceId.value || !accessToken.value) return;
		await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId.value}`, {
			method: 'PUT',
			headers: { Authorization: `Bearer ${accessToken.value}` },
		});
	};

	const next = async () => {
		const accessToken = getAccessTokenFromUrl();
		if (!deviceId.value) return;
		await fetch(`https://api.spotify.com/v1/me/player/next?device_id=${deviceId.value}`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${accessToken}` },
		});
	};

	const previous = async () => {
		const accessToken = getAccessTokenFromUrl();
		if (!deviceId.value) return;
		await fetch(`https://api.spotify.com/v1/me/player/previous?device_id=${deviceId.value}`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${accessToken}` },
		});
	};

	const accessToken = ref<string | null>(null);
	onMounted(() => {
		accessToken.value = getAccessTokenFromUrl();
		if (accessToken.value) initPlayer(accessToken.value);
	});

	return {
		player,
		deviceId,
		track,
		isPaused,
		position,
		duration,
		initPlayer,
		play,
		playTrack,
		pause,
		next,
		previous,
	};
};
