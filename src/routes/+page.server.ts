import type { Actions, PageServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async ({ fetch, cookies }) => {

	const authToken = cookies.get('oauth_token');
	if (authToken !== null) {
		fetch('https://api.myanimelist.net/v2/users/@me', {
			headers: {
				'Authorization': 'Bearer '
			}
		});
	}

	const response = await prisma.anime.findMany();
	return { animes: response };
};

export const actions = {
	add: async (event) => {
		const data = await event.request.formData();
		const malId = data.get('mal_id');
		if (typeof malId === 'string') {
			console.log(malId);

			const existingEntry = await prisma.anime.findUnique({
				where: {
					mal_id: +malId
				}
			});
			if (existingEntry == null) {
				const settings = await prisma.settings.findFirst();
				if (settings != null && settings.mal_api_key.length > 0) {
					const url = `https://api.myanimelist.net/v2/anime/${malId}?fields=id,title,mean,alternative_titles,start_season,num_episodes`;
					const res = await event.fetch(url, {
						headers: {
							'X-MAL-CLIENT-ID': settings.mal_api_key
						},
						method: 'GET'
					});
					const malData = await res.json();
					await prisma.anime.create({
						data: {
							mal_id: malData['id'],
							title: malData['title'],
							alternate_title: malData['alternative_titles']['en'],
							score: malData['mean'],
							status: ''
						}
					});
				}
			}
		}
	}
} satisfies Actions;
