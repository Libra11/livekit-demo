<!--
 * @Author: Libra
 * @Date: 2023-05-26 13:49:57
 * @LastEditTime: 2023-08-07 18:29:03
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<div class="loading-container">
		<div class="loading-spinner"></div>
		<p>正在加入...</p>
	</div>
</template>

<style scoped>
.loading-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100vh;
}

.loading-spinner {
	border: 4px solid rgba(0, 0, 0, 0.1);
	border-top: 4px solid #3498db;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>

<script lang="ts" setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getUserInfo, type UserInfo } from '@/api/userInfo'
import { getMeetByLink } from '@/api/meet'

const router = useRouter()
const route = useRoute()

let userInfo: UserInfo
let link = route.params.link as string
let roomId: string

onMounted(async () => {
	await loadUserInfo()
	await loadRoomId()
	if (userInfo && roomId) {
		join()
	}
})

const loadUserInfo = async () => {
	const res = await getUserInfo()
	if (res.code !== 200) {
		return
	}
	userInfo = res.data
}

const loadRoomId = async () => {
	const res = await getMeetByLink(link)
	if (res.code !== 200) {
		return
	}

	roomId = res.data.id.toString()
}

const join = () => {
	router.push({
		path: '/about',
		query: {
			username: userInfo.name,
			roomname: roomId,
			userId: userInfo.id,
		},
	})
}
</script>
