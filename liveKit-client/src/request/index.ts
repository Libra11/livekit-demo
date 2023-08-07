/*
 * @Author: Libra
 * @Date: 2023-03-22 10:31:03
 * @LastEditTime: 2023-05-25 15:25:11
 * @LastEditors: Libra
 * @Description: fetch 封装
 */
import { base } from '@/api/config'
import { useToken } from '@/composables/useVar'
import { handleCode } from './code'

export type ResponseData<T> = {
	code: number
	data: T
	message: string
}

export interface RequestOptions extends Partial<RequestInit> {
	formData?: FormData
}

export function getOptions(options?: RequestOptions): RequestInit {
	const token = useToken().value
	const headers: Record<string, string> = {
		Authorization: token ? `Bearer ${token}` : '',
	}
	if (options?.formData) {
		options.body = options.formData
	} else {
		headers['Content-Type'] = 'application/json'
	}
	// 设置默认值
	const defaultOptions: RequestInit = {
		method: 'GET',
		headers,
	}
	return { ...defaultOptions, ...options }
}

export default async <T>(url: string, option?: RequestInit): Promise<ResponseData<T>> => {
	const newOption = getOptions(option)
	const newUrl = base + url
	try {
		const response = await fetch(newUrl, newOption)
		const res = await response.json()
		if (res.code === 200) return res
		handleCode(res)
		return res
	} catch (error) {
		return Promise.reject(error)
	}
}
