import { addAnimeToList, getAnime, getUserAnimeList } from '$lib/server/mal_client';
import { type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	return { animes: (await getUserAnimeList(locals.auth.access_token)).sort((a, b) => a.id - b.id) };
};

export const actions = {
	add: async ({ request, locals }) => {
		const data = await request.formData();
		const malId = data.get('mal_id');
		if (typeof malId === 'string') {
			await Promise.all(malId.split(',').map(id => +id.trim()).map(async (id) => {
					const anime = await getAnime(id, locals.auth.access_token);
					if (anime) {
						if (!anime.my_list_status) {
							console.log('adding ' + id + ' to list');
							await addAnimeToList(id, locals.auth.access_token);
						} else {
							console.log('anime with ' + id + ' is already in list');
							// already in list
						}
					} else {
						console.log('anime with ' + id + ' does not exist');
						// invalid id
					}
				}
			));
		}
	}
} satisfies Actions;
