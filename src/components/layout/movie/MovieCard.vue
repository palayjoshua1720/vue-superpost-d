<template>
    <div 
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        @click="$emit('click')"
    >
        <div class="relative">
            <img 
                :src="posterUrl" 
                :alt="movie.title"
                class="w-full h-64 object-cover"
                @error="handleImageError"
            />
            <div class="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-semibold">
                {{ movie.vote_average.toFixed(1) }}
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                <h3 class="text-white font-semibold text-sm line-clamp-2">{{ movie.title }}</h3>
                <p class="text-gray-300 text-xs">{{ formatDate(movie.release_date) }}</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TMDBMovie } from '../../../types/movie';
import { getImageUrl } from '../../../services/movie/tmdbService';

    interface Props {
        movie: TMDBMovie;
    }

    const props = defineProps<Props>();

    const posterUrl = computed(() => {
        return props.movie.poster_path
        ? getImageUrl(props.movie.poster_path, 'w500')
        : '/src/assets/sample-logo.png';
    });

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Unknown';
        return new Date(dateString).getFullYear();
    };

    const handleImageError = (event: Event) => {
        const target = event.target as HTMLImageElement;
        target.src = '/src/assets/sample-logo.png'; // Fallback image
    };
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>