import { defineStore } from 'pinia'

interface ISecurityStore {
	sessionKey: CryptoKey | undefined
	roomId: string
	signaturePub: CryptoKey | undefined
}

export const SecurityStore = defineStore('security', {
	state: (): ISecurityStore => ({
		sessionKey: undefined,
		roomId: '',
		signaturePub: undefined,
	}),
	actions: {
		setSessionKey(sessionKey: CryptoKey) {
			this.sessionKey = sessionKey
		},
		setRoomId(roomId: string) {
			this.roomId = roomId
		},
		setSignaturePub(signaturePub: CryptoKey) {
			this.signaturePub = signaturePub
		},
	},
	getters: {
		getSessionKey: (state) => state.sessionKey,
		getRoomId: (state) => state.roomId,
		getSignaturePub: (state) => state.signaturePub,
	},
	persist: {
		enabled: true,
		strategies: [{ storage: sessionStorage }],
	},
})
