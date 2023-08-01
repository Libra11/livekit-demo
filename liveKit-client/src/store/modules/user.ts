/*
 * @Author: Libra
 * @Date: 2023-03-22 18:52:51
 * @LastEditTime: 2023-03-30 18:46:54
 * @LastEditors: Libra
 * @Description: user store
 */
import { defineStore } from 'pinia'

interface IUserStore {
	token: string
}
export const UserStore = defineStore('user', {
	state: (): IUserStore => ({
		token: '',
	}),
	actions: {
		setToken(token: string) {
			this.token = token
		},
	},
	getters: {
		getToken: (state) => state.token,
	},
	persist: {
		enabled: true,
	},
})
