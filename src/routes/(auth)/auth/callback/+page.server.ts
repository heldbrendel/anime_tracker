import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { verifyChallenge } from '$lib/server/auth';
import { decryptData } from '$lib/server/encryption';
import { storeSessionInfo } from '$lib/server/session_cache';
import { getUserInfo } from '$lib/server/mal_client';

export const load: PageServerLoad = async ({ cookies, url, fetch }) => {
	const code = url.searchParams.get('code');
	const code_verifier = cookies.get('oauth_code_verifier');
	const code_challenge = cookies.get('oauth_code_challenge');
	if (code === null || code_verifier === undefined || code_challenge === undefined) {
		console.log('code challenge or code challenge hash invalid');
		error(500, 'unexpected response');
	} else if (verifyChallenge(decryptData(code_verifier), code)) {
		// ensure the code challenge value matches the hash of the cookie field for the code challenge
		console.log('code challenge does not match');
		error(500, 'unexpected response');
	}

	const responseState = url.searchParams.get('state');
	const cookieState = cookies.get('oauth_state');
	if (responseState === null || cookieState === undefined) {
		console.log('state from response or state from cookie not available');
		error(500, 'unexpected response');
	} else if (
		crypto.createHash('sha256').update(decryptData(cookieState)).digest('base64url') !==
		responseState
	) {
		// ensure the state value matches the hash of the cookie field for the state
		console.log('state does not match');
		error(500, 'state error');
	} else {
		cookies.delete('oauth_state', { path: '/' });
	}

	const clientId = env.MAL_CLIENT_ID;
	const clientSecret = env.MAL_CLIENT_SECRET;
	const redirectUri = env.MAL_REDIRECT_URI;
	if (clientId == undefined || clientSecret == undefined || redirectUri == undefined) {
		error(500, 'invalid environment configuration');
	}

	const formBody = [
		encodeURIComponent('client_id') + '=' + encodeURIComponent(clientId),
		encodeURIComponent('client_secret') + '=' + encodeURIComponent(clientSecret),
		encodeURIComponent('redirect_uri') + '=' + encodeURIComponent(redirectUri),
		encodeURIComponent('grant_type') + '=' + encodeURIComponent('authorization_code'),
		encodeURIComponent('code') + '=' + encodeURIComponent(code),
		encodeURIComponent('code_verifier') + '=' + encodeURIComponent(decryptData(code_challenge))
	].join('&');

	const response = await fetch('https://myanimelist.net/v1/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: formBody
	});
	if (response.status >= 400) {
		console.log(await response.json());
		error(500, 'error during authentication');
	} else {
		const responseJson = await response.json();
		const userInfo = await getUserInfo(responseJson.access_token);
		const sessionInfo = { ...responseJson, ...userInfo };
		storeSessionInfo(cookies, sessionInfo);

		cookies.delete('oauth_code_challenge', { path: '/' });
		cookies.delete('oauth_code_verifier', { path: '/' });

		redirect(302, '/');
	}
};
