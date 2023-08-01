/*
 * @Author: Libra
 * @Date: 2023-03-24 09:41:51
 * @LastEditTime: 2023-05-31 14:19:45
 * @LastEditors: Libra
 * @Description: tailwindcss 配置文件
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
	corePlugins: {
		// due to https://github.com/tailwindlabs/tailwindcss/issues/6602 - buttons disappear
		preflight: false,
	},
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],
	theme: {
		extend: {
			backgroundImage: () => ({
				gradient: 'radial-gradient(transparent 1px,var(--el-bg-color) 1px)',
			}),
			backgroundSize: {
				1: '0.25rem 0.25rem',
			},
			colors: {
				'primary-color': 'var(--el-color-primary)',
				'success-color': 'var(--el-color-success)',
			},
			backdropSaturate: {
				'1/2': '50%',
			},
		},
	},
	plugins: [],
}
