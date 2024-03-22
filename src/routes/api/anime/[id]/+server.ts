import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getAnime, setAnimeEpisodesWatched, setAnimeStatus } from '$lib/server/mal_client';
import { updateAnimeInCache } from '$lib/server/anime_cache';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const animeId = params.id;
	if (animeId && locals.session?.access_token) {
		const { status, num_episodes_watched } = await request.json();

		let success = false;

		if (status) {
			console.log(`Updating status of ${animeId} to ${status}`);
			success = await setAnimeStatus(+animeId, status, locals.session.access_token);
		}
		if (num_episodes_watched) {
			console.log(`Updating number of watches episodes of ${animeId} to ${num_episodes_watched}`);
			success = await setAnimeEpisodesWatched(+animeId, num_episodes_watched, locals.session.access_token);
		}
		if (success) {
			const updatedAnime = await getAnime(+animeId, locals.session.access_token);
			if (updatedAnime) {
				updateAnimeInCache(locals.session.name, updatedAnime);
			}
			return json({ success: true, anime: updatedAnime });
		} else {
			return json({ success: false });
		}
	} else {
		error(500, 'parameter for anime id missing');
	}
};
