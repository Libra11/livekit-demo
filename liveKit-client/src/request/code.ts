/*
 * @Author: Libra
 * @Date: 2023-03-22 15:47:47
 * @LastEditTime: 2023-03-30 18:42:38
 * @LastEditors: Libra
 * @Description: 返回码处理
 */
import type { ResponseData } from '.'
import { ElMessage } from 'element-plus'

const code = {
	// 登录失败
	LOGIN_FAIL: 1005,
}

export function handleCode(res: ResponseData<string>) {
	switch (res.code) {
		case code.LOGIN_FAIL:
			// 登录失败
			ElMessage.error('登录失败')
			break
		default:
			ElMessage.error(res.message)
			break
	}
}
