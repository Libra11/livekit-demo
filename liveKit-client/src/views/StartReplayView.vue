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
					<el-input v-model="formData.url" placeholder="请输入用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="start">开始观看</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

import { ReplayStore } from '@/store/modules/replay'
// import { RoomStore } from '@/store/modules/room'

const router = useRouter()

const formData = reactive({
	url: '',
})

const replayStore = ReplayStore()

const start = () => {
	replayStore.setUrl(formData.url)
	router.push({
		path: '/replay',
	})
}
</script>
