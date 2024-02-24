<template>
	<div class="flex h-full w-full flex-row items-center justify-center">
		<!-- <div class="mr-2">
			<el-card shadow="hover" @click="quickCreate"> 快速创建 </el-card>
		</div>
		<div class="">
			
		</div> -->
		<el-button class="!h-[70px]" type="primary" @click="quickCreate">快速创建</el-button>
		<el-button class="!h-[70px]" type="primary" @click="createMeet"> 创建会议 </el-button>
	</div>
</template>

<script setup lang="ts">
import { quickCreateMeet, getInviteLink } from '@/api/meet'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

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

const router = useRouter()
const createMeet = () => {
	router.push('/user-center/meet-config')
}
</script>
