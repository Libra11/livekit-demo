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
					<el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formData.room" placeholder="请输入房间号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="formData.password" placeholder="请输入加密密码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="login">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'

const router = useRouter()
const userId = uuidv4()

const formData = reactive({
	username: '',
	room: '',
	password: '',
})

const login = () => {
	router.push({
		path: '/about',
		query: {
			username: formData.username,
			roomname: formData.room,
			userId,
			password: formData.password,
		},
	})
}
</script>
