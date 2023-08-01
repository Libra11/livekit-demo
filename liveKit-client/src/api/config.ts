/*
 * @Author: Libra
 * @Date: 2023-03-22 10:14:24
 * @LastEditTime: 2023-05-25 14:45:30
 * @LastEditors: Libra
 * @Description: 测试环境和生产环境配置文件
 */

const dev_url: string = 'http://127.0.0.1:3000/api'

const exam_prod_url: string = 'https://exam-api.iguokao.com/'
let base: string = ''
switch (process.env.NODE_ENV) {
	case 'development':
		base = dev_url
		break
	case 'production':
		base = exam_prod_url
		break
	default:
		break
}
export { base }
