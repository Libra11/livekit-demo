<template>
    <div>
        <video ref="videoPlayer" controls></video>
    </div>
</template>

<script setup lang="ts">
import Hls from 'hls.js';
import { onMounted, ref } from 'vue'

const videoRef = ref<HTMLMediaElement | null>(null);

onMounted(() => {
    initHlsPlayer();
});

const initHlsPlayer = () => {
    const videoPlayer = videoRef.value;

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource('https://secure-meet.oss-cn-beijing.aliyuncs.com/b.m3u8');
        hls.attachMedia(videoPlayer as HTMLMediaElement);
    } else if (videoPlayer?.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = 'https://secure-meet.oss-cn-beijing.aliyuncs.com/b.m3u8';
    } else {
        console.error('HLS not supported');
    }
};
</script>