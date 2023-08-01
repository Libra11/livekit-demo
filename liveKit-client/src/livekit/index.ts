/*
 * @Author: Libra
 * @Date: 2023-05-26 16:52:33
 * @LastEditTime: 2023-07-26 13:43:44
 * @LastEditors: Libra
 * @Description:
 */
import fetch from '@/request'
import {
	LocalParticipant,
	LocalTrackPublication,
	Participant,
	RemoteParticipant,
	RemoteTrack,
	RemoteTrackPublication,
	Room,
	RoomEvent,
	Track,
	VideoPresets,
} from 'livekit-client'
import { EventEmitter } from 'events'

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
		this.room = new Room({
			adaptiveStream: true,
			dynacast: true,
			videoCaptureDefaults: {
				resolution: VideoPresets.h720.resolution,
			},
		})
	}
	async joinRoom() {
		let res = await fetch<string>(`/token?identity=${this.userId}&roomName=${this.roomname}`)
		if (res.code === 200) {
			if (!this.room) return
			await this.room.connect('ws://127.0.0.1:7880', res.data)
			console.log('connected to room', this.room.name)
		}
	}
	async leaveRoom() {
		this.room && this.room.disconnect()
	}
	initEvent() {
		this.room &&
			this.room
				.on(RoomEvent.TrackSubscribed, this.handleTrackSubscribed)
				.on(RoomEvent.TrackUnsubscribed, this.handleTrackUnsubscribed)
				.on(RoomEvent.ActiveSpeakersChanged, this.handleActiveSpeakerChange)
				.on(RoomEvent.Disconnected, this.handleDisconnect)
				.on(RoomEvent.LocalTrackPublished, this.handleLocalTrackPublished)
				.on(RoomEvent.LocalTrackUnpublished, this.handleLocalTrackUnpublished)
	}
	async createTrack() {
		// publish local camera and mic tracks
		if (!this.room) return
		const data = JSON.stringify({
			userId: this.userId,
			username: this.username,
		})
		this.room.localParticipant.setMetadata(data)
		this.room.localParticipant.setName(this.username)
		await this.room.localParticipant.setCameraEnabled(true)
		await this.room.localParticipant.setMicrophoneEnabled(true)
	}

	handleTrackSubscribed = (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
		if (track.kind === Track.Kind.Video) {
			// attach it to a new HTMLVideoElement or HTMLAudioElement
			console.log('handleTrackSubscribed')
			this.emit('remote', {
				track,
				participant,
			})
		}
		if (track.kind === Track.Kind.Audio) {
			// track.attach()
		}
	}

	handleTrackUnsubscribed = (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
		// remove tracks from all attached elements
		console.log('handleTrackUnsubscribed')
		track.detach()
		this.emit('quit', participant)
	}

	handleLocalTrackPublished = (track: LocalTrackPublication, participant: LocalParticipant) => {
		if (track.track?.kind === Track.Kind.Video) {
			// attach it to a new HTMLVideoElement or HTMLAudioElement
			console.log('handleTrackSubscribed')
			this.emit('local', {
				track: track.track,
				participant,
			})
		}
		if (track.track?.kind === Track.Kind.Audio) {
			track.track?.attach()
		}
	}

	handleLocalTrackUnpublished = (track: LocalTrackPublication, participant: LocalParticipant) => {
		track.track?.detach()
	}

	handleActiveSpeakerChange = (speakers: Participant[]) => {
		// show UI indicators when participant is speaking
		this.emit('speakers', speakers)
	}

	handleDisconnect() {
		console.log('disconnected from room')
	}
}
