<template>
    <div class="p-4">
        <!-- Search Section -->
        <div class="mb-6">
            <div class="flex gap-2 mb-4">
                <input 
                v-model="search" 
                @keyup.enter="handleSearch"
                class="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Search movies..." 
                />
                <button 
                @click="handleSearch" 
                class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                Search
                </button>
            </div>
            <div v-if="searchLoading" class="flex items-center justify-center py-4">
                <!-- <div class="animate-spin rounded-full h-24 w-24 border-b-2 border-primary dark:border-primary-dark"></div> -->
                <div class="flex justify-center min-h-screen bg-gray-900">
                    <svg
                        class="h-24 w-24 stroke-white animate-bolt-trail"
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
            <div v-if="searchError" class="mt-2 text-red-600">{{ searchError }}</div>
        </div>

        <!-- Genre Tabs -->
        <div v-if="genres.length" class="mb-8 mt-8">
            <h2 class="text-2xl font-bold mb-4">Genre</h2>
            <div class="flex flex-wrap gap-2 mb-4">
                <button
                    v-for="genre in genres"
                    :key="genre.id"
                    @click="selectGenre(genre)"
                    :class="[
                        'px-4 py-2 rounded-t font-semibold focus:outline-none transition',
                        selectedGenre && selectedGenre.id === genre.id
                            ? 'bg-blue-600 text-white shadow'
                            : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                    ]"
                >
                    {{ genre.name }}
                </button>
                <button
                    v-if="selectedGenre"
                    @click="clearGenre"
                    class="px-3 py-1 rounded-full font-semibold bg-gray-100 text-gray-700 hover:bg-red-100 ml-2 flex items-center gap-1"
                    aria-label="Clear genre"
                >
                    <span>Clear Genre</span>
                    <span class="text-lg leading-none">&times;</span>
                </button>
            </div>
        </div>

        <!-- Movies by Genre Section -->
        <div v-if="selectedGenre">
            <h2 class="text-2xl font-bold mb-4">{{ selectedGenre.name }} Movies</h2>
            <div v-if="genreMoviesLoading" class="flex items-center justify-center py-4">
                <!-- <div class="animate-spin rounded-full h-24 w-24 border-b-2 border-primary dark:border-primary-dark"></div> -->
                <div class="flex justify-center min-h-screen bg-gray-900">
                    <svg
                        class="h-24 w-24 stroke-white animate-bolt-trail"
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
            <div v-else>
                <div v-if="genreMovies.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <MovieCard
                        v-for="movie in genreMovies"
                        :key="movie.id"
                        :movie="movie"
                        @click="showMovieDetails(movie)"
                    />
                </div>
                <div v-else class="text-gray-500">No movies found for this genre.</div>
            </div>
        </div>

        <!-- Search Results Section -->
        <div v-if="searchResults.length && !selectedGenre" class="mb-8">
            <div class="flex items-center mb-4 gap-2">
                <h2 class="text-2xl font-bold">Search Results</h2>
                <button
                v-if="search"
                @click="clearSearch"
                class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-red-100 transition-colors"
                >
                    <span>{{ search }}</span>
                    <span class="text-lg leading-none">&times;</span>
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <MovieCard
                v-for="movie in searchResults"
                :key="movie.id"
                :movie="movie"
                @click="showMovieDetails(movie)"
                />
            </div>
        </div>

        <!-- Popular Movies Section -->
        <div v-if="popularMovies">
            <div v-if="getLoading" class="flex items-center justify-center py-4">
                <!-- <div class="animate-spin rounded-full h-24 w-24 border-b-2 border-primary dark:border-primary-dark"></div> -->
                <div class="flex justify-center min-h-screen bg-gray-900">
                    <svg
                        class="h-24 w-24 stroke-white animate-bolt-trail"
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
            <div v-if="popularMovies.length && !selectedGenre && !searchResults.length" class="mb-8">
                <h2 class="text-2xl font-bold mb-4">Popular Movies</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <MovieCard
                    v-for="movie in popularMovies.slice(0, 50)"
                    :key="movie.id"
                    :movie="movie"
                    @click="showMovieDetails(movie)"
                    />
                </div>
            </div>
        </div>

        <!-- Movie Details Modal -->
        <MovieDetailsModal
        v-if="showModal && selectedMovie && selectedMovieDetails"
        :movie="selectedMovie"
        :movieDetails="selectedMovieDetails"
        @close="showModal = false"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { searchMovies, getPopularMovies, getMovieDetails, getGenres, getMoviesByGenre } from '../services/movie/tmdbService'
import type { TMDBMovie, TMDBMovieDetails, TMDBGenre } from '../types/movie'
import MovieDetailsModal from '../components/layout/movie/MovieDetailsModal.vue'
import MovieCard from '../components/layout/movie/MovieCard.vue'

const search = ref('')
const searchLoading = ref(false)
const getLoading = ref(false)
const searchError = ref('')
const searchResults = ref<TMDBMovie[]>([])
const popularMovies = ref<TMDBMovie[]>([])
const showModal = ref(false)
const selectedMovie = ref<TMDBMovie | null>(null)
const selectedMovieDetails = ref<TMDBMovieDetails | null>(null)

// Genre state
const genres = ref<TMDBGenre[]>([])
const selectedGenre = ref<TMDBGenre | null>(null)
const genreMovies = ref<TMDBMovie[]>([])
const genreMoviesLoading = ref(false)

const handleSearch = async () => {
    if (!search.value.trim()) return
    searchLoading.value = true
    searchError.value = ''
    searchResults.value = []
    try {
        const res = await searchMovies(search.value)
        searchResults.value = res.results
        if (searchResults.value.length === 0) {
        searchError.value = 'No movies found matching your search. Try a different keyword!'
        }
    } catch (e) {
        searchResults.value = []
        searchError.value = 'Oops! Something went wrong while searching. Please try again in a moment.'
    } finally {
        searchLoading.value = false
    }
}

const clearSearch = () => {
    search.value = ''
    searchResults.value = []
    searchError.value = ''
}

const selectGenre = async (genre: TMDBGenre) => {
    if (selectedGenre.value && selectedGenre.value.id === genre.id) return
    selectedGenre.value = genre
    genreMoviesLoading.value = true
    genreMovies.value = []
    try {
        const res = await getMoviesByGenre(genre.id)
        genreMovies.value = res.results
    } catch (e) {
        genreMovies.value = []
    } finally {
        genreMoviesLoading.value = false
    }
}

const clearGenre = () => {
    selectedGenre.value = null
    genreMovies.value = []
}

const showMovieDetails = async (movie: TMDBMovie) => {
    selectedMovie.value = movie
    showModal.value = true
    selectedMovieDetails.value = null
    try {
        selectedMovieDetails.value = await getMovieDetails(movie.id)
    } catch (e) {
        console.error('Error fetching movie details:', e)
        // You could show a toast notification here
    }
}

onMounted(async () => {
    try {
        const genreRes = await getGenres()
        genres.value = genreRes.genres
    } catch (e) {
        genres.value = []
    }
    try {
        getLoading.value = true
        const res1 = await getPopularMovies(1)
        const res2 = await getPopularMovies(2)
        const res3 = await getPopularMovies(3)
        popularMovies.value = [...res1.results, ...res2.results, ...res3.results].slice(0, 50)
        getLoading.value = false
    } catch (e) {
        console.error('Error fetching popular movies:', e)
        getLoading.value = false
        // You could show a toast notification here
    }
})
</script>

<style scoped>
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
</style>