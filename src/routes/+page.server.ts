import type { PageServerLoad } from './$types';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async () => {
	const response = await prisma.anime.findMany();
	return { animes: response };
};
