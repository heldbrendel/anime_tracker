import type { PageServerLoad, Actions } from './$types';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async () => {
	const response = await prisma.anime.findMany();
	return { animes: response };
};

export const actions = {
	add: async (event) => {
		const data = await event.request.formData();
		const malId = data.get('mal_id');
		console.log(malId)
		// TODO retrieve info and add to database
	}
} satisfies Actions;
