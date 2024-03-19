import NodeCache from 'node-cache';
import type { Anime } from '$lib/anime';

const myCache = new NodeCache({
	stdTTL: 300 // seconds
});

export function addAnimeListToCache(username: string, animeList: Anime[]) {
	myCache.set<Anime[]>(username, animeList);
}

export function getAnimeListFromCache(username: string) {
	return myCache.get<Anime[]>(username);
}
