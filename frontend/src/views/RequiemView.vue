<template>
	<div class="p-6 min-h-screen">
		<div v-if="loading" class="flex items-center justify-center py-4">
			<div class="flex justify-center min-h-screen">
				<svg
					class="h-24 w-24 stroke-white"
					viewBox="0 0 24 24"
					fill="none"
					stroke-width="1"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M13 2L3 14h7v8l10-12h-7z"
						class="bolt-path"
					/>
				</svg>
			</div>
		</div>
		<!-- Genre filter -->
		<div class="flex flex-wrap gap-2 mb-4 items-center">
			<label class="font-semibold">Genre:</label>
			<select v-model="selectedGenre" @change="handleGenreChange" class="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
				<option v-for="genre in genres" :key="genre" :value="genre">{{ genre }}</option>
			</select>
		</div>
		<!-- Search keyword chip -->
		<div v-if="search && searchResults.length" class="mb-4 flex items-center gap-2">
			<span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
				<span class="mr-2">Search: <span class="font-semibold">{{ search }}</span></span>
				<button @click="clearSearch" class="ml-1 text-green-700 hover:text-red-600 text-lg font-bold">&times;</button>
			</span>
		</div>
	
	<template v-else>
    <div class="flex gap-4 mb-8">
			<input v-model="search" @keyup.enter="handleSearch" class="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search music..." />
			<button @click="handleSearch" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">Search</button>
    </div>

    <div v-if="searchResults.length" class="mb-10">
      <h2 class="text-xl font-semibold mb-4">Search Results</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
			<div v-for="track in searchResults" :key="track.id" class="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition cursor-pointer relative group" @click="openTrackModal(track)">
				<img :src="getArtworkUrl(track.artwork)" class="w-28 h-28 object-cover rounded mb-2" />
				<button @click.stop="playTrack(track)" class="absolute top-2 right-2 bg-green-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v18l15-9-15-9z" /></svg>
				</button>
				<div class="font-bold text-sm text-gray-800 text-center w-full truncate">{{ track.title }}</div>
				<div class="text-xs text-gray-600 text-center w-full truncate">{{ track.user?.name || track.user?.handle }}</div>
        </div>
      </div>
    </div>

    <div v-else>
			<h2 class="text-xl font-semibold mb-4 ">Trending Tracks</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-10">
			<div v-for="track in trendingTracks" :key="track.id" class="bg-white rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition cursor-pointer relative group" @click="openTrackModal(track)">
				<img :src="getArtworkUrl(track.artwork)" class="w-28 h-28 object-cover rounded mb-2" />
				<button @click.stop="playTrack(track)" class="absolute top-2 right-2 bg-green-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v18l15-9-15-9z" /></svg>
				</button>
				<div class="font-bold text-sm text-gray-800 text-center w-full truncate">{{ track.title }}</div>
				<div class="text-xs text-gray-600 text-center w-full truncate">{{ track.user?.name || track.user?.handle }}</div>
        </div>
      </div>

			<h2 class="text-xl font-semibold mb-4 ">Trending Playlists</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			<div v-for="playlist in trendingPlaylists" :key="playlist.id" class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer" @click="openPlaylistModal(playlist)">
          <div class="flex items-center gap-4 mb-3">
				<img :src="getArtworkUrl(playlist.artwork)" class="w-16 h-16 object-cover rounded" />
				<div class="flex-1 min-w-0">
					<div class="font-bold text-lg text-gray-800 truncate">{{ playlist.title }}</div>
					<div class="text-xs text-gray-600 truncate">by {{ playlist.user?.name || playlist.user?.handle }}</div>
            </div>
          </div>
          <div class="text-sm text-gray-700 mb-2 line-clamp-2">{{ playlist.description }}</div>
          <div class="flex flex-wrap gap-2">
            <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs">{{ playlist.track_count }} tracks</span>
          </div>
        </div>
      </div>
    </div>

		<div v-if="currentTrack" class="fixed bottom-0 left-0 right-0 flex justify-center z-50">
			<div class="player-container relative w-full max-w-2xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl flex flex-col gap-2 px-6 py-4">
				<button @click="closePlayer" class="absolute top-3 right-3 text-gray-400 hover:text-gray-200 text-2xl z-20">&times;</button>
				<div class="flex items-center gap-4">
					<img :src="getArtworkUrl(currentTrack.artwork)" class="w-16 h-16 object-cover rounded-lg shadow" />
					<div class="flex-1 min-w-0">
						<div class="font-bold text-lg truncate">{{ currentTrack.title }}</div>
						<div class="text-xs text-gray-300 truncate">{{ currentTrack.user?.name || currentTrack.user?.handle }}</div>
					</div>
					<div class="flex items-center gap-2">
						<!-- Custom Play/Pause button -->
						<button @click="audioRef?.paused ? audioRef.play() : audioRef.pause()" class="focus:outline-none">
							<svg v-if="audioRef?.paused" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v18l15-9-15-9z" />
							</svg>
							<svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<rect x="6" y="4" width="4" height="16" rx="1"/>
								<rect x="14" y="4" width="4" height="16" rx="1"/>
							</svg>
						</button>
						<!-- Native audio for fallback and progress -->
						<audio ref="audioRef" :src="getStreamUrl(currentTrack)" controls @canplay="onAudioCanPlay" @timeupdate="onTimeUpdate" @loadedmetadata="onLoadedMetadata" @error="onAudioError" class="hidden"></audio>
					</div>
				</div>
				<!-- Progress bar with time indicators -->
				<div class="flex items-center gap-3 w-full">
					<span class="text-xs text-gray-300 w-10 text-right">{{ formatTime(currentTime) }}</span>
					<div class="flex-1 group">
						<input
							type="range"
							min="0"
							:max="duration"
							step="0.1"
							:value="currentTime"
							@input="seek"
							class="player-progress w-full h-1 bg-white rounded-lg appearance-none focus:outline-none"
						/>
					</div>
					<span class="text-xs text-gray-300 w-10 text-left">{{ formatTime(duration) }}</span>
				</div>
				<!-- Loader overlay -->
				<div v-if="playerLoading" class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-2xl z-10">
					<svg class="h-12 w-12 stroke-white" viewBox="0 0 24 24" fill="none" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
						<path d="M13 2L3 14h7v8l10-12h-7z" class="bolt-path" />
					</svg>
				</div>
			</div>
		</div>
		<div v-if="modalOpen && selectedTrack" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
			<div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative flex flex-col gap-4">
				<button @click="closeTrackModal" class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
				<div class="flex gap-6">
					<img :src="getArtworkUrl(selectedTrack.artwork)" class="w-32 h-32 object-cover rounded-lg shadow" />
					<div class="flex-1 min-w-0 flex flex-col gap-2">
						<div class="font-bold text-2xl text-gray-900 truncate">{{ selectedTrack.title }}</div>
						<div class="text-sm text-gray-600 truncate">{{ selectedTrack.user?.name || selectedTrack.user?.handle }}</div>
						<div class="text-xs text-gray-500">Genre: {{ selectedTrack.genre }}</div>
						<div class="text-xs text-gray-500">Duration: {{ formatTime(selectedTrack.duration) }}</div>
						<div class="flex gap-2 mt-2">
							<button @click="playTrack(selectedTrack); closeTrackModal()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v18l15-9-15-9z" /></svg>
								Play
							</button>
						</div>
					</div>
				</div>
				<div class="mt-4 text-gray-700 text-sm">
					<!-- Credits section -->
					<div class="mb-2">
						<span class="font-semibold">Credits:</span>
						<ul class="ml-4 mt-1">
							<li><span class="font-medium">Artist:</span> {{ selectedTrack.user?.name || selectedTrack.user?.handle }}</li>
							<li class="text-gray-500">No additional credits available.</li>
						</ul>
					</div>
					<span>No description available for this track.</span>
				</div>
			</div>
		</div>
		<!-- Playlist Modal -->
		<div v-if="playlistModalOpen && selectedPlaylist" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
			<div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative flex flex-col gap-4 max-h-[80vh]">
				<button @click="closePlaylistModal" class="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
				<div class="flex gap-6">
					<img :src="getArtworkUrl(selectedPlaylist.artwork)" class="w-32 h-32 object-cover rounded-lg shadow" />
					<div class="flex-1 min-w-0 flex flex-col gap-2">
						<div class="font-bold text-2xl text-gray-900 truncate">{{ selectedPlaylist.title }}</div>
						<div class="text-sm text-gray-600 truncate">by {{ selectedPlaylist.user?.name || selectedPlaylist.user?.handle }}</div>
						<div class="text-xs text-gray-500">Tracks: {{ selectedPlaylist.track_count }}</div>
						<div class="text-xs text-gray-500">Playlist ID: {{ selectedPlaylist.id }}</div>
					</div>
				</div>
				<div class="mt-4 text-gray-700 text-sm">
					<span v-if="selectedPlaylist.description">{{ selectedPlaylist.description }}</span>
					<span v-else>No description available for this playlist.</span>
				</div>
				<div class="mt-6 flex-1 min-h-0 flex flex-col">
					<div class="font-semibold mb-2 text-gray-800">Tracks in this playlist:</div>
					<div class="divide-y divide-gray-200 overflow-y-auto" style="max-height: 40vh;">
						<div v-for="track in selectedPlaylist.tracks" :key="track.id" class="flex items-center py-2 gap-2">
							<div class="flex-1 min-w-0">
								<div class="truncate font-medium text-gray-900">{{ track.title }}</div>
								<div class="text-xs text-gray-500 truncate">{{ track.user?.name || track.user?.handle }}</div>
							</div>
							<div class="text-xs text-gray-500 w-16 text-right">{{ formatTime(track.duration) }}</div>
							<button @click="playTrack(track)" class="ml-2 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors">
								<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v18l15-9-15-9z" /></svg>
							</button>
						</div>
					</div>
      </div>
    </div>
		</div>
	</template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { fetchTrendingTracks, searchTracks, fetchTrendingPlaylists } from '../services/music/audius';
import type { AudiusTrack, AudiusPlaylist } from '../types/music';

const trendingTracks = ref<AudiusTrack[]>([]);
const trendingPlaylists = ref<AudiusPlaylist[]>([]);
const search = ref('');
const searchResults = ref<AudiusTrack[]>([]);
const currentTrack = ref<AudiusTrack | null>(null);
const audioRef = ref<HTMLAudioElement | null>(null);
const loading = ref(false);
const playerLoading = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const modalOpen = ref(false);
const selectedTrack = ref<AudiusTrack | null>(null);
const playlistModalOpen = ref(false);
const selectedPlaylist = ref<AudiusPlaylist | null>(null);

const genres = [
  'All',
  'Electronic',
  'Hip-Hop',
  'Pop',
  'Rock',
  'Country',
  'Jazz',
  'Classical',
  'R&B',
  'Soul',
  'Reggae',
  'Dance',
  'House',
  'Techno',
  'Ambient',
  'Folk',
  'Metal',
  'Punk',
  'Blues',
  'World',
];
const selectedGenre = ref('All');

function getArtworkUrl(artwork: any): string {
	if (!artwork) return '/default-music.png';
	if (typeof artwork === 'string') return artwork;
	return artwork['1000x1000'] || artwork['480x480'] || artwork['150x150'] || '/default-music.png';
}

function getStreamUrl(track: any): string {
	return track?.id ? `https://api.audius.co/v1/tracks/${track.id}/stream` : '';
}

const loadTrending = async () => {
	loading.value = true;
	trendingTracks.value = await fetchTrendingTracks(selectedGenre.value);
  trendingPlaylists.value = await fetchTrendingPlaylists();
	loading.value = false;
};

const handleSearch = async () => {
  if (!search.value.trim()) return;
	loading.value = true;
  searchResults.value = await searchTracks(search.value.trim());
	loading.value = false;
};

function clearSearch() {
	search.value = '';
	searchResults.value = [];
	loadTrending();
}

async function handleGenreChange() {
	await loadTrending();
}

const playTrack = (track: AudiusTrack) => {
  currentTrack.value = track;
	playerLoading.value = true;
  setTimeout(() => {
		audioRef.value?.play().catch(() => {
			// ignore play error (autoplay policy, etc)
		});
  }, 100);
};

function openTrackModal(track: AudiusTrack) {
	selectedTrack.value = track;
	modalOpen.value = true;
}
function closeTrackModal() {
	modalOpen.value = false;
	selectedTrack.value = null;
}

function openPlaylistModal(playlist: AudiusPlaylist) {
  selectedPlaylist.value = playlist;
  playlistModalOpen.value = true;
}
function closePlaylistModal() {
  playlistModalOpen.value = false;
  selectedPlaylist.value = null;
}

function onAudioCanPlay() {
	playerLoading.value = false;
	duration.value = audioRef.value?.duration || 0;
}

function onTimeUpdate() {
	currentTime.value = audioRef.value?.currentTime || 0;
}

function onLoadedMetadata() {
	duration.value = audioRef.value?.duration || 0;
}

function seek(e: Event) {
	const input = e.target as HTMLInputElement;
	const seekTime = Number(input.value);
	if (audioRef.value) {
		audioRef.value.currentTime = seekTime;
		currentTime.value = seekTime;
	}
}

function formatTime(sec: number) {
	if (isNaN(sec)) return '0:00';
	const m = Math.floor(sec / 60);
	const s = Math.floor(sec % 60);
	return `${m}:${s.toString().padStart(2, '0')}`;
}

function closePlayer() {
	if (audioRef.value) audioRef.value.pause();
	currentTrack.value = null;
}
function onAudioError(e: Event) {
	// Optionally log or handle audio errors
}

// Dynamically update --progress CSS variable for the progress bar
watch([currentTime, duration], async () => {
	await nextTick();
	const input = document.querySelector('.player-progress') as HTMLInputElement;
	if (input && duration.value) {
		input.style.setProperty('--progress', `${(currentTime.value / duration.value) * 100}%`);
	}
});

onMounted(() => {
	loadTrending();
});
</script>

<style scoped>
.line-clamp-1 {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.line-clamp-2 {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}

.bolt-path {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: dashTrail 1.2s linear infinite;
}

@keyframes dashTrail {
    0% {
        stroke-dashoffset: 100;
    }
    100% {
        stroke-dashoffset: 0;
    }
}
.player-progress {
	outline: none;
	background: #000;
	height: 4px;
	border-radius: 9999px;
	transition: background 0.2s;
	--progress: 0%;
}
/* Chrome/Safari */
.player-progress::-webkit-slider-runnable-track {
	height: 4px;
	background: #000;
	border-radius: 9999px;
	position: relative;
}
.player-progress::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: #22c55e;
	cursor: pointer;
	box-shadow: 0 0 2px #0003;
	border: none;
	opacity: 0;
	transition: opacity 0.2s;
}
.player-container:hover .player-progress::-webkit-slider-thumb,
.player-container:focus-within .player-progress::-webkit-slider-thumb {
	opacity: 1;
}
/* White progress bar (filled) by default */
.player-progress::-webkit-slider-runnable-track {
	background: linear-gradient(to right, white 0%, white var(--progress), #000 var(--progress), #000 100%);
}
.player-container:hover .player-progress::-webkit-slider-runnable-track,
.player-container:focus-within .player-progress::-webkit-slider-runnable-track {
	background: linear-gradient(to right, #22c55e 0%, #22c55e var(--progress), #000 var(--progress), #000 100%);
}
/* Firefox */
.player-progress::-moz-range-thumb {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: #22c55e;
	cursor: pointer;
	border: none;
	opacity: 0;
	transition: opacity 0.2s;
}
.player-container:hover .player-progress::-moz-range-thumb,
.player-container:focus-within .player-progress::-moz-range-thumb {
	opacity: 1;
}
.player-progress::-moz-range-track {
	height: 4px;
	background: #000;
	border-radius: 9999px;
}
.player-progress::-moz-range-progress {
	height: 4px;
	background: white;
	border-radius: 9999px;
}
.player-container:hover .player-progress::-moz-range-progress,
.player-container:focus-within .player-progress::-moz-range-progress {
	background: #22c55e;
}
/* IE/Edge */
.player-progress::-ms-thumb {
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background: #22c55e;
	cursor: pointer;
	border: none;
	opacity: 0;
	transition: opacity 0.2s;
}
.player-container:hover .player-progress::-ms-thumb,
.player-container:focus-within .player-progress::-ms-thumb {
	opacity: 1;
}
.player-progress::-ms-fill-lower {
	background: white;
	border-radius: 9999px;
}
.player-container:hover .player-progress::-ms-fill-lower,
.player-container:focus-within .player-progress::-ms-fill-lower {
	background: #22c55e;
}
.player-progress::-ms-fill-upper {
	background: #000;
	border-radius: 9999px;
}
.player-container:hover .player-progress::-ms-fill-upper,
.player-container:focus-within .player-progress::-ms-fill-upper {
	background: #000;
}
</style> 