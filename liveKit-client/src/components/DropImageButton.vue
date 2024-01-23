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
					<el-dropdown-item v-for="(image, index) in images" :key="index" :command="index">
						<div class="flex items-center">
							<el-icon v-if="selectedImage === index"><Select /></el-icon>
							<el-image style="width: 100px; height: 100px" :src="image" fit="contain" />
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
	images: string[]
	muteIcon: string
	unmuteIcon: string
	enabledClick: () => Promise<void>
	disabledClick: () => Promise<void>
	switchBackground: (image: string) => Promise<void>
}>()

const selectedImage = ref(0)
const isMuted = ref(true)
const icon = computed(() => {
	return isMuted.value ? props.muteIcon : props.unmuteIcon
})

const toggleMute = () => {
	isMuted.value = !isMuted.value
	isMuted.value ? props.disabledClick() : props.enabledClick()
}

const handleCommand = (index: number) => {
	const { switchBackground, images } = props
	selectedImage.value = index
	switchBackground(images[index])
}
</script>

<style scoped></style>
