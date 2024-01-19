<template>
	<!-- 引入头部组件 -->
	<UserCenterHeader />

	<!-- 左侧菜单栏 -->
	<div class="flex">
		<UserCenterSidebar />

		<!-- 右侧页面内容 -->
		<router-view />
	</div>
</template>

<script lang="ts" setup>
import UserCenterHeader from '@/components/UserCenterHeader.vue'
import UserCenterSidebar from '@/components/UserCenterSidebar.vue'
</script>
