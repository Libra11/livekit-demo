import { defineStore } from 'pinia'

interface IRoomStore {
	username: string
	roomname: string
	userId: string
	password: string
	login: boolean
}

export const RoomStore = defineStore('room', {
	state: (): IRoomStore => ({
		username: '',
		roomname: '',
		userId: '',
		password: '',
		login: false,
	}),
	actions: {
		setUsername(username: string) {
			this.username = username
		},
		setRoomname(roomname: string) {
			this.roomname = roomname
		},
		setUserId(userId: string) {
			this.userId = userId
		},
		setPassword(password: string) {
			this.password = password
		},
		setLogin(login: boolean) {
			this.login = login
		},
	},
	getters: {
		getUsername: (state) => state.username,
		getRoomname: (state) => state.roomname,
		getUserId: (state) => state.userId,
		getPassword: (state) => state.password,
		getLogin: (state) => state.login,
	},
})
