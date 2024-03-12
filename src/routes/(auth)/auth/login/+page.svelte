<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from 'flowbite-svelte';

	export let data: PageData;

	const loginUrl = 'https://myanimelist.net/v1/oauth2/authorize' +
		'?response_type=code' +
		'&client_id=' + data.clientId +
		'&state=' + data.state +
		'&redirect_uri=' + data.redirectUri +
		'&code_challenge=' + data.codeChallenge +
		'&code_challenge_method=plain';
</script>

<div class="flex justify-center m-5">
	<Button href="{loginUrl}">Login</Button>
</div>
