import crypto from 'crypto';
import type { Cookies } from '@sveltejs/kit';
import type { AuthInfo } from '$lib/auth_info';

function getRandomValues(size: number) {
	return crypto.getRandomValues(new Uint8Array(size));
}

function random(size: number) {
	const mask = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~';
	let result = '';
	const randomUints = getRandomValues(size);
	for (let i = 0; i < size; i++) {
		const randomIndex = randomUints[i] % mask.length;
		result += mask[randomIndex];
	}
	return result;
}

function generateVerifier(length: number): string {
	return random(length);
}

export function generateChallenge(codeVerifier: string) {
	return crypto.createHash('sha256')
		.update(codeVerifier)
		.digest('base64url');
}

export function generatePkceChallenge(length?: number) {
	if (!length) {
		length = 43;
	}

	if (length < 43 || length > 128) {
		throw new Error(`Expected a length between 43 and 128. Received ${length}.`);
	}

	const verifier = generateVerifier(length);
	const challenge = generateChallenge(verifier);
	return {
		code_verifier: verifier,
		code_challenge: challenge
	};
}

export function verifyChallenge(codeVerifier: string, expectedChallenge: string) {
	const actualChallenge = generateChallenge(codeVerifier);
	return actualChallenge === expectedChallenge;
}

export function getAuthInfo(cookies: Cookies): AuthInfo | undefined {
	const auth_token_cookie = cookies.get('oauth_token');
	if (auth_token_cookie !== undefined) {
		try {
			return JSON.parse(auth_token_cookie) as AuthInfo;
		} catch (e) {
			console.log('error parsing oauth info', e);
			cookies.delete('oauth_token', { path: '/' });
		}
	}
}
