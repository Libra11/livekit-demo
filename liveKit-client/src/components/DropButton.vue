<!--
 * @Author: Libra
 * @Date: 2023-08-04 14:25:11
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<div>
		<el-dropdown @command="handleCommand" split-button>
			<i class="iconfont" :class="`icon-${icon}`" @click="toggleMute"></i>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item v-for="(device, index) in devices" :key="index" :command="index">
						<div class="flex items-center">
							<el-icon v-if="selectedDevice === index"><Select /></el-icon>
							<span class="ml-2">{{ device.label }}</span>
						</div>
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { Select } from '@element-plus/icons-vue'

const props = defineProps<{
	devices: MediaDeviceInfo[]
	muteIcon: string
	unmuteIcon: string
	enabledClick: () => Promise<void>
	disabledClick: () => Promise<void>
	switchDevice: (device: MediaDeviceInfo) => Promise<void>
}>()

const selectedDevice = ref(0)
const isMuted = ref(false)
const icon = computed(() => {
	return isMuted.value ? props.muteIcon : props.unmuteIcon
})

const toggleMute = () => {
	isMuted.value = !isMuted.value
	isMuted.value ? props.disabledClick() : props.enabledClick()
}

const handleCommand = (index: number) => {
	const { switchDevice, devices } = props
	selectedDevice.value = index
	switchDevice(devices[index])
}
</script>

<style scoped></style>
