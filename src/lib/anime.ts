interface Anime {
	node: {
		id: number,
		title: string,
		main_picture: {
			medium: string,
			large: string,
		},
		alternative_titles: {
			synonyms: [],
			en: string,
			ja: string
		}
		mean: number,
		my_list_status: {
			status: string,
			score: number,
			num_episodes_watched: number,
			is_rewatching: false,
			updated_at: string
		},
		num_episodes: number,
		start_season: {
			year: number, season: string
		}
	};
}
