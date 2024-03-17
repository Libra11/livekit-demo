<template>
    <div>
        <video ref="videoPlayer" controls></video>
    </div>
</template>

<script setup lang="ts">
import Hls from 'hls.js';
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute()
const {url} = route.query

const videoPlayer = ref<HTMLMediaElement | null>(null);

onMounted(() => {
    initHlsPlayer();
});

const initHlsPlayer = () => {

    if (Hls.isSupported()) {
        const hls = new Hls({debug: true});
        const videoElement = videoPlayer.value as HTMLMediaElement;
        hls.loadSource(url as string);
        hls.attachMedia(videoElement);
        console.log('HLS supported')
    } else {
        console.error('HLS not supported');
    }
};
</script>