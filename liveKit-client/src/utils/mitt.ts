/*
 * @Author: Libra
 * @Date: 2023-08-09 11:06:53
 * @LastEditors: Libra
 * @Description:
 */
import type { ILayout } from '@/store/modules/user'
import mitt from 'mitt'

const emitter = mitt<{
	showMessage: boolean
	changeLayout: ILayout
	equallyDivided: string
}>()

export default emitter
