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
			<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="登录" name="login">
					<el-form ref="form" :model="formData" label-width="0">
						<el-form-item>
							<el-input v-model="formData.email" placeholder="请输入邮箱"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="formData.password" placeholder="请输入密码"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="loginByEmail">登录</el-button>
							<!-- 找回密码 -->
							<el-button type="text">忘记密码</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane label="注册" name="register">
					<el-form ref="form" :model="formData" label-width="0">
						<el-form-item>
							<el-input v-model="formData.userName" placeholder="请输入用户名"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input type="password" v-model="formData.userName" placeholder="请输入密码"></el-input>
						</el-form-item>
						<el-form-item>
							<el-input type="password" v-model="formData.email" placeholder="请确认密码"> </el-input>
						</el-form-item>
						<el-form-item>
							<el-input type="password" v-model="formData.email" placeholder="请输入邮箱">
								<template #append>
									<el-button :icon="Position" />
								</template>
							</el-input>
						</el-form-item>
						<el-form-item>
							<el-input v-model="formData.code" placeholder="请输入验证码"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="loginByCode">注册</el-button>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { emailRegister, emailLogin, registerCode, loginCode, codeLogin } from '@/api/user'
import { ElMessage } from 'element-plus'
import { UserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { Position } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = UserStore()
const activeName = 'login'

const formData = reactive({
	email: '',
	password: '',
	phone: '',
	code: '',
})

const registerByEmail = async () => {
	if (formData.email === '' || formData.password === '') {
		ElMessage.error('邮箱或密码不能为空')
		return
	}

	const res = await emailRegister(formData.email, formData.password)

	if (res.code !== 200) {
		return
	}

	ElMessage.success('注册成功')
}

const loginByEmail = async () => {
	if (formData.email === '' || formData.password === '') {
		ElMessage.error('邮箱或密码不能为空')
		return
	}

	const res = await emailLogin(formData.email, formData.password)

	if (res.code !== 200) {
		return
	}

	const token = res.data.token

	userStore.setToken(token)

	ElMessage.success('登录成功')
}

const sendRegisterCode = async () => {
	if (formData.phone === '') {
		ElMessage.error('手机号不能为空')
		return
	}

	const res = await registerCode(formData.phone)
	if (res.code !== 200) {
		return
	}

	ElMessage.info('发送成功')
}

const sendLoginCode = async () => {
	if (formData.phone === '') {
		ElMessage.error('手机号不能为空')
		return
	}

	const res = await loginCode(formData.phone)
	if (res.code !== 200) {
		return
	}

	ElMessage.success('发送成功')
}

const loginByCode = async () => {
	if (formData.phone === '' || formData.code === '') {
		ElMessage.error('手机号或验证码不能为空')
		return
	}

	const res = await codeLogin(formData.phone, formData.code)

	if (res.code !== 200) {
		return
	}

	const token = res.data.token

	userStore.setToken(token)

	ElMessage.success('登录成功')
	router.push({
		path: '/user-center',
	})
}
</script>
