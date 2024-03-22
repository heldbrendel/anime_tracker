import { error, json, type RequestHandler } from '@sveltejs/kit';
import { searchAnime } from '$lib/server/mal_client';

export const GET: RequestHandler = async ({ locals, url }) => {
	const query = url.searchParams.get('query');
	if (query !== null && locals.session?.access_token) {
		const searchResults = await searchAnime(query, locals.session?.access_token);
		return json({ results: searchResults });
	} else {
		error(500, 'query missing');
	}
};
