import { getUserInfo, getUserAnimeList } from '$lib/server/mal_client';
import { type Actions, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getAuthInfo } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {

	const authInfo = getAuthInfo(cookies)

	if (authInfo) {
		console.log(await getUserInfo(authInfo.access_token));
		const animeList = await getUserAnimeList(authInfo.access_token);
		if (animeList) {
			return { animes: animeList };
		} else {
			return { animes: [] };
		}
	} else {
		error(500, 'unexpected auth state');
	}
};

export const actions = {
	add: async (event) => {
		const data = await event.request.formData();
		const malId = data.get('mal_id');
		if (typeof malId === 'string') {
			console.log(malId);
		}
	}
} satisfies Actions;
