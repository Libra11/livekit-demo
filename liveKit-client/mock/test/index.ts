/*
 * @Author: Libra
 * @Date: 2023-03-22 14:26:56
 * @LastEditors: Libra
 * @Description:
 * @FilePath: /libra-vue3-all-in-one-template/mock/test/index.ts
 */
import { MockMethod } from 'vite-plugin-mock'
export default [
	{
		url: `/mock/api/candidate/info`,
		method: 'get',
		response: () => {
			return {
				code: 200,
				message: 'ok',
				data: ['tom', 'jerry'],
			}
		},
	},
] as MockMethod[]
