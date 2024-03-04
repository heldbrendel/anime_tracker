import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import * as crypto from 'crypto';
import { error, redirect } from '@sveltejs/kit';
import { pkceChallenge } from '$lib/server/auth';


export const load: PageServerLoad = async ({ cookies }) => {
	if (cookies.get('oauth_token')) {
		// user is already logged in
		redirect(302, '/');
	}

	const stateUuid = crypto.randomUUID();
	cookies.set('oauth_state', stateUuid, { path: '/' });
	const stateHash = crypto.createHash('sha256').update(stateUuid).digest('base64url');

	const codeChallenge = pkceChallenge(128);
	cookies.set('oauth_code_challenge', codeChallenge.code_verifier, { path: '/' });

	const clientId = env.MAL_CLIENT_ID;
	const redirectUri = env.MAL_REDIRECT_URI;
	if (clientId === undefined || redirectUri === undefined) {
		error(500, 'invalid environment configuration');
	}

	return {
		clientId: env.MAL_CLIENT_ID,
		redirectUri: env.MAL_REDIRECT_URI,
		state: stateHash,
		codeChallenge: codeChallenge.code_challenge
	};
};
