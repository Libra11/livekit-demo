<!--
 * @Author: Libra
 * @Date: 2023-08-07 16:50:55
 * @LastEditors: Libra
 * @Description: 
-->
<template>
	<div @click="toggle" :class="`${props.value ? 'bg-blue-400': ''}`" class="rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
		<i class="iconfont" :class="`icon-${icon}`"></i>
	</div>
</template>

<script lang="ts" setup>
interface Props {
	value: boolean
	icon: string
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
