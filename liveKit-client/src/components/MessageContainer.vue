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

const llkStore = LlkStore()
let llk: any
interface MessageItem {
	content: string
	name: string
	isMe: boolean
}
const message = ref('')
const messageList: Ref<MessageItem[]> = ref(JSON.parse(sessionStorage.getItem('messageList') || '[]'))
const userStore = UserStore()
const sendMessage = () => {
	llk?.sendMessage(message.value)
	messageList.value.push({
		content: message.value,
		name: userStore.getUserName,
		isMe: true,
	})
	message.value = ''
}
onMounted(() => {
	llk = llkStore.getLlk
	llk?.on('message', (message: string, participant?: RemoteParticipant) => {
		console.log('收到消息', message, participant)
		const { username } = JSON.parse(participant?.metadata || '{}')
		messageList.value.push({
			content: message.replace(/"/g, ''),
			name: username,
			isMe: false,
		})
	})
})
watch(
	() => messageList.value.length,
	() => {
		// store to session storage
		console.log('hahahah')
		sessionStorage.setItem('messageList', JSON.stringify(messageList.value))
	}
)
</script>

<style lang="scss" scoped></style>
