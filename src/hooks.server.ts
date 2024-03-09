import { type Handle, redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const pathName = event.url.pathname;
	if (!pathName.startsWith('/auth') && !event.cookies.get('oauth_token')) {
		redirect(302, '/auth/login');
	}
	return resolve(event);
};
