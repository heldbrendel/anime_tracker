import { json, type RequestHandler } from '@sveltejs/kit';


export const PATCH: RequestHandler = async ({ params, request }) => {
	const animeId = params.id;
	const { status, num_episodes_watched } = await request.json();
	if (status) {
		console.log(`Updating status of ${animeId} to ${status}`);
	}
	if (num_episodes_watched) {
		console.log(`Updating number of watches episodes of ${animeId} to ${num_episodes_watched}`);
	}
	// TODO update status or number of episodes
	return json({ status: 'success' });
};
