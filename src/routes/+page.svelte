<script lang="ts">
	import {
		Button, Input, Label,
		Modal,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let formModal = false;
</script>

<div class="p-4 block items-center justify-between mt-1.5">
	<div class="mb-1 w-full">
		<div class="mb-4">
			<h1 class="text-xl font-semibold text-gray-900">Anime List</h1>
		</div>
		<div class="block items-center">
			<form></form>
			<div class="flex items-center w-full">
				<div class="hidden pl-2 space-x-1"></div>
				<Button class="ml-auto" on:click={() => (formModal = true)}>Add</Button>
				<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
					<form class="flex flex-col space-y-6" method="POST" action="?/add">
						<Label class="space-y-2">
							<span>My Anime List ID</span>
							<Input type="text" name="mal_id" required />
						</Label>
						<Button type="submit" class="w-full1">Add</Button>
					</form>
				</Modal>
			</div>
		</div>
	</div>
</div>

<div class="w-full grid grid-cols-3 gap-4">
	<div class="p-4 col-span-3">
		<Table>
			<TableHead>
				<TableHeadCell>Id</TableHeadCell>
				<TableHeadCell>Title</TableHeadCell>
				<TableHeadCell>Alternate Title</TableHeadCell>
				<TableHeadCell>Score</TableHeadCell>
				<TableHeadCell>Status</TableHeadCell>
				<TableHeadCell>
					<span class="sr-only">Actions</span>
				</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each data.animes as anime (anime.node.id)}
					<TableBodyRow>
						<TableBodyCell><a href="https://myanimelist.net/anime/{anime.node.id}" target="_blank">{anime.node.id}</a>
						</TableBodyCell>
						<TableBodyCell>{anime.node.title}</TableBodyCell>
						<TableBodyCell>{anime.node.alternative_titles.en}</TableBodyCell>
						<TableBodyCell>{anime.node.mean}</TableBodyCell>
						<TableBodyCell>{anime.node.my_list_status.status}</TableBodyCell>
						<TableBodyCell>
							<Button on:click={() => console.log("")} outline size="xs">Refresh</Button>
							|
							<Button on:click={() => console.log("")} outline size="xs">Delete</Button>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>
