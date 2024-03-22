import axios from 'axios';
import type { Anime } from '$lib/anime';
import type { UserInfo } from '$lib/user_info';
import type { WatchingStatus } from '$lib/watching_status';

export async function getUserInfo(access_token: string) {
	try {
		const response = await axios.get('https://api.myanimelist.net/v2/users/@me', {
			headers: {
				Authorization: 'Bearer ' + access_token
			}
		});
		if (response.status === 200) {
			return response.data as UserInfo;
		} else {
			return undefined;
		}
	} catch (error) {
		console.error(error);
	}
}

export async function getUserAnimeList(access_token: string) {
	try {
		const response = await axios.get('https://api.myanimelist.net/v2/users/@me/animelist', {
			headers: {
				Authorization: 'Bearer ' + access_token
			},
			params: {
				fields: 'alternative_titles,mean,my_list_status,num_episodes,start_season',
				limit: 1000
			}
		});
		if (response.status === 200) {
			return (await response.data).data.map((item: { node: Anime }) => item.node) as Array<Anime>;
		} else {
			return [];
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getAnime(id: number, access_token: string) {
	try {
		const response = await axios.get(`https://api.myanimelist.net/v2/anime/${id}`, {
			headers: {
				Authorization: 'Bearer ' + access_token
			},
			params: {
				fields: 'alternative_titles,mean,my_list_status,num_episodes,start_season',
				limit: 1000
			}
		});
		return (await response.data) as Anime;
	} catch (error) {
		console.error(error);
	}
}

export async function searchAnime(query: string, access_token: string) {
	try {
		const response = await axios.get('https://api.myanimelist.net/v2/anime', {
			headers: {
				Authorization: 'Bearer ' + access_token
			},
			params: {
				fields: 'id,title,alternative_titles,mean,num_episodes,start_season',
				limit: 10,
				q: query
			}
		});
		if (response.status === 200) {
			return (await response.data).data.map((item: { node: Anime }) => item.node) as Array<Anime>;
		} else {
			return [];
		}
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function addAnimeToList(id: number, access_token: string) {
	try {
		const response = await axios.patch(
			`https://api.myanimelist.net/v2/anime/${id}/my_list_status`,
			{
				status: 'plan_to_watch'
			},
			{
				headers: {
					Authorization: 'Bearer ' + access_token,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
		);
		return response.status === 200;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export async function setAnimeStatus(id: number, status: WatchingStatus, access_token: string) {
	try {
		const response = await axios.patch(
			`https://api.myanimelist.net/v2/anime/${id}/my_list_status`,
			{
				status: status
			},
			{
				headers: {
					Authorization: 'Bearer ' + access_token,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
		);
		console.log(`response status for setting status: ${response.status}`);
		return response.status === 200;
	} catch (error) {
		console.error(error);
		return false;
	}
}

export async function setAnimeEpisodesWatched(id: number, numberOfEpisodesWatches: number, access_token: string) {
	try {
		const response = await axios.patch(
			`https://api.myanimelist.net/v2/anime/${id}/my_list_status`,
			{
				num_watched_episodes: numberOfEpisodesWatches
			},
			{
				headers: {
					Authorization: 'Bearer ' + access_token,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
		);
		console.log(`response status for setting number of episodes: ${response.status}`);
		return response.status === 200;
	} catch (error) {
		console.error(error);
		return false;
	}
}
