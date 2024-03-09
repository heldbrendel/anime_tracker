<script lang="ts">
	import type { PageData } from '../../../../.svelte-kit/types/src/routes';
	import { Button, Input, Label } from 'flowbite-svelte';

	export let data: PageData;

</script>

<div class="container mx-auto">
	<form class="flex flex-col space-y-6" method="POST" action="?/save">
		<div class="mb-6">
			<Label for="mal_api_key" class="block mb-2">My Anime List API Key</Label>
			<Input id="mal_api_key" name="mal_api_key" value="{data.settings?.mal_api_key}" />
		</div>
		<Button type="submit" class="w-full1">Save</Button>
	</form>
</div>
