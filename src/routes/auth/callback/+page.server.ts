import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { error, redirect } from '@sveltejs/kit';
import crypto from 'crypto';
import { pkceChallenge, verifyChallenge } from '$lib/server/auth';

export const load: PageServerLoad = async ({ cookies, url, fetch }) => {

	const codeChallenge = url.searchParams.get('code');
	const codeVerifier = cookies.get('oauth_code_challenge');
	if (codeChallenge === null || codeVerifier === undefined) {
		console.log('code challenge or code challenge hash invalid');
		error(500, 'unexpected response');
	} else if (verifyChallenge(codeVerifier, codeChallenge)) {
		// ensure the code challenge value matches the hash of the cookie field for the code challenge
		console.log('code challenge does not match');
		error(500, 'unexpected response');
	}

	const responseState = url.searchParams.get('state');
	const cookieState = cookies.get('oauth_state');
	if (responseState === null || cookieState === undefined) {
		console.log('state from response or state from cookie not available');
		error(500, 'unexpected response');
	} else if (crypto.createHash('sha256').update(cookieState).digest('base64url') !== responseState) {
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

	const challenge = pkceChallenge(128);

	const data = new URLSearchParams();
	data.append('client_id', clientId);
	data.append('client_secret', clientSecret);
	// Value MUST be set to “authorization_code”.
	data.append('grant_type', 'authorization_code');
	// The authorization code you got in the previous step.
	data.append('code', codeChallenge);
	data.append('redirect_uri', redirectUri);
	// FIXME Failed to verify code verifier
	data.append('code_verifier', challenge.code_verifier);

	const response = await fetch('https://myanimelist.net/v1/oauth2/token', {
		method: 'POST',
		body: data
	});
	if (response.status <= 400) {
		console.log(await response.json());
		error(500, 'error during authentication');
	} else {
		const responseJson = await response.json();
		cookies.set('oauth_token', JSON.stringify(responseJson), { path: '/' });

		redirect(302, '/');
	}
};
