<!--
 * @Author: Libra
 * @Date: 2023-05-26 18:22:36
 * @LastEditTime: 2023-08-15 17:40:15
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<el-card class="grid-box-item relative h-full w-full cursor-pointer">
		<div class="flex-c absolute top-2 left-2 rounded-full bg-[rgba(255,255,255,0.5)] px-2 text-sm text-slate-700 backdrop-blur-sm" v-if="!info.isMe">
			<div>
				<i class="iconfont icon-jingyin text-primary-color" v-if="info.isAudioMute"></i>
				<i class="iconfont icon-maikefeng2 text-success-color" v-else></i>
			</div>
			<div>
				<i class="iconfont icon-shexiangtou_guanbi text-primary-color" v-if="info.isVideoMute"></i>
				<i class="iconfont icon-shexiangtou text-success-color" v-else></i>
			</div>
			<span class="ml-1">{{ info.username }}</span>
		</div>
		<div class="absolute top-2 left-2 rounded-full bg-primary-color px-4 text-sm" v-else>本人</div>
		<video class="w-full" :id="info.userId" />
	</el-card>
</template>

<script setup lang="ts">
import type { Track } from 'livekit-client'
import { onBeforeMount, onMounted, watch } from 'vue'

interface Info {
	userId: string
	username: string
	isMe: boolean
	isAudioMute: boolean
	isVideoMute: boolean
	videoTrack: Track | null
	audioTrack: Track | null
}

const props = defineProps<{
	info: Info
}>()

let ele: HTMLMediaElement | null = null

watch(
	() => props.info.videoTrack,
	(newVal, oldVal) => {
		ele && newVal?.attach(ele)
	}
)

watch(
	() => props.info.audioTrack,
	(newVal, oldVal) => {
		newVal?.attach()
	}
)

onMounted(() => {
	const { userId, videoTrack, audioTrack } = props.info
	ele = document.getElementById(userId) as HTMLMediaElement
	ele && videoTrack?.attach(ele)
	audioTrack?.attach()
})

onBeforeMount(() => {
	const { videoTrack, audioTrack } = props.info
	ele && videoTrack?.detach(ele)
	audioTrack?.detach()
})
</script>

<style scoped>
video {
	width: 100%;
	height: 100%;
}
</style>
