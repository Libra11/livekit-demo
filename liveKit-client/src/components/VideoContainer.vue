<!--
 * @Author: Libra
 * @Date: 2023-08-03 16:59:10
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<div class="h-full w-full">
		<div id="room" class="speech h-full w-full" v-if="videos.length">
			<div class="grid-box-item" v-for="(track, index) in videos" :key="track.userId">
				<video-item :id="track.userId" :username="track.username" @click="moveItemToFirst(videos, index)" :isMe="track.isMe"></video-item>
			</div>
			<div class="bar absolute bottom-6 z-10 mx-4 h-14 w-0 rounded-lg shadow-lg transition-all">
				<!-- will replace use taskBar.vue components -->
				<el-card class="h-full w-72">
					<drop-button
						muteIcon="shexiangtou_guanbi"
						unmuteIcon="shexiangtou"
						:muteClick="muteCamera"
						:unmuteClick="unMuteCamera"
						:devices="cameraList"
						:switchDevice="switchCamera"
					/>
				</el-card>
			</div>
		</div>
		<div class="bar flex-c absolute top-[32%] left-2 z-10 mx-4 h-8 rounded-lg px-4 text-sm shadow-lg transition-all">
			<span>正在说话:</span>
			<span v-for="(item, index) in curSpeakers" :key="index">{{ item }}, </span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted, reactive, nextTick, type Ref } from 'vue'
import type { LocalParticipant, LocalTrack, LocalVideoTrack, Participant, RemoteParticipant, RemoteTrack, Track } from 'livekit-client'
import { useRoute } from 'vue-router'
import LibraLiveKit from '@/livekit'
import VideoItem from '@/components/VideoItem.vue'
import DropButton from './DropButton.vue'

interface IVideo {
	stream: MediaStream
	username: string
	userId: string
	isMe: boolean
}
let llk: LibraLiveKit | null = null
let videos: Ref<Array<IVideo>> = ref([])
let curSpeakers: Ref<Array<string>> = ref([])
let localTrack: LocalTrack | null = null

const route = useRoute()
const { roomname, username, userId } = route.query
onMounted(async () => {
	LlkEvents(createLibraLiveKit())
	await getDevices()
})

// create LibraLiveKit instance
const createLibraLiveKit = () => {
	llk = new LibraLiveKit({
		username: username as string,
		roomname: roomname as string,
		userId: userId as string,
	})
	llk.init()
	return llk
}

// llk listeners
const LlkEvents = (llk: LibraLiveKit) => {
	llk.on('local', async (info: { track: LocalTrack; participant: LocalParticipant }) => {
		localTrack = info.track
		listenLocalTrackEvent(localTrack)
		await streamAddAndPlay(info.track, info.participant)
	})
	llk.on('remote', async (info: { track: RemoteTrack; participant: RemoteParticipant }) => {
		await streamAddAndPlay(info.track, info.participant)
	})
	llk.on('quit', (participant: RemoteParticipant) => {
		const metadata = JSON.parse(participant.metadata!)
		videos.value = videos.value.filter((item) => item.userId !== metadata.userId)
	})
	llk.on('speakers', (speakers: Array<RemoteParticipant>) => {
		const res = speakers.map((item) => JSON.parse(item.metadata!).username)
		curSpeakers.value = res
		setTimeout(() => {
			curSpeakers.value = []
		}, 2000)
	})
}

// some one enter room, include myself
const streamAddAndPlay = async (track: Track, participant: Participant) => {
	const { username, userId: Id } = JSON.parse(participant.metadata!)
	const stream = track.mediaStream
	if (!stream) return
	const newUser = ref({
		username,
		userId: Id,
		stream,
		isMe: Id === userId,
	})
	videos.value.push(newUser.value)
	await nextTick()
	const ele = document.querySelector(`#v${Id}`) as HTMLVideoElement
	console.log(ele, videos, `v${Id}`)
	setTimeout(() => {
		console.log(ele)
	}, 1000)
	ele.autoplay = true
	ele.srcObject = stream
}

// move item to first
const moveItemToFirst = (arr: Array<IVideo>, index: number) => {
	const item = arr.splice(index, 1)
	arr.unshift(item[0])
}

const muteCamera = () => {
	localTrack?.mute()
}
const unMuteCamera = () => {
	localTrack?.unmute()
}

const listenLocalTrackEvent = (track: LocalTrack) => {
	track.on('unmuted', (track: LocalTrack) => {
		console.log('unmuted', track)
		localTrack = track
		const ele = document.querySelector(`#v${userId}`) as HTMLVideoElement
		ele.srcObject = track.mediaStream!
	})
}

/**
 * devices
 */
const cameraList = ref<Array<MediaDeviceInfo>>([])
// get devices
const getDevices = async () => {
	const devices = await llk?.getLocalDevices('video')
	if (!devices) return
	cameraList.value = devices
}
// switch camera
const switchCamera = async (device: MediaDeviceInfo) => {
	console.log(JSON.parse(JSON.stringify(localTrack)))
	await llk?.switchLocalDevice('video', device.deviceId)
	if (!localTrack) return
	await (localTrack as LocalVideoTrack).restartTrack()
	const ele = document.querySelector(`#v${userId}`) as HTMLVideoElement
	ele.srcObject = localTrack.mediaStream!
}
</script>

<style lang="scss" scoped>
.visible {
	@apply w-96;
	transition: all 0.5s;
}
:deep(.el-card__body) {
	padding: 0 !important;
	width: 100%;
	height: 100%;
}
.speech {
	display: grid;
	grid-template-rows: repeat(4, 25%);
	grid-template-columns: unset;
	grid-auto-columns: 25%;
	overflow: auto;
	.grid-box-item {
		padding: 0.25rem;
	}
	.grid-box-item:nth-child(1) {
		grid-row: 2 / 5;
		grid-column: 1 / 5;
	}
}
.bar {
	left: calc(50% - 27rem);
	background-color: rgba(29, 30, 31, 0.5);
}
</style>
