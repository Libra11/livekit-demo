<template>
	<div class="flex h-screen flex-col items-center justify-center">
		<div class="w-80">
			<el-form ref="form" :model="formData" label-width="100px">
				<el-form-item label="会议名称" prop="name" required>
					<el-input v-model="formData.name" />
				</el-form-item>
				<el-form-item label="会议描述" prop="description">
					<el-input v-model="formData.description" />
				</el-form-item>
				<el-form-item label="会议时间" required>
					<el-col :span="11">
						<el-form-item prop="date1">
							<el-date-picker v-model="formData.startTime" type="date" label="Pick a date" placeholder="Pick a date" style="width: 100%" />
						</el-form-item>
						<el-form-item prop="time1">
							<el-time-select
								v-model="formTime.startTime"
								start="00:00"
								end="23:30"
								step="00:30"
								label="Pick a time"
								placeholder="Pick a time"
								style="width: 100%"
							/>
						</el-form-item>
					</el-col>
					<el-col class="text-center" :span="2">
						<span class="text-gray-500">-</span>
					</el-col>
					<el-col :span="11">
						<el-form-item prop="date2">
							<el-date-picker v-model="formData.endTime" type="date" label="Pick a date" placeholder="Pick a date" style="width: 100%" />
						</el-form-item>
						<el-form-item prop="time2">
							<el-time-select
								v-model="formTime.endTime"
								start="00:00"
								end="23:30"
								step="00:30"
								label="Pick a time"
								placeholder="Pick a time"
								style="width: 100%"
							/> </el-form-item
					></el-col>
				</el-form-item>
				<el-form-item label="入会密码" prop="password">
					<el-input v-model="formData.password" />
				</el-form-item>
				<el-form-item label="开启安全加密" prop="isSecurity">
					<el-switch v-model="formData.isSecurity" />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="createMeet">创建会议</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { createMeetByConfig } from '@/api/meet'
import type { MeetConfig } from '@/api/meet'

const formData = reactive<MeetConfig>({
	name: '',
	description: '',

	startTime: new Date(),
	endTime: new Date(),

	isPrivate: false,
	hasPassword: false,
	isSecurity: false,

	password: '',
})

const formTime = reactive({
	startTime: '',
	endTime: '',
})

const createMeet = async () => {
	// 处理时间
	formData.startTime.setHours(parseInt(formTime.startTime.split(':')[0]))
	formData.startTime.setMinutes(parseInt(formTime.startTime.split(':')[1]))
	formData.endTime.setHours(parseInt(formTime.endTime.split(':')[0]))
	formData.endTime.setMinutes(parseInt(formTime.endTime.split(':')[1]))

	formData.startTime.setSeconds(0)
	formData.startTime.setMilliseconds(0)
	formData.endTime.setSeconds(0)
	formData.endTime.setMilliseconds(0)

	if (formData.password === '') {
		formData.hasPassword = false
	} else {
		formData.hasPassword = true
	}

	const res = await createMeetByConfig(formData)
	if (res.code !== 200) {
		ElMessage.error('创建会议失败')
		return
	}

	ElMessage.success('创建会议成功')
}
</script>
