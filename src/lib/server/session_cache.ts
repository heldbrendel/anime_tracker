import type { Cookies } from '@sveltejs/kit';
import { decryptData, encryptData } from '$lib/server/encryption';
import crypto from 'crypto';

import NodeCache from 'node-cache';
import type { SessionInfo } from '$lib/server/session_info';

// use to cache user info and oauth tokens instead of cookies
const sessionCache = new NodeCache({
	stdTTL: 604800 // a week in seconds
});

export function getSessionInfo(cookies: Cookies): SessionInfo | undefined {
	const session_token = cookies.get('session_token');
	if (session_token !== undefined) {
		const sessionId = decryptData(session_token);
		if (sessionId) {
			return sessionCache.get<SessionInfo>(sessionId);
		}
	}
}

export function storeSessionInfo(cookies: Cookies, sessionInfo: SessionInfo) {
	const sessionId = crypto.randomUUID();
	sessionCache.set<SessionInfo>(sessionId, sessionInfo);
	cookies.set('session_token', encryptData(sessionId), { path: '/' });
}
