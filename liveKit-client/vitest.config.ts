/*
 * @Author: Libra
 * @Date: 2023-03-06 10:21:05
 * @LastEditTime: 2023-03-30 19:46:00
 * @LastEditors: Libra
 * @Description:
 */
import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: 'jsdom',
			exclude: [...configDefaults.exclude, 'e2e/*'],
			root: fileURLToPath(new URL('./', import.meta.url)),
		},
	})
)
