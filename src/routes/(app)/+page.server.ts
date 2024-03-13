import { getUserAnimeList } from '$lib/server/mal_client';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.auth === undefined) {
		error(401, 'unauthorized');
	}
	// TODO retrieve from api and use cache
	return { animes: (await getUserAnimeList(locals.auth.access_token)).sort((a, b) => b.id - a.id) };
};
