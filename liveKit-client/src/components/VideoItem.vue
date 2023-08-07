<!--
 * @Author: Libra
 * @Date: 2023-05-26 18:22:36
 * @LastEditTime: 2023-08-07 10:24:38
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<el-card class="relative h-full w-full cursor-pointer">
		<div class="flex-c absolute top-2 left-2 rounded-full bg-[rgba(255,255,255,0.5)] px-2 text-sm text-slate-700 backdrop-blur-sm" v-if="!isMe">
			<i class="iconfont icon-maikefeng text-primary-color" v-if="!isSpeaking"></i>
			<i class="iconfont icon-maikefeng1 text-success-color" v-else></i>
			<span class="ml-1">{{ username }}</span>
		</div>
		<div class="absolute top-2 left-2 rounded-full bg-primary-color px-4 text-sm" v-else>本人</div>
		<video class="w-full" :id="`v${id.toString()}`" />
	</el-card>
</template>

<script setup lang="ts">
import type { Track } from 'livekit-client'
import { onBeforeMount, onMounted, type PropType } from 'vue'

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	isMe: {
		type: Boolean,
		required: true,
	},
	isSpeaking: {
		type: Boolean,
		default: false,
	},
	track: {
		type: Object as PropType<Track>,
		required: true,
	},
})

let ele: HTMLMediaElement | null = null

onMounted(() => {
	ele = document.getElementById(`v${props.id.toString()}`) as HTMLMediaElement
	ele && props.track.attach(ele)
})

onBeforeMount(() => {
	ele && props.track.detach(ele)
})
</script>

<style scoped>
video {
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>
