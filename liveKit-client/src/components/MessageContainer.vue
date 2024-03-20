<!--
 * @Author: Libra
 * @Date: 2023-08-09 11:25:05
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<div class="flex h-full w-full flex-col p-2">
		<div class="text-lg font-bold">聊天</div>
		<div class="flex-1 overflow-auto">
			<message-item :message="item" v-for="item in messageList" />
		</div>
		<el-upload ref="uploadRef" v-model:file-list="fileList" class="upload" action="#" drag multiple :auto-upload="false" :on-change="handleChange">
			<el-icon class="el-icon--upload"><upload-filled /></el-icon>
			<div class="el-upload__text">拖拽文件或 <em>点击这里</em></div>
		</el-upload>
		<div class="flex-c">
			<el-input v-model="message" placeholder="请输入内容" />
			<el-button type="primary" @click="sendMessage">发送</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { LlkStore } from '@/store/modules/llk'
import type { RemoteParticipant } from 'livekit-client'
import { onMounted, ref, watch, type Ref } from 'vue'
import messageItem from './messageItem.vue'
import { UserStore } from '@/store/modules/user'
import type { UploadInstance, UploadProps, UploadUserFile } from 'element-plus'

const llkStore = LlkStore()
let llk: any
interface MessageItem {
	content: string | File
	name: string
	isMe: boolean
	type: number
}
const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadUserFile[]>([])
const rawFileList = ref<File[]>([])
const message = ref('')
const messageList: Ref<MessageItem[]> = ref(JSON.parse(sessionStorage.getItem('messageList') || '[]'))
const userStore = UserStore()

const isImage = (file: File) => {
	const type = file.type
	return type.includes('image')
}

const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
	console.log('uploadFile', uploadFile)
	console.log('uploadFiles', uploadFiles)
	console.log('fileLIdt', fileList.value)
	// 将uploadFiles存储到rawFileList中
	rawFileList.value.splice(0, rawFileList.value.length)
	uploadFiles.forEach((file) => {
		rawFileList.value.push(file.raw as File)
	})
}

const sendMessage = () => {
	let type = 0

	console.log('文件长度', rawFileList.value.length)
	// 获取uploadRef中文件
	if (rawFileList.value.length) {
		rawFileList.value.forEach((file) => {
			if (isImage(file)) {
				type = 1
			} else {
				type = 2
			}
			llk?.sendMessage(file, type)
			messageList.value.push({
				content: file,
				name: userStore.getUserName,
				isMe: true,
				type: type,
			})
			console.log('发送文件', file, type)
		})
		rawFileList.value.splice(0, rawFileList.value.length)
	}

	if (!message.value) return

	llk?.sendMessage(message.value, 0)
	messageList.value.push({
		content: message.value,
		name: userStore.getUserName,
		isMe: true,
		type: 0,
	})
	message.value = ''
}
onMounted(() => {
	llk = llkStore.getLlk
	llk?.on('message', (message: string | File, type: number, participant?: RemoteParticipant) => {
		console.log('收到消息', participant, message, type)
		const { username } = JSON.parse(participant?.metadata || '{}')

		if (type === 0) {
			const value = message as string
			messageList.value.push({
				content: value.replace(/"/g, ''),
				name: username,
				isMe: false,
				type: type,
			})
		} else {
			const value = message as File
			messageList.value.push({
				content: value,
				name: username,
				isMe: false,
				type: type,
			})
		}
	})
})
watch(
	() => messageList.value.length,
	() => {
		// store to session storage
		console.log('hahahah')
		// sessionStorage.setItem('messageList', JSON.stringify(messageList.value))
	}
)
</script>

<style lang="scss" scoped></style>
