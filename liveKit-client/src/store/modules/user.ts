/*
 * @Author: Libra
 * @Date: 2023-03-22 18:52:51
 * @LastEditTime: 2023-08-15 16:46:25
 * @LastEditors: Libra
 * @Description: user store
 */
import { defineStore } from 'pinia'

/**
 * EquallyDivided: 等分
 * MainAndAside: 主体和侧边栏
 * MainAndTop: 主体和顶部
 */
export type ILayout = 'EquallyDivided' | 'MainAndAside' | 'MainAndTop'
interface IUserStore {
	token: string
	userName: string
	layout: ILayout
	llkToken: string
}

export const UserStore = defineStore('user', {
	state: (): IUserStore => ({
		token: '',
		userName: '',
		layout: 'EquallyDivided',
		llkToken: '',
	}),
	actions: {
		setToken(token: string) {
			this.token = token
		},
		setUserName(userName: string) {
			this.userName = userName
		},
		setLayout(layout: ILayout) {
			this.layout = layout
		},
		setLlkToken(llkToken: string) {
			this.llkToken = llkToken
		},
	},
	getters: {
		getToken: (state) => state.token,
		getUserName: (state) => state.userName,
		getLayout: (state) => state.layout,
		getLlkToken: (state) => state.llkToken,
	},
	persist: {
		enabled: true,
		strategies: [{storage: localStorage}]
	},
})
