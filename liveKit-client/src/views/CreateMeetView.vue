<template>
	<div class="flex h-full w-full flex-row justify-center">
		<div w-14 h-14 p-10>
			<el-card shadow="hover" @click="quickCreate"> 快速创建 </el-card>
		</div>
		<div w-14 h-14 p-10>
			<router-link to="/user-center/meet-config"><el-card shadow="hover"> 创建会议 </el-card></router-link>
		</div>
	</div>
</template>

<script setup lang="ts">
import { quickCreateMeet, getInviteLink } from '@/api/meet'
import { ElMessage } from 'element-plus'

const quickCreate = async () => {
	const res = await quickCreateMeet()
	if (res.code !== 200) {
		return
	}

	const linkRes = await getInviteLink(res.data.id.toString())
	if (linkRes.code !== 200) {
		return
	}
	console.log(linkRes.data.link)
	ElMessage.success('创建成功')
}
</script>
