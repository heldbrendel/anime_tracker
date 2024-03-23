<script lang="ts">
	import {
		Button,
		ButtonGroup,
		Input,
		Label,
		Modal,
		Select,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Toast
	} from 'flowbite-svelte';
	import { ArrowUpRightFromSquareOutline, CheckCircleSolid, MinusOutline, PlusOutline } from 'flowbite-svelte-icons';
	import type { PageData } from './$types';
	import type { Anime } from '$lib/anime';

	export let data: PageData;
	let animeMap: Map<number, Anime> = data.animeMap;

	let selectedSeasonFilter: string;
	let selectedYearFilter: number;
	let selectedStatusFilter: string;
	let searchInput: string;

	$: filteredItems = Array.from(animeMap.values()).sort((a, b) => a.id - b.id)
		.filter(a => selectedStatusFilter === 'all' || a.my_list_status.status === selectedStatusFilter)
		.filter(a => selectedSeasonFilter == 'all' || (a.start_season && a.start_season.season === selectedSeasonFilter))
		.filter(a => selectedYearFilter == 0 || (a.start_season && a.start_season.year === selectedYearFilter))
		.filter(a => !searchInput || searchInput.length < 3 ||
			a.title.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()) ||
			a.alternative_titles.en.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()) ||
			a.alternative_titles.ja.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()));

	$: years = [...new Set(Array.from(animeMap.values())
		.filter(v => v.start_season)
		.map(v => v.start_season.year))]
		.map(v => {
			return { value: v, name: v };
		}).sort((a, b) => a.value - b.value);

	const watchStatus = [
		{ value: 'plan_to_watch', name: 'Plan to watch' },
		{ value: 'watching', name: 'Watching' },
		{ value: 'completed', name: 'Completed' },
		{ value: 'dropped', name: 'Dropped' }
	];
	const seasons = [
		{ value: 'winter', name: 'Winter' },
		{ value: 'spring', name: 'Spring' },
		{ value: 'summer', name: 'Summer' },
		{ value: 'fall', name: 'Fall' }
	];

	let formModal = false;
	let addId = '';

	async function addAnimeEntry() {
		const response = await fetch('/api/anime', {
			method: 'POST',
			body: JSON.stringify({ id: addId })
		});
		const data = (await response.json()) as { status: string, message: string };
		showToastMessage(data.message);
		if (data.status) {
			addId = '';
			formModal = false;
		}
	}

	async function updateWatchingStatus(animeId: number, target: EventTarget | null) {
		if (target !== null) {
			const optionElement = target as HTMLOptionElement;
			console.log('updating watching status: ' + animeId + ' ' + optionElement.value);
			const response = await fetch('/api/anime/' + animeId, {
				method: 'PATCH',
				body: JSON.stringify({ status: optionElement.value })
			});
			processUpdateMessage(await response.json());
		}
	}

	async function updateNumberOfWatchedEpisodes(animeId: number, numberOfEpisodesWatched: number) {
		console.log('updating number of episodes status: ' + animeId + ' ' + numberOfEpisodesWatched);
		const response = await fetch(`/api/anime/${animeId}`, {
			method: 'PATCH',
			body: JSON.stringify({ num_episodes_watched: numberOfEpisodesWatched })
		});
		processUpdateMessage(await response.json());
	}

	function processUpdateMessage(message: { success: boolean, anime: Anime | undefined }) {
		if (message.success && message.anime) {
			const updatedAnime = message.anime;
			animeMap.set(updatedAnime.id, updatedAnime);
			animeMap = animeMap; // to cause update of reactive statements
			showToastMessage('Update successful');
		} else {
			showToastMessage('Update failed');
		}
	}

	let showToast = false;
	let toastMessage = '';

	function showToastMessage(message: string) {
		toastMessage = message;
		showToast = true;
		setTimeout(() => {
			showToast = false;
			toastMessage = '';
		}, 6000);
	}
</script>

<div class="p-4 block items-center justify-between mt-1.5">
	<div class="mb-1 w-full">
		<div class="mb-4">
			<h1 class="text-xl font-semibold text-gray-900">Anime List</h1>
		</div>
		<div class="block items-center">
			<div class="flex items-center w-full">
				<div class="flex items-center space-x-4">
					<Label>
						Search
						<Input bind:value={searchInput} />
					</Label>
					<Label>
						Year
						<Select placeholder="" bind:value={selectedYearFilter}>
							<option selected value="0">All</option>
							{#each years as { value, name }}
								<option {value}>{name}</option>
							{/each}
						</Select>
					</Label>
					<Label>
						Season
						<Select placeholder="" bind:value={selectedSeasonFilter}>
							<option selected value="all">All</option>
							{#each seasons as { value, name }}
								<option {value}>{name}</option>
							{/each}
						</Select>
					</Label>
					<Label>
						Status
						<Select placeholder="" bind:value={selectedStatusFilter}>
							<option selected value="all">All</option>
							{#each watchStatus as { value, name }}
								<option {value}>{name}</option>
							{/each}
						</Select>
					</Label>
				</div>
				<div class="hidden pl-2 space-x-1"></div>
				<Button class="ml-auto" on:click={() => (formModal = true)}>
					<PlusOutline />
					Add
				</Button>
				<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
					<span class="flex flex-col space-y-6">
						<Label class="space-y-2">
							<span>My Anime List ID</span>
							<Input type="text" name="mal_id" bind:value={addId} />
						</Label>
						<Button on:click={addAnimeEntry}>Add</Button>
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
				<TableHeadCell class="w-24">Id</TableHeadCell>
				<TableHeadCell>Title</TableHeadCell>
				<TableHeadCell>Alternate Title</TableHeadCell>
				<TableHeadCell class="w-20">Score</TableHeadCell>
				<TableHeadCell class="w-20">Season</TableHeadCell>
				<TableHeadCell class="w-20">Season</TableHeadCell>
				<TableHeadCell class="w-52">Status</TableHeadCell>
				<TableHeadCell class="w-52">Episodes</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each filteredItems as anime (anime.id)}
					<TableBodyRow>
						<TableBodyCell><a href="https://myanimelist.net/anime/{anime.id}" target="_blank"
															class="flex items-center hover:text-blue-600">
							<span>{anime.id}</span>
							<ArrowUpRightFromSquareOutline size="xs" />
						</a>
						</TableBodyCell>
						<TableBodyCell class="whitespace-normal">{anime.title}</TableBodyCell>
						<TableBodyCell class="whitespace-normal">{anime.alternative_titles.en}</TableBodyCell>
						<TableBodyCell>
							{#if anime.mean}{anime.mean}{/if}
						</TableBodyCell>
						<TableBodyCell>
							{#if anime.start_season}{anime.start_season.year}{/if}
						</TableBodyCell>
						<TableBodyCell>
							{#if anime.start_season}{anime.start_season.season}{/if}
						</TableBodyCell>
						<TableBodyCell>
							<Select items={watchStatus} size="sm" value="{anime.my_list_status.status}"
											on:change={(event) => updateWatchingStatus(anime.id, event.target)} />
						</TableBodyCell>
						<TableBodyCell>
							<ButtonGroup size="xs">
								<Button outline size="xs"
												on:click={() => updateNumberOfWatchedEpisodes(anime.id, anime.my_list_status.num_episodes_watched - 1) }>
									<MinusOutline />
								</Button>
								<Button disabled outline class="w-20">{anime.my_list_status.num_episodes_watched}
									/ {anime.num_episodes}</Button>
								<Button outline size="xs"
												on:click={() => updateNumberOfWatchedEpisodes(anime.id, anime.my_list_status.num_episodes_watched + 1) }>
									<PlusOutline />
								</Button>
							</ButtonGroup>
						</TableBodyCell>
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
