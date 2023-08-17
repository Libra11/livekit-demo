<!--
 * @Author: Libra
 * @Date: 2023-08-03 16:59:10
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<div class="h-full w-full">
		<div id="room" class="speech h-full w-full" v-if="videos.length">
			<grid-layout>
				<video-item v-for="(track, index) in videos" :key="track.userId" :info="track" @click="moveItemToFirst(videos, index)"></video-item>
			</grid-layout>
		</div>
		<task-bar :video-track="localVideoTrack" :audio-track="localAudioTrack" :screen-track="localScreenTrack" :llk="llk" v-if="llk" />
		<div class="bar flex-c absolute top-[32%] left-2 z-10 mx-4 h-8 rounded-lg px-4 text-sm shadow-lg transition-all">
			<span>正在说话:</span>
			<span v-for="(item, index) in curSpeakers" :key="index">{{ item }}, </span>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, type Ref } from 'vue'
import type { LocalParticipant, LocalTrack, Participant, RemoteParticipant, RemoteTrack, Track, TrackPublication } from 'livekit-client'
import { useRoute } from 'vue-router'
import LibraLiveKit from '@/livekit'
import VideoItem from '@/components/VideoItem.vue'
import GridLayout from './GridLayout.vue'
import { LlkStore } from '@/store/modules/llk'
import { UserStore } from '@/store/modules/user'
import emitter from '@/utils/mitt'

interface IVideo {
	screenTrack: Track | null
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
	llk.on('quit', (track: RemoteTrack, participant: RemoteParticipant) => {
		const isScreen = track.source === 'screen_share'
		const metadata = JSON.parse(participant.metadata!)
		videos.value = videos.value.filter((item) => isScreen ? item.userId !== `${metadata.userId}-screen` : item.userId !== metadata.userId)
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
  const { username, userId } = JSON.parse(participant.metadata!);
  const isScreen = track.source === 'screen_share';
  const user = videos.value.find((item) => item.userId === (isScreen ? `${userId}-screen` : userId));
  if (user) {
    if (isVideo) {
      user.videoTrack = isScreen ? null : track;
      user.screenTrack = isScreen ? track : null;
    } else {
      user.audioTrack = track;
    }
  } else {
    videos.value.push({
      username,
      userId: isScreen ? `${userId}-screen` : userId,
      videoTrack: isVideo ? (isScreen ? null : track) : null,
      screenTrack: isVideo ? (isScreen ? track : null) : null,
      audioTrack: isVideo ? null : track,
      isAudioMute: !isVideo && track.isMuted,
      isVideoMute: isVideo && track.isMuted,
      isMe: userid === userId,
    });
  }
}

// update mute status

// move item to first
const moveItemToFirst = (arr: Array<IVideo>, index: number) => {
	const item = arr.splice(index, 1)
	arr.unshift(item[0])
}

/**
 * layout control
 */
watch(
	()=> videos.value.length,
	() => {
		const layout = userStore.getLayout
		if (layout === 'EquallyDivided') {
			emitter.emit('equallyDivided', getEquallyDividedClass())
		}
	}
)
watch(
	() => userStore.getLayout,
	() => {
		const layout = userStore.getLayout
		if (layout === 'EquallyDivided') {
			emitter.emit('equallyDivided', getEquallyDividedClass())
		}
	}
)
const getEquallyDividedClass = () => {
  const length = videos.value.length;
  return length === 1 ? "grid-one-one"
    : length === 2 ? "grid-one-two"
    : length === 3 ? "header-foot-foot"
    : length === 4 ? "grid-two-two"
    : length >= 5 && length <= 6 ? "grid-two-three"
    : length >= 7 && length <= 9 ? "grid-three-three"
    : "grid-three-four";
};
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
.bar {
	left: calc(50% - 27rem);
	background-color: rgba(29, 30, 31, 0.5);
}
</style>
