/*
 * @Author: Libra
 * @Date: 2023-08-09 11:06:53
 * @LastEditors: Libra
 * @Description:
 */
import mitt from 'mitt'

const emitter = mitt<{
	showMessage: boolean
	changeLayout: string
	equallyDivided: string
}>()

export default emitter
