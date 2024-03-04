import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	if (!cookies.get('oauth_token') && !url.pathname.startsWith('/auth/')) {
		// redirecting to login if token is missing
		redirect(302, '/auth/login');
	}
};
