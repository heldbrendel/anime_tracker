import NodeCache from 'node-cache';
import type { Anime } from '$lib/anime';

const animeCache = new NodeCache({
	stdTTL: 300 // seconds
});

export function addAnimeListToCache(username: string, animeMap: Map<number, Anime>) {
	animeCache.set<Map<number, Anime>>(username, animeMap);
}

export function updateAnimeInCache(username: string, anime: Anime) {
	const animeMap = animeCache.get<Map<number, Anime>>(username);
	if (animeMap) {
		animeMap.set(anime.id, anime);
		animeCache.set<Map<number, Anime>>(username, animeMap);
	}
}

export function getAnimeListFromCache(username: string) {
	return animeCache.get<Map<number, Anime>>(username);
}
