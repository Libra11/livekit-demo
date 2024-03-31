<!--
 * @Author: Libra
 * @Date: 2023-08-09 11:25:47
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<div class="">
		<div class="p-1" v-if="!message.isMe">
			<div class="text-xs text-blue-400">{{ message.name }}</div>
			<!-- 展示图片 -->
			<div class="p-1" v-if="message.type === 1">
				<img class="message-image" :src="loadImage(message.content as File)" :alt="(message.content as File).name" />
			</div>
			<!-- 展示文件 -->
			<div class="file-download-button" v-else-if="message.type === 2" @click="download(message.content as File)">
				<el-icon class="file-icon" size="40"><Document /></el-icon>
				<div class="file-name">{{ (message.content as File).name }}</div>
			</div>
			<!-- 展示文字 -->
			<div v-else class="break-words">{{ message.content }}</div>
		</div>
		<div class="p-1 text-right" v-else-if="message.isMe">
			<div class="text-xs text-red-400">{{ message.name }}</div>
			<div class="p-1" v-if="message.type === 1">
				<img class="message-image right-image" :src="loadImage(message.content as File)" :alt="(message.content as File).name" />
			</div>
			<!-- 展示文件 -->
			<div class="file-download-button" v-else-if="message.type === 2" @click="download(message.content as File)">
				<el-icon class="file-icon" size="40"><Document /></el-icon>
				<div class="file-name">{{ (message.content as File).name }}</div>
			</div>
			<!-- 展示文字 -->
			<div v-else class="break-words">{{ message.content }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Document } from '@element-plus/icons-vue'
interface Message {
	name: string
	content: string | File
	isMe: boolean
	type: number
}

const loadImage = (file: File) => {
	return URL.createObjectURL(file)
}

const download = (file: File) => {
	// 创建一个新的 URL 对象，指向用户选择的文件
	const url = URL.createObjectURL(file)
	// 创建一个 <a> 元素
	const downloadLink = document.createElement('a')
	// 设置 <a> 元素的 href 属性为文件的 URL
	downloadLink.href = url
	// 设置 <a> 元素的 download 属性为文件名
	downloadLink.download = file.name
	// 将 <a> 元素添加到 DOM 中
	document.body.appendChild(downloadLink)
	// 模拟点击下载链接
	downloadLink.click()
	// 从 DOM 中移除 <a> 元素
	URL.revokeObjectURL(url)
	document.body.removeChild(downloadLink)
}

defineProps<{
	message: Message
}>()
</script>

<style lang="scss" scoped>
.file-download-button {
	display: inline-block;
	padding: 10px 10px;
	border: 1px solid #007bff;
	background-color: #007bff;
	color: white;
	text-align: center;
	text-decoration: none;
	cursor: pointer;
	border-radius: 5px;
	// margin: 10px 0;
}
.file-download-button:hover {
	background-color: #0056b3;
}
// .file-icon {
// 	width: 50px;
// 	height: 50px;
// 	margin-right: 10px;
// }
.file-name {
	flex-grow: 1;
	font-size: 12px;
}

.message-image {
	width: 100px;
}

.right-image {
	margin-left: auto;
	display: block;
}
</style>
