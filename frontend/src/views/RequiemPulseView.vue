<template>
	<div class="p-6 min-h-screen">
		<div class="requiem-pulse">
			<h1>Requiem Pulse</h1>
			<button
				class="spotify-login-btn bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
				@click="loginWithSpotify"
			>
				Login with Spotify
			</button>
			<div v-if="userData" class="rounded-lg">
				<div class="mt-4 py-2">
					<p class="text-lg">User Details</p>
				</div>
				<h2>{{ userData.display_name }} ({{ userData.product }})</h2>
				<p><strong>Email:</strong> {{ userData.email }}</p>
				<p><strong>Country:</strong> {{ userData.country }}</p>
				<p>
					<strong>Spotify Profile: </strong>
					<a :href="userData.external_urls.spotify" target="_blank">{{ userData.external_urls.spotify }}</a>
				</p>
				<p><strong>Followers:</strong> {{ userData.followers.total }}</p>
			</div>
			<div class="mt-6">
				<div class="flex space-x-4 border-b border-gray-300 dark:border-gray-700 mb-4">
					<button
						:class="activeTab === 'tracks' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 dark:text-gray-300'"
						class="pb-2 font-semibold transition-colors"
						@click="activeTab = 'tracks'"
					>
						Top Tracks
					</button>
					<button
						:class="activeTab === 'artists' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600 dark:text-gray-300'"
						class="pb-2 font-semibold transition-colors"
						@click="activeTab = 'artists'"
					>
						Top Artists
					</button>
				</div>

				<div v-show="activeTab === 'tracks'">
					<div v-if="userTopTracks && userTopTracks.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						<div 
						v-for="track in userTopTracks" 
						:key="track.id" 
						class="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
						>
							<img 
								:src="track.album.images[0]?.url || 'https://via.placeholder.com/300'" 
								:alt="track.name" 
								class="w-full h-48 object-cover"
							/>

							<div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<button
								@click="playTrack(track.uri)"
								:disabled="!deviceId"
								class="bg-green-600 hover:bg-green-700 text-white p-3 rounded">
								▶
								</button>
							</div>
							<div class="p-4">
								<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ track.name }}</h3>
								<p class="text-gray-600 dark:text-gray-300 mt-1">
									Artist: {{ track.artists[0]?.name }}
								</p>
								<p class="text-gray-500 dark:text-gray-400 text-sm mt-1">
									Album: {{ track.album.name }}
								</p>
								<a 
								:href="track.external_urls.spotify" 
								target="_blank"
								class="inline-block mt-3 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
								>
									Listen on Spotify
								</a>
							</div>
						</div>
					</div>
					<div v-else>
						<center>Please Login To Spotify First</center>
					</div>
				</div>

				<div v-show="activeTab === 'artists'">
					<div v-if="userTopArtist && userTopArtist.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						<div v-for="artist in userTopArtist" :key="artist.id" class="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group">
							<img
								:src="artist.images[0]?.url || 'https://via.placeholder.com/300'"
								:alt="artist.name"
								class="w-full h-48 object-cover"
							/>

							<div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
								<button class="opacity-0 group-hover:opacity-100 text-white bg-green-600 px-4 py-2 rounded-full hover:bg-green-700 transition">
								View
								</button>
							</div>

							<div class="p-4">
								<h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">{{ artist.name }}</h3>
								<p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Followers: {{ artist.followers.total }}</p>
								<p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Genres: {{ artist.genres.join(', ') }}</p>
								<a
								:href="artist.external_urls.spotify"
								target="_blank"
								class="inline-block mt-3 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
								>
								Open in Spotify
								</a>
							</div>
						</div>
					</div>
					<div v-else>
						<center>Please Login To Spotify First</center>
					</div>
				</div>
			</div>
			<!-- Sticky Bottom Player -->
			<div
			v-if="track"
			class="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-3 flex items-center space-x-4 shadow-md z-50"
			>
				<!-- Track Info -->
				<div class="flex items-center">
					<img :src="track?.album.images[0]?.url" alt="Album" class="w-12 h-12 object-cover rounded" />
					<div class="flex flex-col">
					<p class="font-medium text-sm truncate">{{ track?.name }}</p>
					<p class="text-xs text-gray-400 truncate">{{ track?.artists[0]?.name }}</p>
					</div>
				</div>

				<!-- Middle: Controls + Progress -->
				<div class="flex flex-col flex-1 items-center">
					<!-- Controls -->
					<div class="flex items-center space-x-4">
					<button @click="previous" class="text-lg text-gray-300 hover:text-green-500">⏮</button>
					<button v-if="isPaused" @click="play" class="text-lg text-gray-300 hover:text-green-500">▶</button>
					<button v-else @click="pause" class="text-lg text-gray-300 hover:text-green-500">⏸</button>
					<button @click="next" class="text-lg text-gray-300 hover:text-green-500">⏭</button>
					</div>

					<!-- Progress Bar with Duration -->
					<div class="flex items-center w-full space-x-2">
					<span class="text-xs text-gray-400 w-10 text-right">
						{{ Math.floor(position / 1000 / 60) }}:{{ Math.floor((position / 1000) % 60).toString().padStart(2, '0') }}
					</span>

					<div class="flex-1 h-1 bg-gray-700 rounded overflow-hidden relative">
						<div
						class="h-full bg-green-500 transition-all duration-150"
						:style="{ width: (position / duration * 100) + '%' }"
						></div>
					</div>

					<span class="text-xs text-gray-400 w-10 text-left">
						{{ Math.floor(duration / 1000 / 60) }}:{{ Math.floor((duration / 1000) % 60).toString().padStart(2, '0') }}
					</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted  } from 'vue';
import { loginWithSpotify } from '@/services/music/spotify'
import {
	fetchSpotifyUser,
	fetchUserTopTracks,
	fetchUserTopArtist
} from '@/services/music/spotify';
import { useSpotifyPlayer } from '@/composables/spotify/useSpotifyPlayer';

const userData = ref<any>(null);
const activeTab = ref<'tracks' | 'artists'>('tracks');
const userTopTracks = ref<any[]>([]);
const userTopArtist = ref<any[]>([]);
const {
	player,
	track,
	isPaused,
	position,
	duration,
	play,
	playTrack,
	pause,
	next,
	previous,
	deviceId,
} = useSpotifyPlayer();
let progressInterval: number | null = null;

const fetchUserData = async () => {
    try {
        userData.value = await fetchSpotifyUser();
        console.log('Spotify User Data:', userData.value);
    } catch (err) {
        console.error('Failed to fetch user data:', err);
    }
};

const fetchTopTracks = async () => {
	try {
        userTopTracks.value = (await fetchUserTopTracks()).items;
        console.log('Spotify User Data:', userTopTracks.value);
    } catch (err) {
        console.error('Failed to fetch user data:', err);
    }
}

const fetchTopArtist = async () => {
	try {
        userTopArtist.value = (await fetchUserTopArtist()).items;
        console.log('Spotify User Data:', userTopArtist.value);
    } catch (err) {
        console.error('Failed to fetch user data:', err);
    }
}

onMounted(() => {
    fetchUserData()
	fetchTopTracks()
	fetchTopArtist()

	progressInterval = window.setInterval(() => {
		if (!isPaused.value && duration.value > 0) {
			position.value = Math.min(position.value + 1000, duration.value);
		}
	}, 1000);
})

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval);
});

</script>