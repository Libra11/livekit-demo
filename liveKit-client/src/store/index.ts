/*
 * @Author: Libra
 * @Date: 2023-03-22 18:13:35
 * @LastEditTime: 2023-03-30 18:47:07
 * @LastEditors: Libra
 * @Description: store
 */
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persist'
export default createPinia().use(piniaPersist)
