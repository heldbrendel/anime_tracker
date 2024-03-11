import { error, json, type RequestHandler } from '@sveltejs/kit';
import { addAnimeToList, getAnime } from '$lib/server/mal_client';


export const POST: RequestHandler = async ({ locals, request }) => {
	const authInfo = locals.auth;
	if (authInfo === undefined) {
		error(401, 'unauthorized');
	}

	const { id } = await request.json();
	const response = { message: 'not processed', status: false };
	if (typeof id === 'string') {
		await Promise.all(id.split(',').map(id => +id.trim()).map(async (animeId) => {
				const anime = await getAnime(animeId, authInfo.access_token);
				if (anime) {
					if (!anime.my_list_status) {
						response.message = 'adding ' + animeId + ' to list';
						await addAnimeToList(animeId, authInfo.access_token);
						response.status = true;
					} else {
						response.message = 'anime with ' + animeId + ' is already in list';
						response.status = false;
					}
				} else {
					response.message = 'anime with ' + animeId + ' does not exist';
					response.status = true;
				}
			}
		));
	}
	return json(response);
};
