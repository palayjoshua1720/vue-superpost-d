// types/anime.ts

export interface JikanAnime {
	mal_id: number;
	title: string;
	images: {
		jpg: { image_url: string };
		webp: { image_url: string };
	};
	synopsis: string;
	aired: {
		from: string;
		to: string | null;
	};
	genres: { name: string }[];
	score?: number;
	popularity?: number;
	episodes?: number;
}

export interface AnilistAnime {
	id: number;
	title: {
		romaji: string;
		english: string;
		native: string;
	};
	coverImage: {
		large: string;
	};
	description: string;
		startDate: {
		year: number;
		month: number;
		day: number;
	};
	nextAiringEpisode?: {
		airingAt: number;
		timeUntilAiring: number;
		episode: number;
	};
	averageScore?: number;
	popularity?: number;
	episodes?: number;
	genres?: string[];
}