<!--
 * @Author: Libra
 * @Date: 2023-03-07 14:15:32
 * @LastEditTime: 2023-08-01 14:31:01
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<div class="flex-c relative h-screen bg-black p-2" @mousemove="showHeader">
		<div id="room" class="h-full w-full speech" v-if="videos.length">
			<div class="grid-box-item" v-for="(track, index) in videos" :key="track.userId">
				<video-item :id="track.userId" :username="track.username" @click="moveItemToFirst(videos, index)" :isMe="track.isMe"></video-item>
			</div>
			<div class="bar absolute bottom-6 z-10 mx-4 w-0 rounded-lg shadow-lg h-14 transition-all" :class="{ visible: headerVisible }">
				ddd
			</div>
		</div>
		<div class="bar absolute top-[32%] left-2  z-10 mx-4  rounded-lg shadow-lg h-8 transition-all px-4 flex-c text-sm">
			<span>正在说话:</span>
			<span v-for="(item, index) in curSpeakers" :key="index">{{ item }}, </span>
		</div>
		<div class="h-full w-[30rem]">
			<el-card class="h-full"> 
				<el-button type="info" plain>
					<i class="iconfont icon-shexiangtou" @click="muteCamera"></i>
					<i class="iconfont icon-shexiangtou_guanbi" @click="unMuteCamera"></i>
				</el-button>
			</el-card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted, reactive, nextTick, type Ref } from 'vue'
import type { LocalParticipant, LocalTrack, RemoteParticipant, RemoteTrack } from 'livekit-client'
import { useRoute } from 'vue-router'
import LibraLiveKit from '@/livekit'
import VideoItem from '@/components/VideoItem.vue'

const headerVisible = ref(false)
const mouseTimer: any = ref(null)

interface IVideo {
	stream: MediaStream
	username: string
	userId: string
	isMe: boolean
}
let videos: Array<IVideo> = reactive([])
let curSpeakers: Ref<Array<string>> = ref([])
let localTrack: LocalTrack | null = null

const showHeader = () => {
	clearTimeout(mouseTimer.value)
	headerVisible.value = true
	mouseTimer.value = setTimeout(() => {
		headerVisible.value = false
	}, 2000)
}

watch(headerVisible, (value) => {
	if (value) {
		document.body.style.cursor = 'default'
	} else {
		document.body.style.cursor = 'none'
	}
})

const route = useRoute()
const { roomname, username, userId } = route.query
onMounted(async () => {
	const llk = new LibraLiveKit({
		username: username as string,
		roomname: roomname as string,
		userId: userId as string,
	})
	llk.init()
	llk.on('local', async (info: { track: LocalTrack; participant: LocalParticipant }) => {
		console.log('local', info)
		localTrack = info.track
		listenLocalTrackEvent(localTrack)
		const { username, userId } = JSON.parse(info.participant.metadata!)
		const stream = info.track.mediaStream
		if (!stream) return
		videos.push({
			username,
			userId,
			stream,
			isMe: true
		})
		await nextTick()
		// play stream
		const ele = document.querySelector(`#v${userId}`) as HTMLVideoElement
		ele.autoplay = true
		ele.srcObject = stream
	})
	llk.on('remote', async (info: { track: RemoteTrack; participant: RemoteParticipant }) => {
		const { username, userId } = JSON.parse(info.participant.metadata!)
		const stream = info.track.mediaStream
		if (!stream) return
		videos.push({
			username,
			userId,
			stream,
			isMe: false
		})
		await nextTick()
		// play stream
		const ele = document.querySelector(`#v${userId}`) as HTMLVideoElement
		ele.autoplay = true
		ele.srcObject = stream
	})
	llk.on('quit', (participant: RemoteParticipant) => {
		const metadata = JSON.parse(participant.metadata!)
		videos = videos.filter((item) => item.userId !== metadata.userId)
	})
	llk.on('speakers',  (speakers: Array<RemoteParticipant>) => {
		const res = []
		for (const item of speakers) {
			const metadata = JSON.parse(item.metadata!)
			res.push(metadata.username)
			curSpeakers.value = res
			setTimeout(() => {
				curSpeakers.value = []
			}, 2000)
		}
	})
})

onUnmounted(() => {
	clearTimeout(mouseTimer.value)
})

// 将数组元素移动到第一个
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
	track.on('muted', (qqq) => {
		console.log('muted', qqq)
	})
	track.on('unmuted', (track: LocalTrack) => {
		console.log('unmuted', track)
		localTrack = track
		const ele = document.querySelector(`#v${userId}`) as HTMLVideoElement
		ele.autoplay = true
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
