<script lang="ts">
	import {
		Button,
		Input,
		Label,
		Modal,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Toast
	} from 'flowbite-svelte';
	import { CheckCircleSolid, LinkOutline } from 'flowbite-svelte-icons';
	import type { PageData } from './$types';

	export let data: PageData;

	let formModal = false;
	let addId = '';

	let showToast = false;
	let toastMessage = '';

	function autoHideTast() {
		setTimeout(() => {
			showToast = false;
			toastMessage = '';
		}, 6000);
	}

	async function add() {
		const response = await fetch('/api/anime', {
			method: 'POST',
			body: JSON.stringify({ id: addId })
		});
		const data = (await response.json()) as { status: string, message: string };
		toastMessage = data.message;
		showToast = true;
		autoHideTast();
		if (data.status) {
			addId = '';
			formModal = false;
		}
	}
</script>

<div class="p-4 block items-center justify-between mt-1.5">
	<div class="mb-1 w-full">
		<div class="mb-4">
			<h1 class="text-xl font-semibold text-gray-900">Anime List</h1>
		</div>
		<div class="block items-center">
			<div class="flex items-center w-full">
				<div class="hidden pl-2 space-x-1"></div>
				<Button class="ml-auto" on:click={() => (formModal = true)}>Add</Button>
				<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
					<span class="flex flex-col space-y-6">
						<Label class="space-y-2">
							<span>My Anime List ID</span>
							<Input type="text" name="mal_id" bind:value={addId} />
						</Label>
						<Button on:click={add}>Add</Button>
					</span>
				</Modal>
			</div>
		</div>
	</div>
</div>

<div class="w-full grid grid-cols-3 gap-4">
	<div class="p-4 col-span-3">
		<Table class="table-fixed">
			<TableHead>
				<TableHeadCell class="w-32">Id</TableHeadCell>
				<TableHeadCell>Title</TableHeadCell>
				<TableHeadCell>Alternate Title</TableHeadCell>
				<TableHeadCell class="w-20">Score</TableHeadCell>
				<TableHeadCell class="w-32">Season</TableHeadCell>
				<TableHeadCell class="w-32">Status</TableHeadCell>
				<TableHeadCell class="w-32">Episodes</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each data.animes as anime (anime.id)}
					<TableBodyRow>
						<TableBodyCell><a href="https://myanimelist.net/anime/{anime.id}" target="_blank"
															class="flex items-center hover:text-blue-600">
							<LinkOutline size="xs" />
							<span>{anime.id}</span>
						</a>
						</TableBodyCell>
						<TableBodyCell class="whitespace-normal">{anime.title}</TableBodyCell>
						<TableBodyCell class="whitespace-normal">{anime.alternative_titles.en}</TableBodyCell>
						<TableBodyCell>
							{#if anime.mean}{anime.mean}{/if}
						</TableBodyCell>
						<TableBodyCell>
							{#if anime.start_season}{anime.start_season.year} {anime.start_season.season}{/if}
						</TableBodyCell>
						<TableBodyCell>{anime.my_list_status.status}</TableBodyCell>
						<TableBodyCell>{anime.my_list_status.num_episodes_watched} / {anime.num_episodes}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>

<div class="fixed right-12 bottom-12 z-50">
	<Toast bind:open={showToast}>
		<svelte:fragment slot="icon">
			<CheckCircleSolid class="w-5 h-5" />
			<span class="sr-only">Check icon</span>
		</svelte:fragment>
		{toastMessage}
	</Toast>
</div>