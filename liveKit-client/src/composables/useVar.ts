/*
 * @Author: Libra
 * @Date: 2023-03-22 18:26:39
 * @LastEditTime: 2023-08-07 15:00:14
 * @LastEditors: Libra
 * @Description: useToken
 */
import { UserStore } from '@/store/modules/user'
import { computed } from 'vue'
import type { Ref } from 'vue'
import { LlkStore } from '@/store/modules/llk'
import type LibraLiveKit from '@/livekit'

// src/composables/useToken.ts
export function useToken(): Ref<string> {
	const userStore = UserStore()
	const token = computed(() => userStore.token)
	return token
}
// src/composables/useLlk.ts
export function useLlk(): LibraLiveKit | null {
	const llkStore = LlkStore()
	const llk = llkStore.llk as LibraLiveKit
	return llk
}
