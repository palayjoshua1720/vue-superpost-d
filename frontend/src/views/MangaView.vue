<template>
    <div class="p-4">
        <!-- Search Bar -->
        <div class="flex gap-2 mb-4">
            <input v-model="search" class="flex-1 p-3 border rounded-lg" placeholder="Search manga..." />
            <button @click="handleSearch" class="bg-blue-600 text-white px-6 py-3 rounded-lg">
                <span v-if="searchLoading">Searching...</span>
                <span v-else>Search</span>
            </button>
        </div>
        <div v-if="searchError" class="text-red-600">{{ searchError }}</div>

        <!-- Genre Tabs -->
        <div v-if="genres.length" class="flex flex-wrap gap-2 mb-6">
            <button
                v-for="genre in genres"
                :key="genre"
                @click="selectedGenre = genre"
                :class="['px-4 py-2 rounded-t font-semibold', selectedGenre === genre ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700']"
            >
                {{ genre }}
            </button>
        </div>

        <!-- Manga Cards -->
        <div class="flex flex-wrap gap-4">
        <div
                v-for="manga in displayManga"
                :key="manga.id"
                class="w-56 border rounded-lg shadow bg-white p-3 flex flex-col"
            >
                <img :src="manga.coverUrl" class="w-full h-48 object-cover rounded mb-2" />
                <div class="font-bold text-base mb-1 text-gray-700">{{ manga.title.en }}</div>
                <div class="text-xs text-gray-600 mb-1 line-clamp-2" v-html="manga.description.en"></div>
                <div class="flex flex-wrap gap-2 text-xs mb-2">
                    <span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded" v-for="tag in manga.tags" :key="tag.id">{{ tag.attributes.name.en }}</span>
                </div>
                <div class="flex flex-wrap gap-2 text-xs mb-2">
                    <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded">Popularity: {{ manga.popularity ?? 'N/A' }}</span>
                    <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Year: {{ manga.year ?? 'N/A' }}</span>
                </div>
                <button @click="openMangaModal(manga)" class="bg-purple-600 text-white px-2 py-1 text-xs rounded w-full mt-auto">
                Details & Chapters
                </button>
            </div>
        </div>

        <!-- Manga Modal -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full relative overflow-y-auto flex flex-col">
                <button @click="showModal = false" class="absolute top-3 right-2 text-gray-600 text-2xl">&times;</button>
                <div class="flex-1 flex flex-col gap-6">
                    <div v-if="modalManga">
                        <div class="flex gap-6 mb-4">
                            <img :src="modalManga.coverUrl" class="w-32 h-44 object-cover rounded" />
                            <div>
                                <h2 class="text-xl font-bold mb-2 text-gray-700">{{ modalManga.title.en }}</h2>
                                <p class="text-gray-600 mb-2" v-html="modalManga.description.en"></p>
                                <div class="flex flex-wrap gap-2 text-xs mb-2">
                                    <span class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded" v-for="tag in modalManga.tags" :key="tag.id">{{ tag.attributes.name.en }}</span>
                                </div>
                                <div class="flex flex-wrap gap-2 text-xs mb-2">
                                    <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded">Popularity: {{ modalManga.popularity ?? 'N/A' }}</span>
                                    <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Year: {{ modalManga.year ?? 'N/A' }}</span>
                                </div>
                                <button @click="openChaptersModal" class="bg-purple-600 text-white px-3 py-1 text-xs rounded mt-2">View Chapters</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chapters Modal -->
        <div v-if="showChaptersModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full relative max-h-[80vh] overflow-y-auto flex flex-col">
                <button @click="closeChaptersModal" class="absolute top-3 right-2 text-gray-600 text-2xl">&times;</button>
                <div class="pt-2 pb-4 flex-1 flex flex-col">
                    <h3 class="font-semibold text-lg mb-4 text-gray-700">Chapters</h3>
                    <ul class="flex-1 overflow-y-auto divide-y divide-gray-200">
                        <li v-for="ch in chapters" :key="ch.id" class="py-2 flex items-center justify-between text-gray-700">
                            <span class="font-semibold">Ch {{ ch.chapter }}: {{ ch.title }}</span>
                            <button class="ml-4 bg-purple-600 text-white px-3 py-1 text-xs rounded" @click="openChapterModal(ch)">
                                Read
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Chapter Modal -->
        <div v-if="showChapterModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full relative max-h-[90vh] flex flex-col">
                <button @click="showChapterModal = false" class="absolute top-3 right-2 text-gray-600 text-2xl">&times;</button>
                <div v-if="selectedChapter">
                    <h2 class="text-xl font-bold mb-4 text-gray-700">Chapter {{ selectedChapter.chapter }}: {{ selectedChapter.title }}</h2>
                    
                    <!-- Navigation Buttons -->
                    <div class="flex justify-between mb-4">
                        <button
                            class="btn btn-info px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                            :disabled="selectedChapterIndex === 0"
                            @click="goToPreviousChapter"
                        >
                            <template v-if="selectedChapterIndex > 0">
                                Back (Ch {{ chapters[selectedChapterIndex - 1]?.chapter }})
                            </template>
                            <template v-else>
                                Back
                            </template>
                        </button>
                        <button
                            class="btn btn-primary px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                            :disabled="selectedChapterIndex === chapters.length - 1"
                            @click="goToNextChapter"
                        >
                            <template v-if="selectedChapterIndex < chapters.length - 1">
                                Next Chapter (Ch {{ chapters[selectedChapterIndex + 1]?.chapter }})
                            </template>
                            <template v-else>
                                Next Chapter
                            </template>
                        </button>
                    </div>
                    
                    <div v-if="chapterLoading" class="text-center text-blue-600">Loading pages...</div>
                    <div v-else>
                        <div v-if="chapterPages.length">
                            <div class="overflow-y-auto" style="max-height: 70vh; scrollbar-width: none; -ms-overflow-style: none;">
                                <div v-for="(img, idx) in chapterPages" :key="idx" class="mb-4">
                                    <img :src="img" class="w-full" />
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-gray-500 text-center">No pages found for this chapter.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue';
import {
    fetchPopularManga,
    fetchMangaGenres,
    searchManga,
    fetchMangaByGenre,
    fetchMangaDetails,
    fetchMangaChapters,
} from '../services/manga/mangadex';
import type { MangaDexManga, MangaDexChapter } from '../types/manga';
import { fetchChapterPages } from '../services/manga/mangadex';

const search = ref('');
const searchLoading = ref(false);
const searchError = ref('');
const genres = ref<string[]>([]);
const selectedGenre = ref<string | null>(null);
const mangaByGenre = ref<Record<string, MangaDexManga[]>>({});
const searchResults = ref<MangaDexManga[]>([]);
const showModal = ref(false);
const modalManga = ref<MangaDexManga | null>(null);
const chapters = ref<MangaDexChapter[]>([]);
const showChapterModal = ref(false);
const selectedChapter = ref<MangaDexChapter | null>(null);
const chapterPages = ref<string[]>([]);
const chapterLoading = ref(false);
const popularManga = ref<MangaDexManga[]>([]);
const popularLoading = ref(true);
const showChaptersModal = ref(false);
const selectedChapterIndex = computed(() =>
    chapters.value.findIndex(chap => chap.id === selectedChapter.value?.id)
);

const displayManga = computed(() => {
    if (search.value && searchResults.value.length) return searchResults.value;
    if (selectedGenre.value && mangaByGenre.value[selectedGenre.value]) return mangaByGenre.value[selectedGenre.value];
    return [];
});


const handleSearch = async () => {
    if (!search.value.trim()) return;
    searchLoading.value = true;
    searchError.value = '';
    try {
        searchResults.value = await searchManga(search.value);
        if (!searchResults.value.length) searchError.value = 'No manga found.';
    } catch {
        searchError.value = 'Error searching manga.';
    } finally {
        searchLoading.value = false;
    }
};

const loadMangaForGenre = async (genre: string) => {
    mangaByGenre.value[genre] = await fetchMangaByGenre(genre);
};

const openMangaModal = async (manga: MangaDexManga) => {
    modalManga.value = await fetchMangaDetails(manga.id);
    chapters.value = await fetchMangaChapters(manga.id);
    showModal.value = true;
};

const openChaptersModal = () => {
    showChaptersModal.value = true;
};

const closeChaptersModal = () => {
    showChaptersModal.value = false;
};

const openChapterModal = async (chapter: MangaDexChapter) => {
    selectedChapter.value = chapter;
    showChapterModal.value = true;
    chapterLoading.value = true;
    chapterPages.value = [];
    try {
        chapterPages.value = await fetchChapterPages(chapter.id);
    } finally {
        chapterLoading.value = false;
    }
};

onMounted(async () => {
    genres.value = await fetchMangaGenres();
    if (genres.value.length) {
        selectedGenre.value = genres.value[0];
        await loadMangaForGenre(selectedGenre.value);
    }
    // Fetch and sort popular manga
    popularLoading.value = true;
    let popular = await fetchPopularManga();
    // Sort by rating (desc), fallback to popularity (desc)
    popular.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.popularity ?? 0) - (a.popularity ?? 0));
    popularManga.value = popular;
    popularLoading.value = false;
});

function goToPreviousChapter() {
    if (selectedChapterIndex.value > 0) {
        openChapterModal(chapters.value[selectedChapterIndex.value - 1]);
    }
}

function goToNextChapter() {
    if (selectedChapterIndex.value < chapters.value.length - 1) {
        openChapterModal(chapters.value[selectedChapterIndex.value + 1]);
    }
}

watch(selectedGenre, async (genre) => {
    if (genre && !mangaByGenre.value[genre]) {
        await loadMangaForGenre(genre);
    }
});
</script>