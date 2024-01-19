<template>
	<div class="flex flex-col bg-gray-200 p-4">
		<!-- 添加菜单项 -->
		<router-link to="/user-center/user-info">个人资料</router-link>
		<router-link to="/user-center/create-meet">创建会议</router-link>
		<router-link to="/user-center/join-meet">加入会议</router-link>
		<router-link to="/user-center/meet-arrangement">会议计划</router-link>
		<router-link to="/user-center/meet-history">历史会议</router-link>
		<router-link to="/user-center/contacts">联系人</router-link>
	</div>
</template>

<script lang="ts" setup></script>
