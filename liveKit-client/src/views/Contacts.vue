<template>
	<el-table :data="tableData" style="width: 100%" class="p-5">
		<el-table-column fixed prop="userName" label="用户名" width="240" />
		<el-table-column label="操作" width="240">
			<template #default="scope">
				<el-button link type="primary" size="small">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script setup lang="ts"></script>

<style></style>
