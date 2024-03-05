import axios from 'axios';

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
				fields: 'alternative_titles,mean,my_list_status,num_episodes,start_season'
			}
		});
		if (response.status === 200) {
			return response.data.data as Array<Anime>;
		} else {
			return undefined;
		}
	} catch (error) {
		console.error(error);
	}
}
