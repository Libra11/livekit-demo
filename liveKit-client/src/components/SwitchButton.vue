<!--
 * @Author: Libra
 * @Date: 2023-08-07 16:50:55
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<el-button @click="toggle">
		<i class="iconfont" :class="`icon-${value ? muteIcon : unmuteIcon}`"></i>
	</el-button>
</template>

<script lang="ts" setup>
interface Props {
	value: boolean
	unmuteIcon: string
	muteIcon: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
	(e: 'switch', id: boolean): void
}>()

const toggle = () => {
	emit('switch', !props.value)
}
</script>

<style scoped></style>
