/*
 * @Author: Libra
 * @Date: 2023-03-22 14:06:14
 * @LastEditors: Libra
 * @Description:
 * @FilePath: /libra-vue3-all-in-one-template/src/api/test/index.ts
 */
import fetch from '@/request'

type Info = {
	name: string
	age: number
}

// 考生信息
function memberInfo() {
	return fetch<Info>(`/candidate/infos`)
}

export { memberInfo }
