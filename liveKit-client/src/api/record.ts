import fetch from '@/request'

type RecordResponse = {
	recordId: string
}

type StopResponse = {
}

// 开始录制
function startRecord(meetId: string) {
	const formData = new FormData()
	formData.append('meetId', meetId)
	return fetch<RecordResponse>(`/record/start`, { method: 'POST', formData })
}

function stopRecord(recordId: string) {
	const formData = new FormData()
	formData.append('recordId', recordId)
	return fetch<StopResponse>(`/record/stop`, { method: 'POST', formData })
}

export { startRecord, stopRecord }
