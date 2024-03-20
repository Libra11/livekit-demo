<!--
 * @Author: Libra
 * @Date: 2023-03-07 14:15:32
 * @LastEditTime: 2023-08-15 16:55:28
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<div class="flex-c relative h-screen bg-black p-2">
		<video-container />
		<el-card class="h-full w-[30rem]" v-show="message">
			<message-container />
		</el-card>
	</div>
</template>

<script setup lang="ts">
import VideoContainer from '@/components/VideoContainer.vue'
import MessageContainer from '@/components/MessageContainer.vue'
import emitter from '@/utils/mitt'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const message = ref(false)
onMounted(() => {
	emitter.on('showMessage', (value: boolean) => {
		message.value = value
	})
})
onBeforeUnmount(() => {
	emitter.off('showMessage')
})
</script>

<style lang="scss" scoped>
:deep(.el-card__body) {
	@apply h-full;
}
</style>
