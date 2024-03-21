import crypto from 'crypto';

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

/**
 * Generates a random string that can be used as verifier token
 * during oauth authentication.
 * @param length length of the random string
 */
function generateVerifier(length: number): string {
	return random(length);
}

/**
 * Generates a string that can be used as challenge token
 * during oauth authentication.
 * @param codeVerifier the verifier token to use for generating the challenge token
 */
export function generateChallenge(codeVerifier: string) {
	return crypto.createHash('sha256')
		.update(codeVerifier)
		.digest('base64url');
}

/**
 * Generates a verifier and challenge token for oauth authentication
 * @param length length of the verifier token, length must be between 43 and 120, if no value is given defaults to 43
 */
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

/**
 * Checks if the challenge token generated from the verifier matches the expected challenge token
 * @param codeVerifier verifier token to use for verification
 * @param expectedChallenge the expected value of the challenge token
 */
export function verifyChallenge(codeVerifier: string, expectedChallenge: string) {
	const actualChallenge = generateChallenge(codeVerifier);
	return actualChallenge === expectedChallenge;
}


