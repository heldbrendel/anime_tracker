// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { AuthInfo } from '$lib/auth_info';
import type { UserInfo } from '$lib/user_info';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: AuthInfo | undefined;
			user: UserInfo | undefined;
		}

		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
