import { env } from '$env/dynamic/private';
import * as crypto from 'crypto';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserInfo } from '$lib/server/mal_client';
import { encryptData } from '$lib/server/encryption';
import { getAuthInfo } from '$lib/server/session_cache';
import { generatePkceChallenge } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies }) => {
	const authInfo = getAuthInfo(cookies);
	if (authInfo && (await getUserInfo(authInfo.access_token))) {
		// user is already logged in and valid
		redirect(302, '/');
	}

	const state_uuid = crypto.randomUUID();
	cookies.set('oauth_state', encryptData(state_uuid), { path: '/' });
	const state_hash = crypto.createHash('sha256').update(state_uuid).digest('base64url');

	const pkce_challenge = generatePkceChallenge(43);
	cookies.set('oauth_code_verifier', encryptData(pkce_challenge.code_verifier), { path: '/' });
	cookies.set('oauth_code_challenge', encryptData(pkce_challenge.code_challenge), { path: '/' });

	const client_id = env.MAL_CLIENT_ID;
	const redirect_uri = env.MAL_REDIRECT_URI;
	if (client_id === undefined || redirect_uri === undefined) {
		error(500, 'invalid environment configuration');
	}

	return {
		clientId: env.MAL_CLIENT_ID,
		redirectUri: env.MAL_REDIRECT_URI,
		state: state_hash,
		codeChallenge: pkce_challenge.code_challenge
	};
};
