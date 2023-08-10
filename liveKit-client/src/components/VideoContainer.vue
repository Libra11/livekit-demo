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
				<video-item :info="track" @click="moveItemToFirst(videos, index)"></video-item>
			</div>
		</div>
		<task-bar :video-track="localVideoTrack" :audio-track="localAudioTrack" :screen-track="localScreenTrack" :llk="llk" v-if="llk" />
		<div class="bar flex-c absolute top-[32%] left-2 z-10 mx-4 h-8 rounded-lg px-4 text-sm shadow-lg transition-all">
			<span>正在说话:</span>
			<span v-for="(item, index) in curSpeakers" :key="index">{{ item }}, </span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import type { LocalParticipant, LocalTrack, Participant, RemoteParticipant, RemoteTrack, Track, TrackPublication } from 'livekit-client'
import { useRoute } from 'vue-router'
import LibraLiveKit from '@/livekit'
import VideoItem from '@/components/VideoItem.vue'
import { LlkStore } from '@/store/modules/llk'
import { UserStore } from '@/store/modules/user'

interface IVideo {
	videoTrack: Track | null
	audioTrack: Track | null
	isAudioMute: boolean
	isVideoMute: boolean
	username: string
	userId: string
	isMe: boolean
}
let llk: LibraLiveKit | null = null
let videos: Ref<Array<IVideo>> = ref([])
let curSpeakers: Ref<Array<string>> = ref([])
let localVideoTrack: Ref<LocalTrack | null> = ref(null)
let localAudioTrack: Ref<LocalTrack | null> = ref(null)
let localScreenTrack: Ref<LocalTrack | null> = ref(null)

const route = useRoute()
const { roomname, username, userId: userid } = route.query
const userStore = UserStore()
userStore.setUserName(username as string)
onMounted(async () => {
	LlkEvents(createLibraLiveKit())
})

// create LibraLiveKit instance
const createLibraLiveKit = () => {
	llk = new LibraLiveKit({
		username: username as string,
		roomname: roomname as string,
		userId: userid as string,
	})
	llk.init()
	// store ll
	const llkStore = LlkStore()
	llkStore.setLlk(llk)
	return llk
}

// llk listeners
const LlkEvents = (llk: LibraLiveKit) => {
	llk.on('local', (info: { track: LocalTrack; participant: LocalParticipant; isVideo: Boolean }) => {
		if (info.isVideo) {
			const target = info.track.source === 'screen_share' ? localScreenTrack : localVideoTrack
			target.value = info.track
		} else {
			localAudioTrack.value = info.track
		}
		streamAddAndPlay(info.track, info.participant, info.isVideo)
	})
	llk.on('remote', async (info: { track: RemoteTrack; participant: RemoteParticipant; isVideo: Boolean }) => {
		streamAddAndPlay(info.track, info.participant, info.isVideo)
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
	llk.on('mute', (publication: TrackPublication, participant: Participant) => {
		const { userId } = JSON.parse(participant.metadata!)
		const user = videos.value.find((item) => item.userId === userId)
		if (user) {
			user[publication.kind === 'video' ? 'isVideoMute' : 'isAudioMute'] = true
		}
	})
	llk.on('unmute', (publication: TrackPublication, participant: Participant) => {
		const { userId } = JSON.parse(participant.metadata!)
		const user = videos.value.find((item) => item.userId === userId)
		if (user) {
			user[publication.kind === 'video' ? 'isVideoMute' : 'isAudioMute'] = false
		}
	})
}

// some one enter room, include myself
const streamAddAndPlay = (track: Track, participant: Participant, isVideo: Boolean) => {
	const { username, userId } = JSON.parse(participant.metadata!)
	let user = videos.value.find((item) => item.userId === userId)
	if (user) {
		user[isVideo ? 'videoTrack' : 'audioTrack'] = track
	} else {
		videos.value.push({
			username,
			userId: userId,
			videoTrack: isVideo ? track : null,
			audioTrack: isVideo ? null : track,
			isAudioMute: isVideo ? false : track.isMuted,
			isVideoMute: isVideo ? track.isMuted : false,
			isMe: userid === userId,
		})
	}
}

// update mute status

// move item to first
const moveItemToFirst = (arr: Array<IVideo>, index: number) => {
	const item = arr.splice(index, 1)
	arr.unshift(item[0])
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
