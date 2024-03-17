import fetch from '@/request'

type Meet = {
	id: number
	name: string

	createTime: Date
	startTime: Date
	endTime: Date

	private: boolean
	end: boolean
	hasPassword: boolean
	security: boolean

	record: boolean
	recordUrl: string
}

type MeetToken = Meet & {
	token: string
	link: string
}

type MeetConfig = {
	name: string
	description: string

	startTime: Date
	endTime: Date

	isCameraEnabled: boolean
	isMicroEnabled: boolean

	isPrivate: boolean
	hasPassword: boolean
	isSecurity: boolean
	isPasswordEncrypt: boolean

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

function getInviteLink(roomId: string) {
	return fetch<MeetToken>(`/meet/link?roomId=${roomId}`, { method: 'GET' })
}

function getMeetByLink(link: string) {
	return fetch<MeetToken>(`/meet/invite/${link}`, { method: 'GET' })
}

function getMeetArrangement() {
	return fetch<Meet[]>(`/meet/arrangement`, { method: 'GET' })
}

function getMeetHistory() {
	return fetch<Meet[]>(`/meet/history`, { method: 'GET' })
}

export { quickCreateMeet, createMeetByConfig, joinMeet, getInviteLink, getMeetByLink, getMeetArrangement, getMeetHistory }
export type { Meet, MeetConfig, MeetToken }
