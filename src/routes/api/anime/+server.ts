import { error, json, type RequestHandler } from '@sveltejs/kit';
import { addAnimeToList, getAnime, getUserAnimeList } from '$lib/server/mal_client';
import { addAnimeListToCache, getAnimeListFromCache } from '$lib/server/anime_cache';

export const GET: RequestHandler = async ({ locals }) => {
	const sessionInfo = locals.session;
	if (sessionInfo === undefined) {
		error(401, 'unauthorized');
	}
	let animeList = getAnimeListFromCache(sessionInfo.name);
	if (!animeList) {
		animeList = new Map((await getUserAnimeList(sessionInfo.access_token)).map((anime) => [anime.id, anime]));
		addAnimeListToCache(sessionInfo.name, animeList);
	}
	const response = { animeList };
	return json(response);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	const sessionInfo = locals.session;
	if (sessionInfo === undefined) {
		error(401, 'unauthorized');
	}

	const { id } = await request.json();
	const response = { message: 'not processed', status: false };
	if (typeof id === 'string') {
		await Promise.all(
			id
				.split(',')
				.map((id) => +id.trim())
				.map(async (animeId) => {
					const anime = await getAnime(animeId, sessionInfo.access_token);
					if (anime) {
						if (!anime.my_list_status) {
							response.message = 'adding ' + animeId + ' to list';
							await addAnimeToList(animeId, sessionInfo.access_token);
							response.status = true;
						} else {
							response.message = 'anime with ' + animeId + ' is already in list';
							response.status = false;
						}
					} else {
						response.message = 'anime with ' + animeId + ' does not exist';
						response.status = true;
					}
				})
		);
	}
	return json(response);
};
