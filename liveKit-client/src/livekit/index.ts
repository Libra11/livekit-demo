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
	type E2EEOptions,
} from 'livekit-client'
import { EventEmitter } from 'events'
import { getToken } from '@/api/token'
import { WEBSOCKET_URL } from '@/config/config'
import E2EEWorker from '../e2ee/worker/e2ee.worker?worker'

interface IInit {
	userId: string
	username: string
	roomname: string
}
export default class LibraLiveKit extends EventEmitter {
	private username: string
	private roomname: string
	private userId: string
	private room: Room | null = null
	constructor({ username, roomname, userId }: IInit) {
		super()
		this.username = username
		this.roomname = roomname
		this.userId = userId
	}
	async init() {
		await this.createRoom()
		this.initEvent()
		await this.joinRoom()
		await this.createTrack()
	}

	async createRoom() {
		const e2eeEnabled = false
		const keyProvider = new ExternalE2EEKeyProvider()
		const cryptoKey = 'password'
		keyProvider.setKey(cryptoKey)

		this.room = new Room({
			adaptiveStream: true,
			dynacast: true,
			videoCaptureDefaults: {
				resolution: VideoPresets.h720.resolution,
			},
			e2ee: e2eeEnabled ? { keyProvider, worker: new E2EEWorker() } : undefined,
		})
		if (e2eeEnabled) {
			await this.room.setE2EEEnabled(true)
		}
	}
	async joinRoom() {
		const res = await getToken(this.userId, this.roomname)
		const room = this.room
		if (res.code === 200) {
			if (!room) return
			await room.connect(WEBSOCKET_URL, res.data)
			console.log('connected to room', room.name)
		}
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
	sendMessage(message: string) {
		const room = this.room
		if (!room) return
		const strData = JSON.stringify(message)
		const encoder = new TextEncoder()
		// publishData takes in a Uint8Array, so we need to convert it
		const data = encoder.encode(strData)
		// publish lossy data to the entire room
		room.localParticipant.publishData(data, DataPacket_Kind.LOSSY)
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

	handleMessageReceived = (data: Uint8Array, participant?: RemoteParticipant, kind?: DataPacket_Kind, topic?: any) => {
		const decoder = new TextDecoder()
		const message = decoder.decode(data)
		this.emit('message', message, participant)
		console.log('handleMessageReceived', message, participant)
	}
}
