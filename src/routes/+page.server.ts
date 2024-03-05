import type { Actions, PageServerLoad } from './$types';
import { getUserInfo, getUserAnimeList } from '$lib/server/mal_client';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {

	const auth_token_cookie = cookies.get('oauth_token');
	if (auth_token_cookie !== undefined) {
		const auth_token = JSON.parse(auth_token_cookie) as AuthInfo;
		console.log(await getUserInfo(auth_token.access_token));
		const animeList = await getUserAnimeList(auth_token.access_token);
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
