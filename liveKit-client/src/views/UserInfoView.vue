<template>
	<div class="flex h-screen flex-col">
		<div class="w-80">
			<el-descriptions title="User Info">
				<el-descriptions-item label="Username">{{ userInfo.name }}</el-descriptions-item>
				<el-descriptions-item label="Telephone">{{ userInfo.phone }}</el-descriptions-item>
				<el-descriptions-item label="Email">{{ userInfo.email }}</el-descriptions-item>
			</el-descriptions>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getUserInfo } from '@/api/userInfo'
import { onMounted, reactive } from 'vue'

const userInfo = reactive({
	email: '',
	phone: '',
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
	userInfo.phone = res.data.phone
	userInfo.name = res.data.name
}
</script>
