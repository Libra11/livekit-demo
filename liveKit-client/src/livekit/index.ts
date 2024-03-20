/*
 * @Author: Libra
 * @Date: 2023-05-26 16:52:33
 * @LastEditTime: 2023-08-10 14:13:23
 * @LastEditors: Libra
 * @Description:
 */
import {
	DataPacket_Kind,
	ExternalE2EEKeyProvider,
	LocalParticipant,
	LocalTrack,
	LocalTrackPublication,
	Participant,
	RemoteParticipant,
	RemoteTrack,
	RemoteTrackPublication,
	Room,
	RoomEvent,
	Track,
	TrackPublication,
	VideoPresets,
	deriveKeys,
	setLogLevel,
} from 'livekit-client'
import { EventEmitter } from 'events'
import { getToken } from '@/api/token'
import { WEBSOCKET_URL } from '@/config/config'
import E2EEWorker from '../e2ee/worker/e2ee.worker?worker'
import { joinMeet } from '@/api/meet'

interface IInit {
	userId: string
	username: string
	roomname: string
	login: boolean
	password: string
}
export default class LibraLiveKit extends EventEmitter {
	private username: string
	public roomname: string
	private userId: string
	private room: Room | null = null
	private login: boolean
	private password: string
	private cryptor: CryptoKey | null = null
	public keyProvider: ExternalE2EEKeyProvider | null = null
	constructor({ username, roomname, userId, login, password }: IInit) {
		super()
		this.username = username
		this.roomname = roomname
		this.userId = userId
		this.login = login
		this.password = password
	}
	async init() {
		await this.createRoom()
		this.initEvent()
		await this.joinRoom()
		await this.createTrack()
	}

	async createRoom() {
		let e2eeEnabled = false

		if (this.password !== undefined && this.password.length > 0) {
			this.keyProvider = new ExternalE2EEKeyProvider()
			await this.keyProvider.setKey(this.password)
			const rawKey = this.keyProvider.getKeys()[0].key
			const res = await deriveKeys(rawKey, 'password')
			this.cryptor = res.encryptionKey
			e2eeEnabled = true
			console.log('e2ee enabled', e2eeEnabled)
		}

		this.room = new Room({
			adaptiveStream: true,
			dynacast: true,
			videoCaptureDefaults: {
				resolution: VideoPresets.h720.resolution,
			},
			e2ee: e2eeEnabled ? { keyProvider: this.keyProvider as ExternalE2EEKeyProvider, worker: new E2EEWorker() } : undefined,
		})
		if (e2eeEnabled) {
			await this.room.setE2EEEnabled(true)
		}
		setLogLevel('error')
	}
	async joinRoom() {
		let token = ''
		if (!this.login) {
			const res = await getToken(this.userId, this.roomname)
			if (res.code !== 200) return
			token = res.data
		} else {
			const res = await joinMeet(this.roomname)
			if (res.code !== 200) return
			token = res.data.token
		}
		const room = this.room
		if (!room) return
		await room.connect(WEBSOCKET_URL, token)
		console.log('connected to room', room.name)
		console.log('e2ee enabled', this.room?.isE2EEEnabled)
	}
	async leaveRoom() {
		const room = this.room
		room && (await room.disconnect())
	}
	// get local device
	getLocalDevices(type: 'audio' | 'video') {
		switch (type) {
			case 'audio':
				return Room.getLocalDevices('audioinput')
			case 'video':
				return Room.getLocalDevices('videoinput')
		}
	}
	// switch local device
	async switchLocalDevice(type: 'audio' | 'video', deviceId: string) {
		const room = this.room
		if (!room) return
		//   async switchActiveDevice(kind: MediaDeviceKind, deviceId: string, exact: boolean = false) {
		switch (type) {
			case 'audio':
				await room.switchActiveDevice('audioinput', deviceId)
				break
			case 'video':
				await room.switchActiveDevice('videoinput', deviceId)
				break
		}
	}
	// send message
	async sendMessage(message: string | File, type: number) {
		const room = this.room
		if (!room) return

		console.log('sendMessage', message, type)

		let data: Uint8Array = new Uint8Array()
		if (type === 0) {
			const strData = JSON.stringify(message)
			const encoder = new TextEncoder()
			// publishData takes in a Uint8Array, so we need to convert it
			data = encoder.encode(strData)
		} else {
			// 读取文件
			const bf = await (message as File).arrayBuffer()
			data = new Uint8Array(bf)
		}

		// 复制一份data
		let sendData = new Uint8Array(data)

		// 将类型添加到数据中
		const typeData = new Uint8Array([type])
		if (type === 0) {
			sendData = new Uint8Array([...typeData, ...data])
		} else {
			// 加入文件名
			const fileName = new TextEncoder().encode((message as File).name)
			// 文件名长度
			const lengthData = new Uint8Array([fileName.length])
			sendData = new Uint8Array([...typeData, ...lengthData, ...fileName, ...data])
		}

		if (this.cryptor) {
			// encrypt data if e2ee is enabled
			const encryptedData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: new Uint8Array(12) }, this.cryptor, sendData)
			sendData = new Uint8Array(encryptedData)
		}

		console.log('send message', sendData, type)
		console.log('send message, raw', data, type)
		// publish lossy data to the entire room
		room.localParticipant.publishData(sendData, DataPacket_Kind.RELIABLE)
	}
	initEvent() {
		const room = this.room
		room &&
			room
				.on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed)
				.on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed)
				.on(RoomEvent.ActiveSpeakersChanged, this.handleActiveSpeakerChange)
				.on(RoomEvent.Disconnected, this.handleDisconnect)
				.on(RoomEvent.LocalTrackPublished, this.handleLocalTrackPublished)
				.on(RoomEvent.TrackMuted, this.handleTrackMuted)
				.on(RoomEvent.TrackUnmuted, this.handleTrackUnmuted)
				.on(RoomEvent.DataReceived, this.handleMessageReceived)
	}
	async createTrack() {
		// publish local camera and mic tracks
		const room = this.room
		if (!room) return
		const { localParticipant } = room
		const data = JSON.stringify({
			userId: this.userId,
			username: this.username,
		})
		localParticipant.setMetadata(data)
		await localParticipant.setCameraEnabled(true)
		await localParticipant.setMicrophoneEnabled(true)
	}

	// restart camera track
	async restartCameraTrack() {
		const room = this.room
		if (!room) return
		const { localParticipant } = room
		await localParticipant.setCameraEnabled(true)
	}

	// create a screen share track
	async createScreenTrack() {
		const room = this.room
		if (!room) return
		const { localParticipant } = room
		await localParticipant.setScreenShareEnabled(true)
	}

	// stop screen share track
	async stopScreenTrack() {
		const room = this.room
		if (!room) return
		const { localParticipant } = room
		await localParticipant.setScreenShareEnabled(false)
	}

	// unpublish local camera and mic tracks
	async unpublishTrack(track: LocalTrack) {
		const room = this.room
		if (!room) return
		const { localParticipant } = room
		await localParticipant.unpublishTrack(track)
	}

	handleTrackSubscribed = (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
		this.emit('remote', {
			track,
			participant,
			isVideo: track.kind === Track.Kind.Video,
		})
	}

	handleTrackUnsubscribed = (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
		// remove tracks from all attached elements
		console.log('handleTrackUnsubscribed')
		track.detach()
		this.emit('quit', participant)
	}

	handleLocalTrackPublished = (track: LocalTrackPublication, participant: LocalParticipant) => {
		console.log('handleTrackSubscribed')
		this.emit('local', {
			track: track.track,
			participant,
			isVideo: track.track?.kind === Track.Kind.Video,
		})
	}

	handleActiveSpeakerChange = (speakers: Participant[]) => {
		// show UI indicators when participant is speaking
		this.emit('speakers', speakers)
	}

	handleDisconnect() {
		console.log('disconnected from room')
	}

	handleTrackMuted = (publication: TrackPublication, participant: Participant) => {
		this.emit('mute', publication, participant)
		console.log('handleTrackMuted', publication, participant)
	}

	handleTrackUnmuted = (publication: TrackPublication, participant: Participant) => {
		this.emit('unmute', publication, participant)
		console.log('handleTrackUnmuted', publication, participant)
	}

	handleMessage = (data: Uint8Array, participant?: RemoteParticipant) => {
		const type = data[0]

		console.log('handleMessage', data, type, participant)

		if (type === 0) {
			const decoder = new TextDecoder()
			const message = decoder.decode(data.slice(1))
			console.log('handleMessageReceived', message, type, participant)

			this.emit('message', message, type, participant)
		} else {
			const length = data[1]
			const filename = new TextDecoder().decode(data.slice(2, 2 + length))

			// 转换为File类型
			const file = new File([data.slice(2 + length)], filename)

			this.emit('message', file, type, participant)
			console.log('handleDataReceived', file, type, participant)
		}
	}

	handleMessageReceived = (data: Uint8Array, participant?: RemoteParticipant, kind?: DataPacket_Kind, topic?: any) => {
		// decrypt first
		if (this.cryptor) {
			crypto.subtle
				.decrypt({ name: 'AES-GCM', iv: new Uint8Array(12) }, this.cryptor, data)
				.then((res) => {
					data = new Uint8Array(res)
					// console.log('decrypt', data, this.cryptor)

					this.handleMessage(data, participant)
				})
				.catch((err) => {
					this.emit('message', '[消息解密失败]', 0, participant)

					console.error('failed to decrypt message', err)
				})
			return
		}

		this.handleMessage(data, participant)
	}
}
