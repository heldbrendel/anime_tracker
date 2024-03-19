import { getUserAnimeList } from '$lib/server/mal_client';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { addAnimeListToCache, getAnimeListFromCache } from '$lib/server/cache';

export const load: PageServerLoad = async ({ locals }) => {
	const authInfo = locals.auth;
	if (!authInfo) {
		error(401, 'unauthorized');
	}

	const userInfo = locals.user;
	if (!userInfo) {
		error(401, 'unauthorized');
	}

	let animeList = getAnimeListFromCache(userInfo.name);
	if (!animeList) {
		animeList = (await getUserAnimeList(authInfo.access_token)).sort((a, b) => b.id - a.id);
		addAnimeListToCache(userInfo.name, animeList);
	}
	return { animes: animeList };
};
