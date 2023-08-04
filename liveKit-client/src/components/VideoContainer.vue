<!--
 * @Author: Libra
 * @Date: 2023-08-03 16:59:10
 * @LastEditors: Libra
 * @Description: 
-->
<template>
  <div class="w-full h-full">
    <div id="room" class="h-full w-full speech" v-if="videos.length">
			<div class="grid-box-item" v-for="(track, index) in videos" :key="track.userId">
				<video-item :id="track.userId" :username="track.username" @click="moveItemToFirst(videos, index)" :isMe="track.isMe"></video-item>
			</div>
			<div class="bar absolute bottom-6 z-10 mx-4 w-0 rounded-lg shadow-lg h-14 transition-all">
				<el-card class="h-full w-72"> 
					<el-button type="info" plain>
						<i class="iconfont icon-shexiangtou" @click="muteCamera">关闭摄像头</i>
					</el-button>
					<el-button type="info" plain>
						<i class="iconfont icon-shexiangtou_guanbi" @click="unMuteCamera">打开摄像头</i>
					</el-button>
				</el-card>
			</div>
		</div>
		<div class="bar absolute top-[32%] left-2  z-10 mx-4  rounded-lg shadow-lg h-8 transition-all px-4 flex-c text-sm">
			<span>正在说话:</span>
			<span v-for="(item, index) in curSpeakers" :key="index">{{ item }}, </span>
		</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted, reactive, nextTick, type Ref } from 'vue'
import type { LocalParticipant, LocalTrack, Participant, RemoteParticipant, RemoteTrack, Track } from 'livekit-client'
import { useRoute } from 'vue-router'
import LibraLiveKit from '@/livekit'
import VideoItem from '@/components/VideoItem.vue'

const mouseTimer: any = ref(null)

interface IVideo {
	stream: MediaStream
	username: string
	userId: string
	isMe: boolean
}
let videos: Ref<Array<IVideo>> = ref([])
let curSpeakers: Ref<Array<string>> = ref([])
let localTrack: LocalTrack | null = null

const route = useRoute()
const { roomname, username, userId } = route.query
onMounted(() => {
	LlkEvents(createLibraLiveKit())
})

onUnmounted(() => {
	clearTimeout(mouseTimer.value)
})

// create LibraLiveKit instance
const createLibraLiveKit = () => {
	const llk = new LibraLiveKit({
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
	llk.on('speakers',  (speakers: Array<RemoteParticipant>) => {
		const res = speakers.map((item) => JSON.parse(item.metadata!).username);
		curSpeakers.value = res;
		setTimeout(() => {
			curSpeakers.value = [];
		}, 2000);
	})
}

// some one enter room, include myself
const streamAddAndPlay = async (track: Track, participant: Participant) => {
	const {username, userId: Id } = JSON.parse(participant.metadata!)
	const stream = track.mediaStream
	if (!stream) return
	const newUser = ref({
		username,
		userId: Id,
		stream,
		isMe: Id === userId
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
