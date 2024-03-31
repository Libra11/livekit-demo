<template>
	<div>
		<video ref="videoPlayer" controls class="full-screen-video"></video>
	</div>
</template>

<script setup lang="ts">
import Hls from 'hls.js'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { ReplayStore } from '@/store/modules/replay'

const replayStore = ReplayStore()

const route = useRoute()
let { url } = route.query
if (!url) {
	url = replayStore.getUrl
}

const videoPlayer = ref<HTMLMediaElement | null>(null)

onMounted(() => {
	initHlsPlayer()
})

const initHlsPlayer = () => {
	if (Hls.isSupported()) {
		const hls = new Hls({ debug: true })
		const videoElement = videoPlayer.value as HTMLMediaElement
		hls.loadSource(url as string)
		hls.attachMedia(videoElement)
		console.log('HLS supported')
	} else {
		console.error('HLS not supported')
	}
}
</script>

<style scoped>
.full-screen-video {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>
