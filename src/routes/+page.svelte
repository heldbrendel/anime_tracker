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

<div class="container mx-auto">
	<div class="m-4">
		<Button on:click={() => (formModal = true)}>Add</Button>
		<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
		<form class="flex flex-col space-y-6" method="POST" action="?/add">
				<Label class="space-y-2">
					<span>My Anime List ID</span>
					<Input type="mal_id" name="mal_id" required />
				</Label>
				<Button type="submit" class="w-full1">Add</Button>
			</form>
		</Modal>
	</div>
	<div class="m-4">
		<Table>
			<TableHead>
				<TableHeadCell>Id</TableHeadCell>
				<TableHeadCell>Title</TableHeadCell>
				<TableHeadCell>Alternate Title</TableHeadCell>
				<TableHeadCell>Score</TableHeadCell>
				<TableHeadCell>Status</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each data.animes as anime (anime.mal_id)}
					<TableBodyRow>
						<TableBodyCell><a href="https://myanimelist.net/anime/{anime.mal_id}" target="_blank">{anime.mal_id}</a>
						</TableBodyCell>
						<TableBodyCell>{anime.title}</TableBodyCell>
						<TableBodyCell>{anime.alternate_title}</TableBodyCell>
						<TableBodyCell>{anime.score}</TableBodyCell>
						<TableBodyCell>{anime.status}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>

	</div>
</div>
