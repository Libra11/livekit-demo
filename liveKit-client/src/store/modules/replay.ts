import { defineStore } from 'pinia'

interface IReplayStore {
	url: string
}

export const ReplayStore = defineStore('replay', {
	state: (): IReplayStore => ({
		url: '',
	}),
	actions: {
		setUrl(url: string) {
			this.url = url
		},
	},
	getters: {
		getUrl: (state) => state.url,
	},
	// persist: {
	// 	enabled: true,
	// 	strategies: [{ storage: sessionStorage }],
	// },
})
