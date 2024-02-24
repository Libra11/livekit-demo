<template>
	<div class="flex h-screen flex-col p-5">
		<div class="w-80">
			<el-descriptions title="用户信息">
				<el-descriptions-item label="用户名">{{ userInfo.name }}</el-descriptions-item>
				<el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
			</el-descriptions>
			<el-button type="primary" class="mt-5">修改用户信息</el-button>
			<el-button type="primary" class="mt-5">修改密码</el-button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getUserInfo } from '@/api/userInfo'
import { onMounted, reactive } from 'vue'

const userInfo = reactive({
	email: '',
	name: '',
})

onMounted(async () => {
	loadUserInfo()
})

const loadUserInfo = async () => {
	const res = await getUserInfo()
	if (res.code !== 200) {
		return
	}
	userInfo.email = res.data.email
	userInfo.name = res.data.name
}
</script>
