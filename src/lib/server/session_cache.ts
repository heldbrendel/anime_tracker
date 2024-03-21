import type { Cookies } from '@sveltejs/kit';
import type { AuthInfo } from '$lib/auth_info';
import { decryptData, encryptData } from '$lib/server/encryption';

import NodeCache from 'node-cache';
import type { SessionInfo } from '$lib/server/session_info';

// use to cache user info and oauth tokens instead of cookies
const sessionCache = new NodeCache({
	stdTTL: 604800 // a week in seconds
});

export function getSessionInfo(cookies: Cookies): string | undefined {
	const session_token = cookies.get('session-token');
	if (session_token !== undefined) {
		return decryptData(session_token);
	}
}

export function addSessionInfo(cookies: Cookies, sessionId: string) {
	cookies.set('session-token', encryptData(sessionId), { path: '/' });
}

// TODO remove and replace using session cache
export function getAuthInfo(cookies: Cookies): AuthInfo | undefined {
	const auth_token_cookie = cookies.get('oauth_token');
	if (auth_token_cookie !== undefined) {
		try {
			return JSON.parse(decryptData(auth_token_cookie)) as AuthInfo;
		} catch (e) {
			console.log('error parsing oauth info', e);
			cookies.delete('oauth_token', { path: '/' });
		}
	}
}

export function addSessionInfoToCache(sessionId: string, sessionInfo: SessionInfo): void {
	sessionCache.set<SessionInfo>(sessionId, sessionInfo);
}

export function getSessionInfoFromCache(sessionId: string): SessionInfo | undefined {
	return sessionCache.get<SessionInfo>(sessionId);
}
