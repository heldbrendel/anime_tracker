import type { PageServerLoad, Actions } from '../../../../.svelte-kit/types/src/routes';
import prisma from '$lib/prisma';

export const load: PageServerLoad = async () => {
	const response = await prisma.settings.findFirst();
	return { settings: response };
};

export const actions = {
	save: async (event) => {
		const data = await event.request.formData();
		const malApiKey = data.get('mal_api_key');
		if (typeof malApiKey === 'string') {
			const currentSettings = await prisma.settings.findFirst();
			if (currentSettings != null) {
				await prisma.settings.update({
					where: {
						id: currentSettings.id
					},
					data: {
						mal_api_key: malApiKey
					}
				});
			} else {
				await prisma.settings.create({
					data: {
						mal_api_key: malApiKey
					}
				});
			}
		}
	}
} satisfies Actions;
