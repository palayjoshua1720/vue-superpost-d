export interface MangaDexManga {
    id: string;
    title: { [lang: string]: string | undefined };
    description: { [lang: string]: string | undefined };
    coverUrl: string;
    tags: { id: string; attributes: { name: { en: string } } }[];
    year?: number;
    status?: string;
    lastChapter?: string;
    lastVolume?: string;
    rating?: number;
    popularity?: number;
    authors?: string[];
}

    export interface MangaDexChapter {
        id: string;
        title: string;
        chapter: string;
        volume: string;
        pages: number;
        readableAt: string;
        language: string;
    }

    export interface MangaDexGenre {
        id: string;
        name: string;
    }