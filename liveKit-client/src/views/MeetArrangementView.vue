<template>
	<el-table :data="tableData" style="width: 100%" class="p-5">
		<el-table-column fixed prop="startTime" label="开始时间" width="240" :formatter="formatDate" />
		<el-table-column prop="name" label="会议名称" width="240" />
		<el-table-column prop="id" label="会议号" width="240" />
		<el-table-column fixed="right" label="操作" width="240">
			<template #default="scope">
				<el-button link type="primary" size="small" @click="handleJoin(scope.row.id)">加入</el-button>
				<el-button link type="primary" size="small" @click="handleJoin(scope.row.id)">取消</el-button>
				<el-button link type="primary" size="small" @click="handleJoin(scope.row.id)">邀请</el-button>
				<el-button link type="primary" size="small" @click="handleJoin(scope.row.id)">复制邀请链接</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>

<script lang="ts" setup>
import type { Meet } from '@/api/meet'
import { onMounted, reactive } from 'vue'
import { getMeetArrangement } from '@/api/meet'
import { useRouter } from 'vue-router'
import { getUserInfo, type UserInfo } from '@/api/userInfo'

const router = useRouter()

let userInfo: UserInfo

const handleJoin = (id: string) => {
	router.push({
		path: '/about',
		query: {
			username: userInfo.name,
			roomname: id,
			userId: userInfo.id,
			login: 'true',
		},
	})
}

const tableData = reactive<Meet[]>([])

onMounted(async () => {
	loadData()
	loadUserInfo()
})

const loadUserInfo = async () => {
	const res = await getUserInfo()
	if (res.code !== 200) {
		return
	}
	userInfo = res.data
}

const loadData = async () => {
	const res = await getMeetArrangement()
	if (res.code !== 200) {
		return
	}
	tableData.splice(0, tableData.length, ...res.data)
}

const formatDate = (_row, _column, cellValue, _index) => {
	const currentDate = new Date(cellValue)

	const year = currentDate.getFullYear()
	const month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
	const day = currentDate.getDate().toString().padStart(2, '0')
	const hours = currentDate.getHours().toString().padStart(2, '0')
	const minutes = currentDate.getMinutes().toString().padStart(2, '0')
	const seconds = currentDate.getSeconds().toString().padStart(2, '0')

	const formattedDate = `${month}月${day}日 ${hours}:${minutes}`

	return formattedDate
}
</script>
