<template>
	<el-table :data="tableData" style="width: 100%" class="p-5">
		<el-table-column fixed prop="startTime" label="开始时间" width="240" :formatter="formatDate" />
		<el-table-column prop="endTime" label="结束时间" width="240" :formatter="formatDate" />
		<el-table-column prop="name" label="会议名称" width="240" />
		<el-table-column prop="id" label="会议号" width="200" />
		<el-table-column label="会议录像" width="240">
			<template #default="scope">
				<i v-if="scope.row.record" class="iconfont icon-dianbohuifang" @click="watchReplay(scope.row.recordUrl)"></i>
			</template>
		</el-table-column>
	</el-table>
</template>

<script lang="ts" setup>
import type { Meet } from '@/api/meet'
import { onMounted, reactive } from 'vue'
import { getMeetHistory } from '@/api/meet'

const tableData = reactive<Meet[]>([])

onMounted(async () => {
	loadData()
})

const loadData = async () => {
	const res = await getMeetHistory()
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

const watchReplay = (url: string) => {
	window.open(`/replay?url=${url}`)
}
</script>
