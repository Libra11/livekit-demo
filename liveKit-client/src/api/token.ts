/*
 * @Author: Libra
 * @Date: 2023-08-03 15:54:02
 * @LastEditors: Libra
 * @Description:
 */
import fetch from '@/request'

// 考生信息
function getToken(userId: string, roomname: string) {
	return fetch<string>(`/token?identity=${userId}&roomName=${roomname}`)
}

export { getToken }
