import axios from 'axios';
import type { MangaDexManga, MangaDexChapter, MangaDexGenre } from '../../types/manga';

// MangaDex API base
const API = 'https://api.mangadex.org';
const CORS_PROXY = 'https://corsproxy.io/?';

// Helper function to build complete URL with query parameters
function buildUrl(endpoint: string, params?: any): string {
    const url = new URL(`${API}${endpoint}`);
    if (params) {
        Object.keys(params).forEach(key => {
            if (Array.isArray(params[key])) {
                params[key].forEach((value: any) => {
                    url.searchParams.append(`${key}[]`, value);
                });
            } else if (typeof params[key] === 'object') {
                Object.keys(params[key]).forEach(subKey => {
                    url.searchParams.append(`${key}[${subKey}]`, params[key][subKey]);
                });
            } else {
                url.searchParams.append(key, params[key]);
            }
        });
    }
    return `${CORS_PROXY}${encodeURIComponent(url.toString())}`;
}

export async function fetchPopularManga(limit = 54): Promise<MangaDexManga[]> {
    const url = buildUrl('/manga', {
        limit,
        order: { followedCount: 'desc' },
        includes: ['cover_art'],
        availableTranslatedLanguage: ['en'],
    });
    const res = await axios.get(url);
    return res.data.data.map(mapMangaDexManga);
}

export async function fetchMangaGenres(): Promise<string[]> {
    const url = buildUrl('/manga/tag');
    const res = await axios.get(url);
    return res.data.data.map((tag: any) => tag.attributes.name.en);
}

export async function searchManga(query: string, limit = 24): Promise<MangaDexManga[]> {
    const url = buildUrl('/manga', {
        title: query,
        limit,
        includes: ['cover_art'],
        availableTranslatedLanguage: ['en'],
    });
    const res = await axios.get(url);
    return res.data.data.map(mapMangaDexManga);
}

export async function fetchMangaByGenre(genre: string, limit = 54): Promise<MangaDexManga[]> {
    // Find tag id for genre
    const tagsUrl = buildUrl('/manga/tag');
    const tagsRes = await axios.get(tagsUrl);
    const tag = tagsRes.data.data.find((t: any) => t.attributes.name.en === genre);
    if (!tag) return [];
    
    const url = buildUrl('/manga', {
        limit,
        includes: ['cover_art'],
        availableTranslatedLanguage: ['en'],
        includedTags: [tag.id],
    });
    const res = await axios.get(url);
    return res.data.data.map(mapMangaDexManga);
}

export async function fetchMangaDetails(mangaId: string): Promise<MangaDexManga> {
    const url = buildUrl(`/manga/${mangaId}`, {
        includes: ['cover_art']
    });
    const res = await axios.get(url);
    return mapMangaDexManga(res.data.data);
}

export async function fetchMangaChapters(mangaId: string, limit = 500): Promise<MangaDexChapter[]> {
    let chapters: MangaDexChapter[] = [];
    let offset = 0;
    let hasMore = true;
    while (hasMore && chapters.length < limit) {
        const url = buildUrl(`/manga/${mangaId}/feed`, {
            limit: 100,
            offset,
            translatedLanguage: ['en'],
            order: { chapter: 'asc' },
        });
        const res = await axios.get(url);
        chapters = chapters.concat(res.data.data.map(mapMangaDexChapter));
        offset += 100;
        hasMore = res.data.data.length === 100;
    }
    return chapters;
}

export async function fetchChapterPages(chapterId: string): Promise<string[]> {
    const url = buildUrl(`/at-home/server/${chapterId}`);
    const res = await axios.get(url);
    const { baseUrl, chapter } = res.data;
    // chapter.data is an array of filenames, chapter.hash is the hash
    return chapter.data.map((filename: string) => `${baseUrl}/data/${chapter.hash}/${filename}`);
}

// --- Helpers ---
function mapMangaDexManga(m: any): MangaDexManga {
    const coverFile = m.relationships?.find((r: any) => r.type === 'cover_art')?.attributes?.fileName;
    const authors = m.relationships
        ?.filter((r: any) => r.type === 'author')
        .map((a: any) => a.attributes?.name)
        .filter(Boolean);
    return {
        id: m.id,
        title: m.attributes.title,
        description: m.attributes.description,
        coverUrl: coverFile
            ? `/api/proxy?url=https://uploads.mangadex.org/covers/${m.id}/${coverFile}.256.jpg`
            : '',
        tags: m.attributes.tags,
        year: m.attributes.year,
        status: m.attributes.status,
        lastChapter: m.attributes.lastChapter,
        lastVolume: m.attributes.lastVolume,
        rating: m.attributes.rating?.bayesian ?? null,
        popularity: m.attributes.followedCount ?? null,
        authors,
    };
}

function mapMangaDexChapter(c: any): MangaDexChapter {
    return {
        id: c.id,
        title: c.attributes.title,
        chapter: c.attributes.chapter,
        volume: c.attributes.volume,
        pages: c.attributes.pages,
        readableAt: c.attributes.readableAt,
        language: c.attributes.translatedLanguage,
    };
}