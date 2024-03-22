import { getUserAnimeList } from '$lib/server/mal_client';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { addAnimeListToCache, getAnimeListFromCache } from '$lib/server/anime_cache';

export const load: PageServerLoad = async ({ locals }) => {
	const sessionInfo = locals.session;
	if (!sessionInfo) {
		error(401, 'unauthorized');
	}

	let animeMap = getAnimeListFromCache(sessionInfo.name);
	if (!animeMap) {
		console.log('map not found in cache');
		animeMap = new Map((await getUserAnimeList(sessionInfo.access_token)).map((anime) => [anime.id, anime]));
		addAnimeListToCache(sessionInfo.name, animeMap);
	}
	return { animeMap: animeMap };
};
