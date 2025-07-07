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
        <div v-if="searchLoading" class="flex items-center justify-center py-4">
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
        <div v-if="searchError" class="text-red-600">{{ searchError }}</div>

        <!-- Search Results Section -->
        <div v-if="search && searchResults.length" class="mt-6">
            <div class="flex items-center mb-2 gap-2">
                <h2 class="text-xl font-bold mb-2">Search Results</h2>
                <button
                    @click="clearSearch"
                    class="ml-2 bg-blue-600 text-white px-2 py-1 rounded-full flex items-center gap-1 hover:bg-blue-700"
                    aria-label="Clear search"
                    style="line-height: 1;"
                >
                    <span class="bg-blue-600 text-white px-4 py-2 rounded font-semibold">{{ search }}</span>
                    <span class="text-lg leading-none">&times;</span>
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div
                    v-for="manga in searchResults"
                    :key="manga.id"
                    class="w-full border rounded-lg shadow bg-white p-3 flex flex-col cursor-pointer transition-shadow transition-transform duration-200 hover:shadow-2xl hover:scale-105"
                    @click="openMangaModal(manga)"
                >
                    <img :src="manga.coverUrl" class="w-full h-48 object-cover rounded mb-2" style="max-width:100%;height:auto;" />
                    <div class="font-bold text-base mb-1 text-gray-700">{{ getMangaTitle(manga) }}</div>
                    <div class="text-xs text-gray-600 mb-1 line-clamp-2" v-html="manga.description.en"></div>
                    <div class="flex flex-wrap gap-2 text-xs mb-2">
                        <span
                            class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                            v-for="tag in manga.tags.slice(0, 3)"
                            :key="tag.id"
                        >
                            {{ tag.attributes.name.en }}
                        </span>
                        <button
                            v-if="manga.tags.length > 3"
                            class="bg-gray-200 text-gray-700 px-2 py-0.5 rounded cursor-pointer border border-gray-300 hover:bg-gray-300 transition text-xs"
                            @click="openMangaModal(manga)"
                            type="button"
                        >
                            +{{ manga.tags.length - 3 }} more
                        </button>
                    </div>
                    <div class="flex flex-wrap gap-2 text-xs mb-2">
                        <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded">Popularity: {{ manga.popularity ?? 'N/A' }}</span>
                        <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Year: {{ manga.year ?? 'N/A' }}</span>
                        <span class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Status: {{ getMangaStatus(manga) }}</span>
                    </div>
                    <button @click="openMangaModal(manga)" class="bg-purple-600 text-white px-2 py-1 text-xs rounded w-full mt-auto">
                        Details & Chapters
                    </button>
                </div>
            </div>
        </div>

        <!-- Genre Tabs -->
        <div v-if="!search && genres.length" class="mb-6">
            <h2 data-v-643acaaa="" class="text-2xl font-bold mb-4">Genre</h2>
            <div class="overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                <button
                    v-for="genre in genres"
                    :key="genre"
                    @click="selectedGenre = genre"
                    :class="[
                        'inline-block px-4 py-2 rounded-t font-semibold mr-2 mb-2 transition-colors',
                        selectedGenre === genre ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                    ]"
                    style="min-width: 100px;"
                >
                    {{ genre }}
                </button>
            </div>
        </div>

        <!-- Selected Genre Badge -->
        <div v-if="!search && selectedGenre" class="flex items-center mb-4 gap-2">
            <span class="bg-blue-600 text-white px-4 py-2 rounded font-semibold">Genre: {{ selectedGenre }}</span>
            <button
                @click="selectedGenre = null"
                class="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full flex items-center gap-1 hover:bg-red-100"
                aria-label="Clear genre"
                style="line-height: 1;"
            >
                <span class="text-lg leading-none">&times;</span>
            </button>
        </div>

        <!-- Popular Manga Section (default view) -->
        <div v-if="!search && !selectedGenre">
            <div v-if="popularLoading" class="flex justify-center py-4">
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
            <div v-else-if="popularManga.length">
                <h2 class="text-2xl font-bold mb-4">Popular Manga</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div
                        v-for="manga in popularManga"
                        :key="manga.id"
                        class="w-full border rounded-lg shadow bg-white p-3 flex flex-col cursor-pointer transition-shadow transition-transform duration-200 hover:shadow-2xl hover:scale-105"
                        @click="openMangaModal(manga)"
                    >
                        <img :src="manga.coverUrl" class="w-full h-48 object-cover rounded mb-2" style="max-width:100%;height:auto;" />
                        <div class="font-bold text-base mb-1 text-gray-700">{{ getMangaTitle(manga) }}</div>
                        <div class="text-xs text-gray-600 mb-1 line-clamp-2" v-html="manga.description.en"></div>
                        <div class="flex flex-wrap gap-2 text-xs mb-2">
                            <span
                                class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                                v-for="tag in manga.tags.slice(0, 3)"
                                :key="tag.id"
                            >
                                {{ tag.attributes.name.en }}
                            </span>
                            <button
                                v-if="manga.tags.length > 3"
                                class="bg-gray-200 text-gray-700 px-2 py-0.5 rounded cursor-pointer border border-gray-300 hover:bg-gray-300 transition text-xs"
                                @click.stop="openMangaModal(manga)"
                                type="button"
                            >
                                +{{ manga.tags.length - 3 }} more
                            </button>
                        </div>
                        <div class="flex flex-wrap gap-2 text-xs mb-2">
                            <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded">Popularity: {{ manga.popularity ?? 'N/A' }}</span>
                            <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Year: {{ manga.year ?? 'N/A' }}</span>
                            <span class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Status: {{ getMangaStatus(manga) }}</span>
                        </div>
                        <button @click.stop="openMangaModal(manga)" class="bg-purple-600 text-white px-2 py-1 text-xs rounded w-full mt-auto">
                            Details & Chapters
                        </button>
                    </div>
                </div>
                
                <!-- Pagination -->
                <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8 mb-4">
                    <button
                        @click="loadPopularMangaPage(Math.max(1, currentPage - 1))"
                        :disabled="currentPage === 1"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    >
                        Previous
                    </button>
                    
                    <div class="flex gap-1">
                        <button
                            v-for="page in visiblePages"
                            :key="page"
                            @click="loadPopularMangaPage(page)"
                            :class="[
                                'px-3 py-2 rounded-lg transition-colors',
                                currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            ]"
                        >
                            {{ page }}
                        </button>
                    </div>
                    
                    <button
                        @click="loadPopularMangaPage(Math.min(totalPages, currentPage + 1))"
                        :disabled="currentPage === totalPages"
                        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                    >
                        Next
                    </button>
                </div>
                
                <div class="text-center text-gray-600 text-sm mb-4">
                    Page {{ currentPage }} of {{ totalPages }} - Showing {{ popularManga.length }} manga
                </div>
            </div>
        </div>

        <!-- Manga Cards (by genre) -->
        <div v-if="!search && selectedGenre && displayManga.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
                v-for="manga in displayManga"
                :key="manga.id"
                class="w-full border rounded-lg shadow bg-white p-3 flex flex-col cursor-pointer transition-shadow transition-transform duration-200 hover:shadow-2xl hover:scale-105"
                @click="openMangaModal(manga)"
            >
                <img :src="manga.coverUrl" class="w-full h-48 object-cover rounded mb-2" style="max-width:100%;height:auto;" />
                <div class="font-bold text-base mb-1 text-gray-700">{{ getMangaTitle(manga) }}</div>
                <div class="text-xs text-gray-600 mb-1 line-clamp-2" v-html="manga.description.en"></div>
                <div class="flex flex-wrap gap-2 text-xs mb-2">
                    <span
                        class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                        v-for="tag in manga.tags.slice(0, 3)"
                        :key="tag.id"
                    >
                        {{ tag.attributes.name.en }}
                    </span>
                    <button
                        v-if="manga.tags.length > 3"
                        class="bg-gray-200 text-gray-700 px-2 py-0.5 rounded cursor-pointer border border-gray-300 hover:bg-gray-300 transition text-xs"
                        @click="openMangaModal(manga)"
                        type="button"
                    >
                        +{{ manga.tags.length - 3 }} more
                    </button>
                </div>
                <div class="flex flex-wrap gap-2 text-xs mb-2">
                    <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded">Popularity: {{ manga.popularity ?? 'N/A' }}</span>
                    <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Year: {{ manga.year ?? 'N/A' }}</span>
                    <span class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Status: {{ getMangaStatus(manga) }}</span>
                </div>
                <button @click="openMangaModal(manga)" class="bg-purple-600 text-white px-2 py-1 text-xs rounded w-full mt-auto">
                    Details & Chapters
                </button>
            </div>
        </div>

        <!-- Manga Modal -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div class="bg-white rounded-lg p-4 sm:p-6 max-w-full sm:max-w-2xl w-full relative overflow-y-auto flex flex-col max-h-[95vh]">
                <button @click="showModal = false" class="absolute top-3 right-2 text-gray-600 text-2xl">&times;</button>
                <div class="flex-1 flex flex-col gap-6">
                    <div v-if="modalManga">
                        <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
                            <img :src="modalManga.coverUrl" class="w-32 h-44 object-cover rounded mx-auto sm:mx-0" />
                            <div>
                                <h2 class="text-xl font-bold mb-2 text-gray-700">{{ getMangaTitle(modalManga) }}</h2>
                                <div class="mb-2 text-gray-600 text-sm">
                                    <template v-if="modalManga.authors && modalManga.authors.length">
                                        <span v-if="modalManga.authors.length === 1">Author:</span>
                                        <span v-else>Authors:</span>
                                        {{ modalManga.authors.join(', ') }}
                                    </template>
                                    <template v-else>
                                        Author: Unavailable
                                    </template>
                                </div>
                                <p class="text-gray-600 mb-2" v-html="modalManga.description.en"></p>
                                <div class="flex flex-wrap gap-2 text-xs mb-2">
                                    <span
                                        class="bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                                        v-for="tag in modalManga.tags"
                                        :key="tag.id"
                                    >
                                        {{ tag.attributes.name.en }}
                                    </span>
                                </div>
                                <div class="flex flex-wrap gap-2 text-xs mb-2">
                                    <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded">Popularity: {{ modalManga.popularity ?? 'N/A' }}</span>
                                    <span class="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Year: {{ modalManga.year ?? 'N/A' }}</span>
                                    <span class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded">Status: {{ getMangaStatus(modalManga) }}</span>
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
            <div class="bg-white rounded-lg p-4 sm:p-6 max-w-full sm:max-w-2xl w-full relative max-h-[90vh] overflow-y-auto flex flex-col">
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
            <div class="bg-white rounded-lg p-4 sm:p-6 max-w-full sm:max-w-2xl w-full relative max-h-[95vh] flex flex-col overflow-y-auto">
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
                                    <img :src="img" class="w-full max-h-[60vh] object-contain mx-auto" />
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
const currentPage = ref(1);
const itemsPerPage = ref(54); // Fetch 54 manga per page
const selectedChapterIndex = computed(() =>
    chapters.value.findIndex(chap => chap.id === selectedChapter.value?.id)
);

const displayManga = computed(() => {
    if (search.value && searchResults.value.length) return searchResults.value;
    if (selectedGenre.value && mangaByGenre.value[selectedGenre.value]) return mangaByGenre.value[selectedGenre.value];
    if (!selectedGenre.value && !search.value) return popularManga.value;
    return [];
});

// Pagination computed properties
const totalPages = ref(10); // We'll estimate total pages, can be updated based on API response

const visiblePages = computed(() => {
    const total = totalPages.value;
    const current = currentPage.value;
    const delta = 2; // Show 2 pages before and after current page
    
    let start = Math.max(1, current - delta);
    let end = Math.min(total, current + delta);
    
    // Adjust if we're near the beginning or end
    if (end - start < 4) {
        if (start === 1) {
            end = Math.min(total, start + 4);
        } else {
            start = Math.max(1, end - 4);
        }
    }
    
    const pages = [];
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
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

const clearSearch = () => {
    search.value = '';
    searchResults.value = [];
    searchError.value = '';
};

onMounted(async () => {
    genres.value = await fetchMangaGenres();
    // Do not select a genre by default
    // Fetch first page of popular manga
    await loadPopularMangaPage(1);
});

const loadPopularMangaPage = async (page: number) => {
    popularLoading.value = true;
    try {
        // Calculate offset for the page
        const offset = (page - 1) * itemsPerPage.value;
        // Fetch manga for the specific page
        let popular = await fetchPopularManga(itemsPerPage.value, offset);
        // Sort by rating (desc), fallback to popularity (desc)
        popular.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || (b.popularity ?? 0) - (a.popularity ?? 0));
        popularManga.value = popular;
        currentPage.value = page;
    } catch (error) {
        console.error('Error loading popular manga:', error);
    } finally {
        popularLoading.value = false;
    }
};

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

// Debounce utility
function debounce(fn: (...args: any[]) => void, delay: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

const debouncedSearch = debounce(() => {
    if (search.value.trim()) {
        handleSearch();
    } else {
        searchResults.value = [];
        searchError.value = '';
    }
}, 400);

watch(search, () => {
    debouncedSearch();
});

// Helper to get the best available manga title
const getMangaTitle = (manga: any) => {
    return (
        manga?.title?.en ||
        manga?.title?.['ja-ro'] ||
        manga?.title?.romaji ||
        manga?.title?.ja ||
        (manga?.title ? Object.values(manga.title)[0] : '') ||
        'No Title'
    );
};

// Helper to get manga status
const getMangaStatus = (manga: any) => {
    const status = manga?.status;
    if (!status) return 'Unknown';
    
    switch (status) {
        case 'ongoing':
            return 'Ongoing';
        case 'completed':
            return 'Completed';
        case 'hiatus':
            return 'Hiatus';
        case 'cancelled':
            return 'Cancelled';
        default:
            return status.charAt(0).toUpperCase() + status.slice(1);
    }
};
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