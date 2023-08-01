<!--
 * @Author: Libra
 * @Date: 2023-03-30 18:29:45
 * @LastEditTime: 2023-03-31 15:53:16
 * @LastEditors: Libra
 * @Description: 全局弹窗组件 
-->
<template>
	<el-dialog
		:title="title"
		:before-close="handleBeforeClose"
		:close-on-click-modal="closeOnClickModal"
		:show-close="showClose"
		:width="width"
		@update:model-value="updateVisible"
		@open="handleOpen"
	>
		<slot></slot>
		<template #footer>
			<div class="flex-c">
				<slot name="default-footer" v-if="useDefaultFooter">
					<el-button type="primary" @click="closeDialog">我知道了</el-button>
				</slot>
				<slot name="footer" v-else>
					<el-button :disabled="disabledTime > 0" type="primary" @click="confirm">确定 {{ disabledTime > 0 ? `( ${disabledTime} )` : '' }}</el-button>
					<el-button @click="closeDialog">取消</el-button>
				</slot>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
	title: {
		type: String,
		default: '弹窗标题',
	},
	closeOnClickModal: {
		type: Boolean,
		default: false,
	},
	showClose: {
		type: Boolean,
		default: true,
	},
	useDefaultFooter: {
		type: Boolean,
		default: false,
	},
	width: {
		type: String,
		default: '400',
	},
	confirmDelay: {
		type: Number,
		default: 0,
	},
})

const emit = defineEmits(['update:model-value', 'confirm', 'cancel'])

const disabledTime = ref(0)
let confirmTimer: any = null
const handleOpen = () => {
	if (props.confirmDelay <= 0) return
	disabledTime.value = props.confirmDelay
	confirmTimer = setInterval(() => {
		disabledTime.value--
		if (disabledTime.value <= 0) {
			clearInterval(confirmTimer)
		}
	}, 1000)
}

const handleBeforeClose = (done: () => void) => {
	emit('update:model-value', false)
	confirmTimer && clearInterval(confirmTimer)
	done()
}

const updateVisible = (value: boolean) => {
	emit('update:model-value', value)
}

const closeDialog = () => {
	emit('update:model-value', false)
	confirmTimer && clearInterval(confirmTimer)
}

const confirm = () => {
	emit('confirm')
	emit('update:model-value', false)
}
</script>
