<!--
 * @Author: Libra
 * @Date: 2023-05-26 13:49:57
 * @LastEditTime: 2023-08-07 18:29:03
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<div class="flex h-screen flex-col items-center justify-center">
		<div class="w-80">
			<el-form ref="form" :model="formData" label-width="0">
				<el-form-item>
					<el-input v-model="formData.roomId" placeholder="请输入房间号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="join">加入房间</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getUserInfo, type UserInfo } from '@/api/userInfo'

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
})

const join = () => {
	router.push({
		path: '/about',
		query: {
			username: userInfo.name,
			roomname: formData.roomId,
			userId: userInfo.id,
			login: 'true',
		},
	})
}
</script>
