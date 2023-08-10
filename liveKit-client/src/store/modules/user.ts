/*
 * @Author: Libra
 * @Date: 2023-03-22 18:52:51
 * @LastEditTime: 2023-08-10 14:08:17
 * @LastEditors: Libra
 * @Description: user store
 */
import { defineStore } from 'pinia'

interface IUserStore {
	token: string
	userName: string
}
export const UserStore = defineStore('user', {
	state: (): IUserStore => ({
		token: '',
		userName: '',
	}),
	actions: {
		setToken(token: string) {
			this.token = token
		},
		setUserName(userName: string) {
			this.userName = userName
		},
	},
	getters: {
		getToken: (state) => state.token,
		getUserName: (state) => state.userName,
	},
	persist: {
		enabled: true,
	},
})
