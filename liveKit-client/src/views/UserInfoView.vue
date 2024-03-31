<template>
	<div class="item-center flex h-screen flex-col p-20">
		<div class="w-80">
			<el-descriptions title="用户信息">
				<el-descriptions-item label="用户名">{{ userInfo.name }}</el-descriptions-item>
				<el-descriptions-item label="邮箱">{{ userInfo.email }}</el-descriptions-item>
			</el-descriptions>
			<el-button type="primary" class="mt-5">修改用户名</el-button>
			<el-button type="primary" class="mt-5">修改邮箱</el-button>
			<el-button type="primary" class="mt-5" @click="dialogFormVisible = true">修改密码</el-button>
		</div>
	</div>

	<el-dialog v-model="dialogFormVisible" title="修改密码" width="400px">
		<el-form label-width="0">
			<el-form-item>
				<el-input autocomplete="off" type="password" placeholder="请输入原始密码" />
			</el-form-item>
			<el-form-item>
				<el-input autocomplete="off" type="password" placeholder="请输入新密码" />
			</el-form-item>
			<el-form-item>
				<el-input autocomplete="off" type="password" placeholder="请再此输入新密码" />
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="dialogFormVisible = false"> 确认 </el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { getUserInfo } from '@/api/userInfo'
import { onMounted, reactive, ref } from 'vue'

const dialogFormVisible = ref(false)

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
