<!--
 * @Author: Libra
 * @Date: 2023-03-07 14:15:32
 * @LastEditTime: 2023-08-04 12:20:20
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<div class="flex-c relative h-screen bg-black p-2">
		<video-container />
		<el-card class="h-full w-[30rem]">
			聊天区域
		</el-card>
	</div>
</template>

<script setup lang="ts">
import VideoContainer from '@/components/VideoContainer.vue';
</script>

<style lang="scss" scoped>
</style>
