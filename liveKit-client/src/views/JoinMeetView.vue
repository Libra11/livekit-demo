<!--
 * @Author: Libra
 * @Date: 2023-05-26 13:49:57
 * @LastEditTime: 2023-08-07 18:29:03
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<div class="flex h-full w-full items-center justify-center">
		<el-form ref="form" :model="formData" label-width="0" class="flex w-80 flex-col items-center justify-center">
			<el-form-item label="会议号" label-width="80px" required>
				<el-input v-model="formData.roomId" placeholder="请输入会议号"></el-input>
			</el-form-item>
			<el-form-item label="入会密码" label-width="80px">
				<el-input v-model="formData.password" placeholder="请输入入会密码"></el-input>
			</el-form-item>
			<el-form-item label="加密密码" label-width="80px">
				<el-input v-model="formData.encryption" placeholder="请输入加密密码"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="join">加入房间</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo, type UserInfo } from '@/api/userInfo'
import { RoomStore } from '@/store/modules/room'

const router = useRouter()

let userInfo: UserInfo

onMounted(async () => {
	loadUserInfo()
})

const loadUserInfo = async () => {
	const res = await getUserInfo()
	if (res.code !== 200) {
		return
	}
	userInfo = res.data
	console.log(userInfo)
}

const formData = reactive({
	roomId: '',
	password: '',
	encryption: '',
})

const roomStore = RoomStore()

const join = () => {
	roomStore.setLogin(true)
	roomStore.setUserId(userInfo.id)
	roomStore.setRoomname(formData.roomId)
	roomStore.setPassword(formData.encryption)
	router.push({
		path: '/room',
	})
}
</script>
