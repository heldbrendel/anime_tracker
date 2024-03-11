import { error, type Handle, redirect } from '@sveltejs/kit';
import { getUserInfo } from '$lib/server/mal_client';
import { getAuthInfo } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const pathName = event.url.pathname;
	if (!pathName.startsWith('/auth') && !event.cookies.get('oauth_token')) {
		redirect(302, '/auth/login');
	} else if (getAuthInfo(event.cookies) !== undefined) {
		const authInfo = getAuthInfo(event.cookies);
		if (authInfo !== undefined) {
			const userInfo = await getUserInfo(authInfo.access_token);
			if (userInfo !== undefined) {
				event.locals.auth = authInfo;
				event.locals.user = userInfo;
			} else {
				error(500, 'invalid state');
			}
		}
	}
	return resolve(event);
};
