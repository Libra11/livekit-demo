<template>
	<el-menu router>
		<el-menu-item index="/user-center/user-info">个人资料</el-menu-item>
		<el-menu-item index="/user-center/create-meet">创建会议</el-menu-item>
		<el-menu-item index="/user-center/join-meet">加入会议</el-menu-item>
		<el-menu-item index="/user-center/meet-arrangement">会议计划</el-menu-item>
		<el-menu-item index="/user-center/meet-history">历史会议</el-menu-item>
		<!-- <el-menu-item index="/user-center/contacts">联系人</el-menu-item> -->
	</el-menu>
</template>

<script setup lang="ts">
import { ElMenu, ElMenuItem } from 'element-plus'
</script>
