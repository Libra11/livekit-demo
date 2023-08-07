/*
 * @Author: Libra
 * @Date: 2023-03-22 18:52:51
 * @LastEditTime: 2023-08-07 14:48:25
 * @LastEditors: Libra
 * @Description: user store
 */
import type LibraLiveKit from '@/livekit'
import { defineStore } from 'pinia'

interface ILlkStore {
	llk: LibraLiveKit | null
}
export const LlkStore = defineStore('llk', {
	state: (): ILlkStore => ({
		llk: null,
	}),
	actions: {
		setLlk(llk: LibraLiveKit) {
			this.llk = llk
		},
	},
	getters: {
		getLlk: (state) => state.llk,
	},
})
