import { getUserAnimeList } from '$lib/server/mal_client';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { addAnimeListToCache, getAnimeListFromCache } from '$lib/server/anime_cache';

export const load: PageServerLoad = async ({ locals }) => {
	const sessionInfo = locals.session;
	if (!sessionInfo) {
		error(401, 'unauthorized');
	}

	let animeList = getAnimeListFromCache(sessionInfo.name);
	if (!animeList) {
		animeList = (await getUserAnimeList(sessionInfo.access_token)).sort((a, b) => b.id - a.id);
		addAnimeListToCache(sessionInfo.name, animeList);
	}
	return { animes: animeList };
};
