<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Table>
	<TableHead>
		<TableHeadCell>Id</TableHeadCell>
		<TableHeadCell>Title</TableHeadCell>
		<TableHeadCell>Alternate Title</TableHeadCell>
		<TableHeadCell>Score</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each data.animes as anime (anime.mal_id)}
			<TableBodyRow>
				<TableBodyCell><a href="https://myanimelist.net/anime/{anime.mal_id}" target="_blank">{anime.mal_id}</a></TableBodyCell>
				<TableBodyCell>{anime.title}</TableBodyCell>
				<TableBodyCell>{anime.alternate_title}</TableBodyCell>
				<TableBodyCell>{anime.score}</TableBodyCell>
				<TableBodyCell>{anime.status}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
