<template>
	<div class="h-screen w-screen">
		<!-- 引入头部组件 -->
		<CustomHeader />

		<!-- 左侧菜单栏 -->
		<div :style="{ height: 'calc(100% - 80px)' }" class="flex">
			<UserCenterSidebar />

			<!-- 右侧页面内容 -->
			<router-view />
		</div>
	</div>
</template>

<script lang="ts" setup>
import CustomHeader from '@/components/CustomHeader.vue'
import UserCenterSidebar from '@/components/UserCenterSidebar.vue'
</script>
