import { type Handle, redirect } from '@sveltejs/kit';
import { getSessionInfo } from '$lib/server/session_cache';

export const handle: Handle = async ({ event, resolve }) => {
	const pathName = event.url.pathname;
	const sessionInfo = getSessionInfo(event.cookies);
	if (sessionInfo) {
		event.locals.session = sessionInfo;
	} else if (!pathName.startsWith('/auth')) {
		redirect(302, '/auth/login');
	}
	return resolve(event);
};
