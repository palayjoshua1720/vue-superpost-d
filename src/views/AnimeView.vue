<template>
	<div class="p-4">
		<div class="flex gap-2 mb-4">
			<input v-model="search" class="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Search anime..." />
			<button @click="handleSearch" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">Search</button>
		</div>
		<span v-if="searchLoading" class="ml-2 text-blue-600 animate-pulse">Searching...</span>
		<div v-if="searchError" class="mt-2 text-red-600">{{ searchError }}</div>

	<div v-if="animeInfo" class="mt-4">
		<h2 class="text-xl font-bold">{{ animeInfo.title.romaji || animeInfo.title.english }}</h2>
		<img :src="animeInfo.coverImage.large" class="w-48 my-2" />
		<p v-html="animeInfo.description"></p>
	</div>

	<!-- Search Results Section -->
	<div v-if="searchResults.length" class="mt-6">
		<div class="flex items-center mb-2 gap-2">
			<h2 class="text-xl font-bold mb-2">Search Results</h2>
			<button
			v-if="search"
			@click="clearSearch"
			class="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1 hover:bg-red-100"
			aria-label="Clear search"
			style="line-height: 1;"
			>
			<span>{{ search }}</span>
			<span class="text-lg leading-none">&times;</span>
			</button>
		</div>
		<div class="flex flex-wrap gap-4">
			<div
			v-for="anime in searchResults"
			:key="anime.mal_id"
			class="w-56 border rounded-lg shadow bg-white hover:shadow-lg transition p-3 flex flex-col"
			>
			<img :src="anime.images.jpg.image_url" class="w-full h-48 object-cover rounded mb-2" />
			<div class="font-bold text-base mb-1 text-gray-700">{{ anime.title }}</div>
			<div class="text-xs text-gray-600 mb-1 line-clamp-2">{{ anime.synopsis }}</div>
			<div class="flex flex-wrap gap-2 text-xs mb-2">
				<span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded" v-for="g in anime.genres" :key="g.name">{{ g.name }}</span>
			</div>
			<div class="flex flex-wrap gap-2 text-xs mb-2">
				<span class="bg-green-100 text-green-800 px-2 py-0.5 rounded">Score: {{ anime.score ?? 'N/A' }}</span>
				<span class="bg-pink-100 text-pink-800 px-2 py-0.5 rounded">Popularity: {{ anime.popularity ?? 'N/A' }}</span>
				<span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Episodes: {{ anime.episodes ?? 'N/A' }}</span>
			</div>
			<div class="flex gap-2 mt-auto">
				<button
					@click="showEpisodesAndSeasons(anime)"
					class="mt-2 bg-green-600 text-white px-2 py-1 text-xs rounded flex-1"
				>
					Episodes
				</button>
				<button
					@click="findStreamingLinks(anime)"
					class="mt-2 bg-purple-600 text-white px-2 py-1 text-xs rounded flex-1"
				>
					Watch
				</button>
			</div>
			</div>
		</div>
	</div>

	<!-- New AniList Top Anime by Genre -->
	<div v-if="anilistGenres.length" class="mt-8 mb-8">
		<h2 class="text-2xl font-bold mb-4">Genre</h2>
		<!-- Genre Tabs -->
		<div class="flex flex-wrap gap-2 mb-6">
			<button
			v-for="genre in anilistGenres"
			:key="genre"
			@click="selectedGenre = genre"
			:class="[
				'px-4 py-2 rounded-t font-semibold focus:outline-none transition',
				selectedGenre === genre
				? 'bg-blue-600 text-white shadow'
				: 'bg-gray-200 text-gray-700 hover:bg-blue-100'
			]"
			>
			{{ genre }}
			</button>
		</div>

		<!-- Anime Cards for Selected Genre or Search Results -->
		<div v-if="selectedGenre" class="mb-8">
			<div v-if="genreAnimeLoading" class="text-blue-600 mb-2">Loading anime...</div>
			<div v-else>
			<h2 class="text-2xl font-bold mb-4">Popular Anime</h2>
			<div class="flex flex-wrap gap-4">
				<div
				v-for="anime in anilistAnimeByGenre[selectedGenre] || []"
				:key="anime.id"
				class="w-56 border rounded-lg shadow bg-white hover:shadow-lg transition p-3"
				>
				<img :src="anime.coverImage.large" class="w-full h-48 object-cover rounded mb-2" />
				<div class="font-bold text-base mb-1 text-gray-700">{{ anime.title.romaji || anime.title.english }}</div>
				<div class="text-xs text-gray-600 mb-1 line-clamp-2" v-html="anime.description"></div>
				<div class="flex flex-wrap gap-2 text-xs mb-2">
					<span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded" v-for="g in anime.genres" :key="g">{{ g }}</span>
				</div>
				<div class="flex flex-wrap gap-2 text-xs mb-2">
					<span class="bg-green-100 text-green-800 px-2 py-0.5 rounded">Score: {{ anime.averageScore ?? 'N/A' }}</span>
					<span class="bg-pink-100 text-pink-800 px-2 py-0.5 rounded">Popularity: {{ anime.popularity ?? 'N/A' }}</span>
					<span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Episodes: {{ anime.episodes ?? 'N/A' }}</span>
				</div>
				<button
					@click="findStreamingLinksForAnilist(anime)"
					class="bg-purple-600 text-white px-2 py-1 text-xs rounded w-full mt-auto"
				>
					Find Streaming Links
				</button>
				</div>
			</div>
			<div v-if="(anilistAnimeByGenre[selectedGenre] || []).length === 0" class="text-gray-500">No anime found for this genre.</div>
			</div>
		</div>
	</div>

	<!-- AniList All Anime Section -->
	<div class="flex flex-wrap gap-4">
		<div
		v-for="anime in anilistAnimeList"
		:key="anime.id"
		class="w-56 border rounded-lg shadow bg-white hover:shadow-lg transition p-3 flex flex-col"
		>
		<img :src="anime.coverImage.large" class="w-full h-48 object-cover rounded mb-2" />
		<div class="font-bold text-base mb-1 text-gray-700">{{ anime.title.romaji || anime.title.english }}</div>
		<div class="text-xs text-gray-600 mb-1 line-clamp-2" v-html="anime.description"></div>
		<div class="flex flex-wrap gap-2 text-xs mb-2">
			<span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded" v-for="g in anime.genres" :key="g">{{ g }}</span>
		</div>
		<div class="flex flex-wrap gap-2 text-xs mb-2">
			<span class="bg-green-100 text-green-800 px-2 py-0.5 rounded">Score: {{ anime.averageScore ?? 'N/A' }}</span>
			<span class="bg-pink-100 text-pink-800 px-2 py-0.5 rounded">Popularity: {{ anime.popularity ?? 'N/A' }}</span>
			<span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Episodes: {{ anime.episodes ?? 'N/A' }}</span>
		</div>
		<button
			@click="findStreamingLinksForAnilist(anime)"
			class="bg-purple-600 text-white px-2 py-1 text-xs rounded w-full mt-auto"
		>
			Find Streaming Links
		</button>
		</div>
	</div>

	<!-- Streaming Links Modal -->
	<div v-if="showStreamingModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto relative">
			<button @click="showStreamingModal = false" class="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl">&times;</button>
			<div v-if="streamingAnime">
				<!-- Show anime info -->
				<div class="flex gap-6 mb-4">
					<img
						:src="streamingAnime.image || (streamingAnime.coverImage && streamingAnime.coverImage.large)"
						class="w-32 h-44 object-cover rounded"
						v-if="streamingAnime.image || (streamingAnime.coverImage && streamingAnime.coverImage.large)"
					/>
					<div>
						<h2 class="text-xl font-bold mb-2 text-gray-700">
						{{ streamingAnime.title?.romaji || streamingAnime.title?.english || streamingAnime.title || streamingAnime.name }}
						</h2>
						<p class="text-gray-600 mb-2" v-if="streamingAnime.description" v-html="streamingAnime.description"></p>
						<p class="text-gray-600 mb-2" v-else-if="streamingAnime.synopsis">{{ streamingAnime.synopsis }}</p>
					</div>
				</div>
				<div v-if="streamingLoading" class="text-blue-600 mb-4 text-center">Searching for streaming links...</div>
				<div v-else>
					<!-- If episodes are present, show them -->
					<div v-if="streamingAnime.episodes && streamingAnime.episodes.length">
						<h3 class="font-semibold text-lg mb-2">Episodes</h3>
						<ul class="max-h-80 overflow-y-auto">
							<li v-for="ep in streamingAnime.episodes" :key="ep.id" class="mb-2">
								<span class="font-semibold">Ep {{ ep.number }}: {{ ep.title || ep.id }}</span>
								<button
								class="ml-2 bg-purple-600 text-white px-2 py-1 text-xs rounded"
								@click="showEpisodeSources(ep.id)"
								>
								Show Streaming Links
								</button>
								<div v-if="episodeSources[ep.id]" class="mt-1 ml-4">
									<div v-for="src in episodeSources[ep.id]" :key="src.url" class="mb-1">
										<a :href="src.url" target="_blank" class="text-blue-600 underline">{{ src.quality || 'Stream' }}</a>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<!-- If not, show search results to pick a show -->
					<div v-else-if="streamingResults && streamingResults.length" class="space-y-4">
						<div v-for="result in streamingResults" :key="result.id" class="border rounded-lg p-4">
							<div class="flex items-start gap-4">
							<img :src="result.image" class="w-20 h-28 object-cover rounded" />
							<div class="flex-1">
								<h3 class="font-semibold text-lg">
								{{ result.title }}
								<span v-if="result.title && streamingAnime.title?.romaji && result.title !== streamingAnime.title.romaji">
									({{ streamingAnime.title.romaji }})
								</span>
								</h3>
								<p class="text-sm text-gray-600 mb-2">{{ result.releaseDate }}</p>
								<p class="text-sm text-gray-700 mb-3">{{ result.description }}</p>
								<button
								@click="getAnimeEpisodes(result.id)"
								class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
								>
								View Episodes
								</button>
							</div>
							</div>
						</div>
					</div>
					<div v-else class="text-gray-500 text-center py-8">
					No streaming links found for this anime. Try searching with a different title.
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal (unchanged) -->
	<div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
	<div class="bg-white rounded-lg p-6 max-w-lg w-full relative">
		<button @click="showModal = false" class="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl">&times;</button>
		<div v-if="selectedAnime">
		<h2 class="text-xl font-bold mb-2 text-gray-700">{{ selectedAnime.title }}</h2>
		<div v-if="loadingEpisodes" class="text-blue-600 mb-2">Loading episodes...</div>
		<div v-else>
			<div v-if="seasons.length">
			<div class="mb-2">
				<label class="block text-sm font-semibold mb-1">Select Season:</label>
				<select v-model="selectedSeasonId" @change="fetchSeasonEpisodes" class="border p-2 rounded w-full">
				<option :value="selectedAnime.mal_id">Main Series</option>
				<option v-for="season in seasons" :key="season.mal_id" :value="season.mal_id">
					{{ season.title }} ({{ season.type }})
				</option>
				</select>
			</div>
			</div>
			<div v-if="episodes.length">
			<div class="text-sm font-semibold mb-1 text-gray-500">Episodes:</div>
			<ul class="max-h-48 overflow-y-auto">
				<li v-for="ep in episodes" :key="ep.mal_id" class="mb-1 text-gray-700">
				<span>Ep {{ ep.mal_id }}: {{ ep.title }}</span>
				</li>
			</ul>
			</div>
			<div v-if="!episodes.length" class="text-gray-500">No episodes found for this season.</div>
		</div>
		</div>
	</div>
	</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import type { AnilistAnime, JikanAnime } from '../types/anime';
import { fetchAnilistGenres, fetchAnilistAnimeByGenre } from '../services/anime/anilistService';
import { showEpisodesAndSeasons, fetchSeasonEpisodes } from '../services/anime/jikanService';
import { searchAnime as searchStreamingAnime, getAnimeInfo as getStreamingAnimeInfo, getEpisodeSources } from '../services/anime/consumet';
import axios from 'axios';

export default defineComponent({
	setup() {
		const search = ref('');
		const searchLoading = ref(false);
		const searchError = ref('');
		const animeInfo = ref<AnilistAnime | null>(null);
		const topAnimeLoading = ref(true);
		const selectedAnime = ref<JikanAnime | null>(null);
		const episodes = ref<any[]>([]);
		const seasons = ref<any[]>([]);
		const loadingEpisodes = ref(false);
		const showModal = ref(false);
		const selectedSeasonId = ref<number | null>(null);
		const anilistAnimeList = ref<AnilistAnime[]>([]);
		const anilistAnimeLoading = ref(true);
		const searchResults = ref<JikanAnime[]>([]);
		const anilistGenres = ref<string[]>([]);
		const anilistAnimeByGenre = ref<Record<string, AnilistAnime[]>>({});
		const selectedGenre = ref<string | null>(null);
		const genreAnimeLoading = ref(false);
		const showStreamingModal = ref(false);
		const streamingAnime = ref<any>(null);
		const streamingResults = ref<any[]>([]);
		const streamingLoading = ref(false);
		const episodeSources = ref<Record<string, any[]>>({});

		// Show episodes and seasons for selected anime using Jikan API
		const handleShowEpisodesAndSeasons = async (anime: JikanAnime) => {
			selectedAnime.value = anime;
			episodes.value = [];
			seasons.value = [];
			loadingEpisodes.value = true;
			showModal.value = true;
			selectedSeasonId.value = anime.mal_id; // Default to main series

			const result = await showEpisodesAndSeasons(anime);
			episodes.value = result.episodes;
			seasons.value = result.seasons;
			loadingEpisodes.value = false;
		};

			// Fetch episodes for the selected season
		const handleFetchSeasonEpisodes = async () => {
			if (!selectedSeasonId.value) return;
			loadingEpisodes.value = true;
			episodes.value = await fetchSeasonEpisodes(selectedSeasonId.value);
			loadingEpisodes.value = false;
		};

		const handleSearch = async () => {
			if (!search.value.trim()) return;
			searchLoading.value = true;
			searchError.value = '';
			animeInfo.value = null;
			searchResults.value = [];
			try {
				// Jikan search endpoint for anime list
				const res = await axios.get(`https://api.jikan.moe/v4/anime`, {
					params: { q: search.value, limit: 24 }
				});
				searchResults.value = res.data.data || [];
				if (searchResults.value.length === 0) {
				searchError.value = 'No anime found matching your search. Try a different keyword!';
				}
			} catch (e: any) {
				searchResults.value = [];
				searchError.value = 'Oops! Something went wrong while searching. Please try again in a moment.';
			} finally {
				searchLoading.value = false;
			}
		};

		// Fetch top animes and AniList anime on mount
		onMounted(async () => {
			topAnimeLoading.value = true;
			anilistAnimeLoading.value = true;
			anilistGenres.value = await fetchAnilistGenres();
			if (anilistGenres.value.length) {
				selectedGenre.value = anilistGenres.value[0];
				await loadAnimeForGenre(selectedGenre.value);
			}
		});

		// Load anime for a genre (fetches all pages, up to 500 anime)
		// const loadAnimeForGenre = async (genre: string) => {
		//   genreAnimeLoading.value = true;
		//   let page = 1;
		//   let allAnime: AnilistAnime[] = [];
		//   let hasMore = true;
		//   while (hasMore && page <= 10) { // up to 500 anime (10 pages x 50)
		//     const anime = await fetchAnilistAnimeByGenre(genre, page, 54);
		//     allAnime = allAnime.concat(anime);
		//     hasMore = anime.length === 50;
		//     page++;
		//   }
		//   anilistAnimeByGenre.value[genre] = allAnime;
		//   genreAnimeLoading.value = false;
		// };

		const loadAnimeForGenre = async (genre: string) => {
			genreAnimeLoading.value = true;
			const anime = await fetchAnilistAnimeByGenre(genre, 1, 54); // Only fetch the first page (50 anime)
			anilistAnimeByGenre.value[genre] = anime;
			genreAnimeLoading.value = false;
		};

		// Watch for genre change and set default selected genre
		watch(selectedGenre, async (genre) => {
			if (genre && !anilistAnimeByGenre.value[genre]) {
				await loadAnimeForGenre(genre);
			}
		});

		const clearSearch = () => {
			search.value = '';
			searchResults.value = [];
			searchError.value = '';
			animeInfo.value = null;
		};

		const findStreamingLinks = async (anime: JikanAnime) => {
			streamingLoading.value = true;
			showStreamingModal.value = true;
			streamingAnime.value = anime;
			streamingResults.value = [];
			try {
				const results = await searchStreamingAnime(anime.title);
				streamingResults.value = results;
			} catch (e) {
				streamingResults.value = [];
			}
			streamingLoading.value = false;
		};

		const findStreamingLinksForAnilist = async (anime: AnilistAnime) => {
			streamingLoading.value = true;
			showStreamingModal.value = true;
			streamingAnime.value = anime;
			streamingResults.value = [];
			try {
				// Try searching by romaji, then english, then native
				let results = await searchStreamingAnime(anime.title.romaji);
				if (!results.length && anime.title.english) {
				results = await searchStreamingAnime(anime.title.english);
				}
				if (!results.length && anime.title.native) {
				results = await searchStreamingAnime(anime.title.native);
				}
				streamingResults.value = results;
			} catch (e) {
				streamingResults.value = [];
			}
			streamingLoading.value = false;
		};

		// Get episodes for a streaming anime
		const getAnimeEpisodes = async (animeId: string) => {
			streamingLoading.value = true;
			try {
				const info = await getStreamingAnimeInfo(animeId);
				streamingAnime.value = info;
			} catch (e) {
				// handle error
			}
			streamingLoading.value = false;
		};

		const showEpisodeSources = async (episodeId: string) => {
			if (episodeSources.value[episodeId]) return;
			episodeSources.value[episodeId] = [];
			try {
				const sources = await getEpisodeSources(episodeId);
				episodeSources.value[episodeId] = sources;
			} catch (e) {
				episodeSources.value[episodeId] = [];
			}
		};

		return {
			search,
			searchLoading,
			searchError,
			animeInfo,
			searchResults,
			handleSearch,
			showEpisodesAndSeasons: handleShowEpisodesAndSeasons,
			selectedAnime,
			episodes,
			seasons,
			loadingEpisodes,
			showModal,
			selectedSeasonId,
			fetchSeasonEpisodes: handleFetchSeasonEpisodes,
			selectedGenre,
			anilistAnimeList,
			anilistAnimeLoading,
			anilistGenres,
			anilistAnimeByGenre,
			genreAnimeLoading,
			loadAnimeForGenre,
			clearSearch,
			showStreamingModal,
			streamingAnime,
			streamingResults,
			streamingLoading,
			findStreamingLinks,
			findStreamingLinksForAnilist,
			getAnimeEpisodes,
			episodeSources,
			showEpisodeSources,
		};
	},
});
</script>