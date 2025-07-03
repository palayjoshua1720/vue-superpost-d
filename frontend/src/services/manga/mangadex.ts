import axios from 'axios';
import type { MangaDexManga, MangaDexChapter, MangaDexGenre } from '../../types/manga';

// MangaDex API base
const API = 'https://api.mangadex.org';

export async function fetchPopularManga(limit = 54): Promise<MangaDexManga[]> {
    const res = await axios.get(`${API}/manga`, {
        params: {
            limit,
            order: { followedCount: 'desc' },
            includes: ['cover_art'],
            availableTranslatedLanguage: ['en'],
        },
    });
    return res.data.data.map(mapMangaDexManga);
}

export async function fetchMangaGenres(): Promise<string[]> {
    const res = await axios.get(`${API}/manga/tag`);
    return res.data.data.map((tag: any) => tag.attributes.name.en);
}

export async function searchManga(query: string, limit = 24): Promise<MangaDexManga[]> {
    const res = await axios.get(`${API}/manga`, {
        params: {
            title: query,
            limit,
            includes: ['cover_art'],
            availableTranslatedLanguage: ['en'],
        },
    });
    return res.data.data.map(mapMangaDexManga);
}

export async function fetchMangaByGenre(genre: string, limit = 54): Promise<MangaDexManga[]> {
    // Find tag id for genre
    const tagsRes = await axios.get(`${API}/manga/tag`);
    const tag = tagsRes.data.data.find((t: any) => t.attributes.name.en === genre);
    if (!tag) return [];
    const res = await axios.get(`${API}/manga`, {
        params: {
            limit,
            includes: ['cover_art'],
            availableTranslatedLanguage: ['en'],
            includedTags: [tag.id],
        },
    });
    return res.data.data.map(mapMangaDexManga);
}

export async function fetchMangaDetails(mangaId: string): Promise<MangaDexManga> {
    const res = await axios.get(`${API}/manga/${mangaId}`, {
        params: { includes: ['cover_art'] },
    });
    return mapMangaDexManga(res.data.data);
}

export async function fetchMangaChapters(mangaId: string, limit = 500): Promise<MangaDexChapter[]> {
    let chapters: MangaDexChapter[] = [];
    let offset = 0;
    let hasMore = true;
    while (hasMore && chapters.length < limit) {
        const res = await axios.get(`${API}/manga/${mangaId}/feed`, {
            params: {
            limit: 100,
            offset,
            translatedLanguage: ['en'],
            order: { chapter: 'asc' },
            },
        });
        chapters = chapters.concat(res.data.data.map(mapMangaDexChapter));
        offset += 100;
        hasMore = res.data.data.length === 100;
    }
    return chapters;
}

export async function fetchChapterPages(chapterId: string): Promise<string[]> {
    const res = await axios.get(`https://api.mangadex.org/at-home/server/${chapterId}`);
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
        ? `https://uploads.mangadex.org/covers/${m.id}/${coverFile}.256.jpg`
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