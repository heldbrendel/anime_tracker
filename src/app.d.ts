// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { SessionInfo } from '$lib/server/session_info';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: SessionInfo | undefined;
		}

		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
