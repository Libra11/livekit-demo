/*
 * @Author: Libra
 * @Date: 2023-03-31 11:17:31
 * @LastEditTime: 2023-03-31 11:17:31
 * @LastEditors: Libra
 * @Description: 暗黑模式切换
 */
import { useDark, useToggle } from '@vueuse/core'

export const isDark = useDark()
export const toggleDark = useToggle(isDark)
