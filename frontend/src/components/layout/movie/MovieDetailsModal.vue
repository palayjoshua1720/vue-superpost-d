<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
        <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
                @click="$emit('close')" 
                class="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl z-10"
            >
                &times;
            </button>
            <div v-if="movie && movieDetails" class="p-6">
                <!-- Movie Header -->
                <div class="flex flex-col md:flex-row gap-6 mb-6">
                    <img 
                        :src="movie.poster_path ? getImageUrl(movie.poster_path, 'w500') : '/src/assets/sample-logo.png'"
                        :alt="movie.title"
                        class="w-48 h-72 object-cover rounded-lg flex-shrink-0"
                    />
                    <div class="flex-1">
                        <h1 class="text-3xl font-bold mb-2 text-gray-600">{{ movie.title }}</h1>
                        <p v-if="movieDetails.tagline" class="text-gray-600 italic mb-3">{{ movieDetails.tagline }}</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span 
                                v-for="genre in movieDetails.genres" 
                                :key="genre.id"
                                class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                            >
                                {{ genre.name }}
                            </span>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <span class="text-gray-600 text-sm font-semibold">Rating</span>
                                <div class="text-gray-600">{{ movie.vote_average.toFixed(1) }}/10</div>
                            </div>
                            <div>
                                <span class="text-gray-600 text-sm font-semibold">Runtime</span>
                                <div class="text-gray-600">{{ formatRuntime(movieDetails.runtime) }}</div>
                            </div>
                            <div>
                                <span class="text-gray-600 text-sm font-semibold">Release Date</span>
                                <div class="text-gray-600">{{ formatDate(movie.release_date) }}</div>
                            </div>
                            <div>
                                <span class="text-gray-600 text-sm font-semibold">Status</span>
                                <div class="text-gray-600">{{ movieDetails.status }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Overview -->
                <div class="mb-6">
                    <h2 class="text-xl font-bold mb-3 text-gray-600">Overview</h2>
                    <p class="text-gray-700 leading-relaxed">{{ movie.overview }}</p>
                </div>

                <!-- Production Companies -->
                <div v-if="movieDetails.production_companies?.length" class="mb-6">
                    <h2 class="text-xl font-bold mb-3 text-gray-600">Production Companies</h2>
                    <div class="flex flex-wrap gap-3">
                        <div
                            v-for="company in movieDetails.production_companies"
                            :key="company.id"
                            class="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded"
                        >
                            <img
                                v-if="company.logo_path"
                                :src="getImageUrl(company.logo_path, 'w92')"
                                :alt="company.name"
                                class="h-6"
                            />
                            <span class="text-gray-700">{{ company.name }}</span>
                            <span class="text-xs text-gray-500">({{ company.origin_country }})</span>
                        </div>
                    </div>
                </div>

                <!-- Cast -->
                <div v-if="movieDetails.credits?.cast" class="mb-6">
                    <h2 class="text-xl font-bold mb-3 text-gray-600">Cast</h2>
                    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div 
                        v-for="person in movieDetails.credits.cast.slice(0, 12)" 
                        :key="person.id"
                        class="text-center"
                        >
                        <img 
                            :src="person.profile_path ? getImageUrl(person.profile_path, 'w185') : '/src/assets/sample-logo.png'"
                            :alt="person.name"
                            class="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                        />
                        <p class="text-sm font-semibold text-gray-600">{{ person.name }}</p>
                        <p class="text-xs text-gray-600">{{ person.character }}</p>
                        </div>
                    </div>
                </div>

                <!-- Videos -->
                <div v-if="movieDetails.videos?.results" class="mb-6">
                    <h2 class="text-xl font-bold mb-3 text-gray-600">Videos</h2>
                    <div v-if="movieDetails.videos.results.length === 0" class="text-gray-500 italic mb-4 text-center">
                        No videos available.
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div 
                        v-for="video in movieDetails.videos.results.slice(0, 4)" 
                        :key="video.id"
                        class="aspect-video"
                        >
                            <iframe
                                :src="`https://www.youtube.com/embed/${video.key}`"
                                class="w-full h-full rounded-lg"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getImageUrl } from '../../../services/movie/tmdbService'
import type { TMDBMovie, TMDBMovieDetails } from '../../../types/movie'

    interface Props {
        movie: TMDBMovie
        movieDetails: TMDBMovieDetails
    }

    const props = defineProps<Props>()

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A'
        const d = new Date(dateStr)
        return d.toLocaleDateString()
    }

    const formatRuntime = (runtime: number) => {
        if (!runtime) return 'N/A'
        const hours = Math.floor(runtime / 60)
        const minutes = runtime % 60
        return `${hours}h ${minutes}m`
    }

    const handleImageError = (event: Event) => {
        (event.target as HTMLImageElement).src = '/src/assets/sample-logo.png'
    }
</script>