import fetch from '@/request'

type Meet = {
	id: number
	name: string

	createTime: number
	startTime: number
	endTime: number

	isPrivate: boolean
	isEnd: boolean
	hasPassword: boolean
	isSecurity: boolean
}

type MeetToken = Meet & {
	token: string
}

type MeetConfig = {
	name: string
	description: string

	startTime: Date
	endTime: Date

	isPrivate: boolean
	hasPassword: boolean
	isSecurity: boolean

	password: string
}

// 快速创建
function quickCreateMeet() {
	return fetch<Meet>(`/meet/quick_create`, { method: 'POST' })
}

// 通过参数创建
function createMeetByConfig(config: MeetConfig) {
	const formData = new FormData()
	formData.append('name', config.name)
	formData.append('description', config.description)
	formData.append('startTime', config.startTime.toString())
	formData.append('endTime', config.endTime.toString())
	formData.append('isPrivate', config.isPrivate.toString())
	formData.append('hasPassword', config.hasPassword.toString())
	formData.append('isSecurity', config.isSecurity.toString())
	formData.append('password', config.password)
	return fetch<Meet>(`/meet/create`, { method: 'POST', formData })
}

function joinMeet(roomId: string) {
	return fetch<MeetToken>(`/meet/join/${roomId}`, { method: 'POST' })
}

export { quickCreateMeet, createMeetByConfig, joinMeet }
export type { Meet, MeetConfig, MeetToken }
